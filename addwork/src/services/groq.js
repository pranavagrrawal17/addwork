const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a world-class CRO specialist and conversion copywriter. Analyze an ad creative image and a landing page, then generate surgical copy replacements that:
1. Create perfect message match between the ad and the landing page
2. Maintain the existing brand voice and tone of the page
3. Apply proven CRO principles: clarity, urgency, specificity, benefit-led copy
4. Only use claims and offers explicitly visible in the ad — never invent or hallucinate
Return ONLY a valid JSON object. No markdown fences. No explanation. No preamble. Just raw JSON.`;

async function toBase64DataUri(imageInput) {
  if (imageInput.startsWith('data:')) return imageInput;
  const res = await fetch(imageInput);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  const mimeType = res.headers.get('content-type') || 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

async function callGroq(apiKey, imageDataUri, prompt) {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageDataUri } },
            { type: 'text', text: prompt }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    const msg = err?.error?.message || JSON.stringify(err);
    throw new Error(`Groq API error ${response.status}: ${msg}`);
  }

  return response.json();
}

export async function analyzeAndPersonalize(imageInput, pageMarkdown) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_key_here') {
    throw new Error('Groq API key not configured. Add VITE_GROQ_API_KEY to your .env file.');
  }

  const userPrompt = `Analyze the ad creative image and the landing page content below. Generate personalized copy changes.

LANDING PAGE CONTENT:
${pageMarkdown}

Return ONLY this exact JSON with no other text:
{
  "ad_analysis": {
    "headline": "main headline from ad",
    "offer": "specific offer or value proposition",
    "cta": "call to action text from ad",
    "tone": "one word: professional or casual or urgent or friendly or bold",
    "product_category": "what is being advertised"
  },
  "page_changes": {
    "headline": "new page headline matching ad offer, benefit-led, under 10 words",
    "subheadline": "supporting line, addresses user pain point, under 20 words",
    "hero_copy": "2-3 sentence hero paragraph connecting ad promise to page",
    "cta_text": "button text matching ad CTA, 2-5 words",
    "urgency_element": "short urgency line if ad has time-limited offer, else empty string"
  },
  "confidence_score": 0.87
}`;

  const imageDataUri = await toBase64DataUri(imageInput);

  let data = await callGroq(apiKey, imageDataUri, userPrompt);
  let rawText = data.choices[0].message.content;
  let cleaned = rawText.replace(/```json|```/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Retry with stricter instruction
    data = await callGroq(apiKey, imageDataUri,
      userPrompt + '\n\nCRITICAL: Return ONLY the raw JSON starting with { and ending with }. No other text.');
    rawText = data.choices[0].message.content;
    cleaned = rawText.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const required = ['headline', 'subheadline', 'hero_copy', 'cta_text'];
  for (const key of required) {
    if (!parsed.page_changes?.[key] || parsed.page_changes[key].length < 3) {
      throw new Error(`AI returned invalid field: ${key}`);
    }
  }

  return parsed;
}
