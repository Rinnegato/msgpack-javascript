// DataView extension to handle int64 / uint64,
// where the actual range is 53-bits integer (a.k.a. safe integer)
export function setUint64(view: DataView, offset: number, value: number | bigint): void {
  let high: number, low: number;
  if (typeof value === "number") {
    high = value / 0x1_0000_0000;
    low = value; // high bits are truncated by DataView
  } else {
    if (value >= BigInt(0x1_0000_0000_0000_0000)) {
      throw new Error(`Too long bigint to store in uint64: ${value}`);
    }
    high = Number(value / BigInt(0x1_0000_0000));
    low = Number(BigInt.asUintN(32, value));
  }
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

export function setInt64(view: DataView, offset: number, value: number | bigint): void {
  let high: number, low: number;
  if (typeof value === "number") {
    high = Math.floor(value / 0x1_0000_0000);
    low = value; // high bits are truncated by DataView
  } else {
    if (value >= BigInt(0x8000_0000_0000_0000) || value <= BigInt(-0x8000_0000_0000_0000)) {
      throw new Error(`Too long bigint to store in int64: ${value}`);
    }
    const negative = value < BigInt(0);
    const _high = value / BigInt(0x1_0000_0000);
    high = Number(negative && _high * BigInt(0x1_0000_0000) !== value ? _high - BigInt(1): _high);
    low = Math.abs(Number(BigInt.asUintN(32, value))); // high bits are truncated by DataView
  }
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

export function getInt64(view: DataView, offset: number): bigint {
  const high = BigInt(view.getInt32(offset));
  const low = BigInt(view.getUint32(offset + 4));
  return high * BigInt(0x1_0000_0000) + low;
}

export function getUint64(view: DataView, offset: number): bigint {
  const high = BigInt(view.getUint32(offset));
  const low = BigInt(view.getUint32(offset + 4));
  return high * BigInt(0x1_0000_0000) + low;
}
