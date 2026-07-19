import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { createParser } from "nuqs";

export const compressedCodeParser = createParser({
  parse(queryValue) {
    if (!queryValue) return null;
    return decompressFromEncodedURIComponent(queryValue) || null;
  },
  serialize(value) {
    return value ? compressToEncodedURIComponent(value) : "";
  },
});
