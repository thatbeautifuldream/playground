import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { createParser } from "nuqs";

export const compressedCodeParser = createParser({
  parse(queryValue) {
    if (!queryValue) return null;
    try {
      return decompressFromEncodedURIComponent(queryValue) || null;
    } catch {
      return null;
    }
  },
  serialize(value) {
    return value ? compressToEncodedURIComponent(value) : "";
  },
});
