import { Alert, Button, Checkbox, FormControlLabel, Link, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { simulateContract, writeContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Address, zeroAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { STORAGE_KEY } from "../../constants";
import { type SafeAccount, useSafeWalletContext } from "../../context/WalletContext";
import safeProxyFactory from "../../safe-contracts/artifacts/SafeProxyFactory.json";
import { calculateInitData, getProxyAddress } from "../../utils/utils";
import { config } from "../../wagmi";
import AccountAddress from "../common/AccountAddress";
import OwnerList from "./OwnerList";
import SaltSelector from "./SaltSelector";
import ThresholdSelector from "./Threshold";

const CreateSafe: React.FC = () => {
  const account = useAccount();
  const publicClient = usePublicClient();
  const navigate = useNavigate();
  const { safeDeployment, storage } = useSafeWalletContext();

  const [owners, setOwners] = useState<Address[]>([account.address || zeroAddress]);
  const [threshold, setThreshold] = useState<number>(1);
  const [salt, setSalt] = useState<bigint>(BigInt(0));
  const [initData, setInitData] = useState<`0x${string}`>("0x");
  const [proxyAddress, setProxyAddress] = useState<Address>();
  const [isAlreadyDeployed, setIsAlreadyDeployed] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [safeCreationTxHash, setSafeCreationTxHash] = useState<string>();

  const [proxyFactory, setProxyFactory] = useState<string>(safeDeployment?.proxyFactory || "");
  const [fallbackHandler, setFallbackHandler] = useState<string>(safeDeployment?.fallbackHandler || "");
  const [singletonL2, setSingletonL2] = useState<string>(safeDeployment?.singletonL2 || "");
  const [singleton, setSingleton] = useState<string>(safeDeployment?.singleton || "");
  const [useSingletonL2, setUseSingletonL2] = useState<boolean>(publicClient?.chain.sourceId !== undefined);

  // Update initData when owners or threshold change
  useEffect(() => {
    if (safeDeployment) {
      setProxyFactory(safeDeployment.proxyFactory);
      setFallbackHandler(safeDeployment.fallbackHandler);
      setSingletonL2(safeDeployment.singletonL2);
      setSingleton(safeDeployment.singleton);
    }
  }, [safeDeployment]);

  // Update initData when owners or threshold change
  useEffect(() => {
    if (safeDeployment) setInitData(calculateInitData(owners, threshold, safeDeployment.fallbackHandler));
  }, [owners, threshold, safeDeployment]);

  // Update proxyAddress when initData, safeDeployment, or salt change
  useEffect(() => {
    if (safeDeployment && initData !== "0x") {
      const safeSingleton = (useSingletonL2 ? safeDeployment.singletonL2 : safeDeployment.singleton) as `0x${string}`;
      setProxyAddress(getProxyAddress(safeDeployment.proxyFactory, safeSingleton, initData, salt));
    }
  }, [initData, safeDeployment, salt, useSingletonL2]);

  // Check if the Safe is already deployed
  useEffect(() => {
    if (proxyAddress && publicClient) {
      (async () => {
        const code = await publicClient.getCode({ address: proxyAddress });
        if (code !== undefined && code !== "0x") {
          setIsAlreadyDeployed(true);
        } else {
          setIsAlreadyDeployed(false);
        }
      })();
    }
  }, [proxyAddress, publicClient]);

  const handleAddOwner = () => {
    setOwners([...owners, zeroAddress]);
  };

  const handleRemoveOwner = (index: number) => {
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
    if (threshold > updatedOwners.length) {
      setThreshold(updatedOwners.length);
    }
  };

  const handleOwnerChange = (index: number, value: string) => {
    const updatedOwners = owners.map((owner, i) => (i === index ? value : owner)) as Address[];
    setOwners(updatedOwners);
  };

  const handleCreateSafe = async () => {
    if (proxyAddress && safeDeployment) {
      const abi = safeProxyFactory.abi;

      // Create the Safe
      const result = await simulateContract(config, {
        abi,
        address: safeDeployment.proxyFactory,
        functionName: "createProxyWithNonce",
        args: [useSingletonL2 ? safeDeployment.singletonL2 : safeDeployment.singleton, initData, salt],
      });

      const newSafeAddress = result.result;

      if (newSafeAddress !== proxyAddress) {
        setError("Expected proxy address does not match the calculated proxy address");
        return;
      }

      const txHash = await writeContract(config, result.request);
      setSafeCreationTxHash(txHash);
      if (
        safeDeployment.proxyFactory &&
        (useSingletonL2 ? safeDeployment.singletonL2 : safeDeployment.singleton) &&
        initData
      ) {
        setProxyAddress(newSafeAddress);
        const existingAccounts = (await storage.getItem(STORAGE_KEY.SAFE_ACCOUNTS)) as SafeAccount[];

        // No account in storage
        if (!existingAccounts) {
          await storage.setItem(STORAGE_KEY.SAFE_ACCOUNTS, [{ address: newSafeAddress, chainIds: [account.chainId] }]);
          return;
        }

        const safeAccount = existingAccounts.find((acc) => acc.address === newSafeAddress);
        // No Safe account with address === new Safe address in storage
        if (!safeAccount) {
          await storage.setItem(STORAGE_KEY.SAFE_ACCOUNTS, [
            ...existingAccounts,
            { address: newSafeAddress, chainIds: [account.chainId] },
          ]);
        } else {
          const updatedSafeAccounts = [
            ...existingAccounts.filter((acc) => acc.address !== newSafeAddress),
            { address: newSafeAddress, chainIds: [...safeAccount.chainIds, account.chainId] },
          ];
          await storage.setItem(STORAGE_KEY.SAFE_ACCOUNTS, updatedSafeAccounts);
        }
      }
    }
  };

  return (
    <>
      <Typography variant="h4">Create Safe Account</Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <OwnerList owners={owners} onOwnerChange={handleOwnerChange} onRemoveOwner={handleRemoveOwner} />
        </Grid>
        <Grid size={12}>
          <Button variant="contained" onClick={handleAddOwner}>
            Add Owner
          </Button>
        </Grid>
        <Grid size={12}>
          <ThresholdSelector threshold={threshold} setThreshold={setThreshold} ownersCount={owners.length} />
        </Grid>
        <Grid size={12}>
          <SaltSelector salt={salt} setSalt={setSalt} />
        </Grid>
        <Grid container size={12} spacing={2}>
          <Grid size={12}>
            <TextField
              label="Proxy Factory"
              value={proxyFactory}
              slotProps={{
                input: {
                  disabled: true,
                },
              }}
              onChange={(e) => setProxyFactory(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Fallback Handler"
              value={fallbackHandler}
              slotProps={{
                input: {
                  disabled: true,
                },
              }}
              onChange={(e) => setFallbackHandler(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={<Checkbox checked={useSingletonL2} onChange={(e) => setUseSingletonL2(e.target.checked)} />}
              label="Use SingletonL2"
            />
          </Grid>
          <Grid size={12}>
            {useSingletonL2 ? (
              <TextField
                label="Singleton L2"
                value={singletonL2}
                slotProps={{
                  input: {
                    disabled: true,
                  },
                }}
                onChange={(e) => setSingletonL2(e.target.value)}
                fullWidth
              />
            ) : (
              <TextField
                label="Singleton"
                slotProps={{
                  input: {
                    disabled: true,
                  },
                }}
                value={singleton}
                onChange={(e) => setSingleton(e.target.value)}
                fullWidth
              />
            )}
          </Grid>
        </Grid>
        {isAlreadyDeployed && (
          <Grid size={12}>
            <Alert severity="error">Safe already deployed with given config at address {proxyAddress}</Alert>
          </Grid>
        )}
        <Grid size={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateSafe}
            disabled={isAlreadyDeployed || safeCreationTxHash !== undefined || account.status !== "connected"}
          >
            Create
          </Button>
        </Grid>
        <Grid size={12}>
          {safeCreationTxHash && (
            <Alert severity="info">
              Safe creation transaction: {safeCreationTxHash}. <br /> Go to{" "}
              <Link
                component="button"
                onClick={() => {
                  navigate("/home");
                }}
              >
                home
              </Link>
              to start using Safe if transaction succeeded.
            </Alert>
          )}
        </Grid>
        <Grid size={12}>{error && <Alert severity="error">{error}</Alert>}</Grid>
        {account.status === "connected" && (
          <Grid>
            <Typography>
              Safe will be deployed at address <AccountAddress address={proxyAddress} />
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default CreateSafe;
