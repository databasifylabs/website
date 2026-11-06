export type ImageSource = { type: string; srcSet: string };
export type ThemedSources = { light: readonly ImageSource[]; dark: readonly ImageSource[] };

const SCREEN_WIDTHS = [960, 1440, 2880] as const;
const SCREEN_FORMATS = ["avif", "webp"] as const;

function sourcesOf(path: string): ImageSource[] {
  return SCREEN_FORMATS.map((format) => ({
    type: `image/${format}`,
    srcSet: SCREEN_WIDTHS.map((width) => `${path}-${width}.${format} ${width}w`).join(", "),
  }));
}

export function screenImage(stem: string): { light: string; dark: string; sources: ThemedSources } {
  return {
    light: `${stem}-light-1440.webp`,
    dark: `${stem}-dark-1440.webp`,
    sources: { light: sourcesOf(`${stem}-light`), dark: sourcesOf(`${stem}-dark`) },
  };
}
