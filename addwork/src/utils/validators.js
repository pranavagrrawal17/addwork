export const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
};

export const isValidImageUrl = (url) => {
  if (!isValidUrl(url)) return false;
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(new URL(url).pathname);
};
