import { TokenHandler } from "./_handler";

// Takes an EXTLINK token and turns it into clickable link. expects `url` and `text` argument

export const extlink: TokenHandler = opts => {
  const { args } = opts;
  const { url, text } = args;
  if (!url) {
    throw new Error("Have to provide extlink url!");
  }
  if (!text) {
    throw new Error("Have to provide extlink text!");
  }
  return `<a class="md-external-link" href="${url.replace(
    /EQUALS/g,
    "="
  )}" target="_blank" rel="noopener">${text}</a>`;
};
