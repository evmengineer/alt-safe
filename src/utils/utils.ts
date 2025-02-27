import {
  type Abi,
  type Address,
  encodeFunctionData,
  encodePacked,
  getContractAddress,
  keccak256,
  zeroAddress,
} from "viem";
import {
  type SafeDeployment,
  SafeDeploymentType,
  SafeVersion,
  canonicalAddresses_141,
} from "../safe-contracts/addresses/addresses";
import safe from "../safe-contracts/artifacts/Safe.json";
import safeProxy from "../safe-contracts/artifacts/SafeProxy.json";

export const getProxyAddress = (
  factory: `0x${string}`,
  singleton: `0x${string}`,
  inititalizer: `0x${string}`,
  nonce: bigint,
  proxyCreationCode?: `0x${string}`,
) => {
  const salt = keccak256(
    encodePacked(["bytes32", "uint256"], [keccak256(encodePacked(["bytes"], [inititalizer])), nonce]),
  );

  let creationCode = proxyCreationCode;
  if (!creationCode) {
    creationCode = safeProxy.bytecode as `0x${string}`;
  }

  const deploymentCode = encodePacked(["bytes", "uint256"], [creationCode || "0x", singleton as unknown as bigint]);
  return getContractAddress({
    bytecode: deploymentCode,
    from: factory,
    opcode: "CREATE2",
    salt: salt,
  });
};

export const calculateInitData = (owners: Address[], threshold: number, fallbackHandler: Address) => {
  const setupCalldata = encodeFunctionData({
    abi: safe.abi as Abi,
    functionName: "setup",
    args: [owners, threshold, zeroAddress, "0x", fallbackHandler, `0x${"00".repeat(20)}`, 0, `0x${"00".repeat(20)}`],
  });

  return setupCalldata;
};

export type MultiSendTransaction = {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  operation: number;
};

export type MultiSendTransactions = MultiSendTransaction[];

export const getMultiSendCallData = (transactions: MultiSendTransactions): `0x${string}` => {
  // Encode the transactions into the format required by MultiSend contract
  let packedTransactions = "0x"; // Start with empty hex string
  for (const tx of transactions) {
    const encodedTx = encodePacked(
      ["uint8", "address", "uint256", "uint256", "bytes"],
      [tx.operation, tx.to, tx.value, BigInt(tx.data.length), tx.data],
    );
    packedTransactions += encodedTx.slice(2); // Append the packed transaction data
  }
  return packedTransactions as `0x${string}`;
};

export const getShortAddress = (address: Address): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getShortTransactionHash = (address: Address): string => {
  return `${address.slice(0, 10)}...${address.slice(-10)}`;
};

export const getSafeAddresses = (
  _chainId: number,
  version: SafeVersion = SafeVersion.V1_4_1,
  _deploymentType: SafeDeploymentType = SafeDeploymentType.CANONICAL,
): SafeDeployment | undefined => {
  if (version === SafeVersion.V1_4_1) return canonicalAddresses_141;
};

export enum SafeOperation {
  CALL = 0,
  DELEGATE_CALL = 1,
}

export interface MetaTransaction {
  to: Address;
  value: bigint;
  data: `0x${string}`;
  operation: SafeOperation;
}

export interface SafeTransactionParams extends MetaTransaction {
  safeTxGas: bigint;
  baseGas: bigint;
  gasPrice: bigint;
  gasToken: string;
  refundReceiver: string;
  nonce: bigint;
}

export const SAFE_TX_TYPEHASH = keccak256(
  new TextEncoder().encode(
    "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)",
  ),
);

export function domainSeparator(): string {
  return keccak256(new TextEncoder().encode("EIP712Domain(uint256 chainId,address verifyingContract)"));
}

export const EIP_DOMAIN = {
  EIP712Domain: [
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
};

export const EIP712_SAFE_TX_TYPE = {
  SafeTx: [
    { type: "address", name: "to" },
    { type: "uint256", name: "value" },
    { type: "bytes", name: "data" },
    { type: "uint8", name: "operation" },
    { type: "uint256", name: "safeTxGas" },
    { type: "uint256", name: "baseGas" },
    { type: "uint256", name: "gasPrice" },
    { type: "address", name: "gasToken" },
    { type: "address", name: "refundReceiver" },
    { type: "uint256", name: "nonce" },
  ],
};

export interface SafeSignature {
  signer: string;
  data: string;
  // a flag to indicate if the signature is a contract signature and the data has to be appended to the dynamic part of signature bytes
  dynamic?: true;
}

export const buildSignatureBytes = (signatures: SafeSignature[]): string => {
  const SIGNATURE_LENGTH_BYTES = 65;
  signatures.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()));

  let signatureBytes = "0x";
  let dynamicBytes = "";
  for (const sig of signatures) {
    if (sig.dynamic) {
      /* 
              A contract signature has a static part of 65 bytes and the dynamic part that needs to be appended 
              at the end of signature bytes.
              The signature format is
              Signature type == 0
              Constant part: 65 bytes
              {32-bytes signature verifier}{32-bytes dynamic data position}{1-byte signature type}
              Dynamic part (solidity bytes): 32 bytes + signature data length
              {32-bytes signature length}{bytes signature data}
          */
      const dynamicPartPosition = (signatures.length * SIGNATURE_LENGTH_BYTES + dynamicBytes.length / 2)
        .toString(16)
        .padStart(64, "0");
      const dynamicPartLength = (sig.data.slice(2).length / 2).toString(16).padStart(64, "0");
      const staticSignature = `${sig.signer.slice(2).padStart(64, "0")}${dynamicPartPosition}00`;
      const dynamicPartWithLength = `${dynamicPartLength}${sig.data.slice(2)}`;

      signatureBytes += staticSignature;
      dynamicBytes += dynamicPartWithLength;
    } else {
      signatureBytes += sig.data.slice(2);
    }
  }

  return signatureBytes + dynamicBytes;
};
