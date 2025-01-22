import ImageInternal from './image.astro';
import PictureInternal from './picture.astro';

export const Image = ImageInternal;
export const Picture = PictureInternal;

export const getImage = async (options) => {
  const resolvedSrc =
    typeof options.src === "object" && "then" in options.src
      ? (await options.src).default ?? (await options.src)
      : options.src;
  return {
    rawOptions: {
      src: {
        src: resolvedSrc,
      },
    },
    options: {
      src: {
        src: resolvedSrc,
      },
    },
    src: resolvedSrc,
    srcSet: { values: [] },
    attributes: { }
  }
}

export const inferRemoteSize = async () => {
  console.warn("[Bookshop] inferRemoteSize is not supported in Bookshop. Please use an editing fallback instead.");
  return {};
}
