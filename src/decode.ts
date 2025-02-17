import { ExtensionCodecType } from "./ExtensionCodec";
import { Decoder } from "./Decoder";

export type DecodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;

    /**
     * Maximum string length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxStrLength: number;
    /**
     * Maximum binary length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxBinLength: number;
    /**
     * Maximum array length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxArrayLength: number;
    /**
     * Maximum map length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxMapLength: number;
    /**
     * Maximum extension length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxExtLength: number;
    /**
     * Check that Map Keys are sorted and not duplicated
     */
    sortedKeys: boolean;
  }>
>;

export const defaultDecodeOptions: DecodeOptions = {};

/**
 * It decodes a MessagePack-encoded buffer.
 *
 * This is a synchronous decoding function. See other variants for asynchronous decoding: `decodeAsync()`, `decodeStream()`, `decodeArrayStream()`.
 */
export function decode(
  buffer: ArrayLike<number> | ArrayBuffer,
  options: DecodeOptions = defaultDecodeOptions,
): unknown {
  const decoder = new Decoder(
    options.extensionCodec,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
    options.sortedKeys,
  );
  decoder.setBuffer(buffer); // decodeSync() requires only one buffer
  return decoder.decodeSingleSync();
}
