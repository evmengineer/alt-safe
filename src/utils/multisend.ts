import { concatHex, encodePacked, toHex } from "viem";
import type { MetaTransaction } from "./utils";

export const encodeMetaTransaction = (tx: MetaTransaction): `0x${string}` => {
  const data = toHex(tx.data);
  const encoded = encodePacked(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [tx.operation, tx.to, tx.value, BigInt(data.length / 2 - 1), data],
  );
  return encoded.slice(2) as `0x${string}`;
};

export const encodeMultiSend = (txs: MetaTransaction[]): string => {
  return concatHex(txs.map((tx) => encodeMetaTransaction(tx)));
};
