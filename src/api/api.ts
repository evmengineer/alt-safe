import { hexToNumber } from "viem";

export const checkRPCStatus = async (rpcUrl: string): Promise<boolean> => {
  const data = {
    jsonrpc: "2.0",
    id: "1",
    method: "web3_clientVersion",
  };
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // Check if there's a result in the response
    if (json.result) {
      return true;
    }

    console.error("Failed to connect to the RPC:", json);
    return false;
  } catch (error) {
    console.error("Failed to connect to the RPC:", error);
    return false;
  }
};

export const getChainId = async (rpcUrl: string): Promise<number | null> => {
  const data = {
    jsonrpc: "2.0",
    id: "1",
    method: "eth_chainId",
  };
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.result) {
      return hexToNumber(json.result);
    }

    console.error("Failed to connect to the RPC:", json);
    return null;
  } catch (error) {
    console.error("Failed to connect to the RPC:", error);
    return null;
  }
};
