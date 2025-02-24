import { Alert, Button, Link, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Address, isAddress, isAddressEqual, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { usePublicClient } from "wagmi";
import { STORAGE_KEY } from "../constants";
import { type SafeAccount, useSafeWalletContext } from "../context/WalletContext";
import { type SafeStorage, fetchStorageData } from "../utils/storageReader";
import ViewSafeStorage from "./common/SafeStorage";
import Title from "./common/Title";

const ImportSafe: React.FC = () => {
  const { setSafeAccount, storage } = useSafeWalletContext();
  const account = useAccount();
  const [address, setAddress] = useState<Address>(zeroAddress);
  const [error, setError] = useState<string>();
  const [imported, setImported] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const [safeStorage, setSafeStorage] = useState<SafeStorage | undefined>();
  const navigate = useNavigate();

  const handleLoadStorage = async () => {
    setImported(false);
    if (isAddress(address) && publicClient) {
      try {
        const result = await fetchStorageData(address, publicClient as any);
        if (!result.storage.singleton || isAddressEqual(result.storage.singleton, zeroAddress)) {
          setError("Singleton is empty or address(0)");
          return;
        }
        setSafeStorage(result.storage);
      } catch (e) {
        setError("Error fetching storage");
        return;
      }
    } else {
      setError("Invalid address");
    }
  };

  const handleImport = async () => {
    if (isAddress(address)) {
      setSafeAccount(address);
      const safeAccounts = (await storage.getItem(STORAGE_KEY.SAFE_ACCOUNTS)) as SafeAccount[];
      if (safeAccounts === null) {
        await storage.setItem(STORAGE_KEY.SAFE_ACCOUNTS, [{ address, chainId: account.chainId }]);
        setImported(true);
      } else if (safeAccounts.find((account) => account.address === address)) {
        setError("Address already imported");
      } else {
        setError(undefined);
        setImported(true);
        await storage.setItem(STORAGE_KEY.SAFE_ACCOUNTS, [...safeAccounts, { address, chainId: account.chainId }]);
      }
    } else {
      setError("Invalid address");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Title text="Import Existing Safe" />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          value={address}
          error={!!error}
          onChange={(e) => setAddress(e.target.value as `0x${string}`)}
          placeholder="Enter 20 bytes address"
          helperText={error}
        />
      </Grid>
      <Grid size={12}>
        <Button onClick={handleLoadStorage} variant="contained">
          Load Safe
        </Button>
      </Grid>
      {safeStorage && (
        <Grid size={12}>
          <ViewSafeStorage safeStorage={safeStorage} />{" "}
        </Grid>
      )}
      {safeStorage && (
        <Grid size={12}>
          <Button onClick={handleImport} variant="contained">
            Import Safe
          </Button>
        </Grid>
      )}
      {imported && (
        <Grid size={12}>
          <Alert severity="success">
            Safe imported successfully. Go to
            <Link
              component="button"
              onClick={() => {
                navigate("/home");
              }}
            >
              home
            </Link>
            to start using Safe.
          </Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default ImportSafe;
