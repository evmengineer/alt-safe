import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import type React from "react";
import { useEffect } from "react";
import { isAddressEqual, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { useSafeWalletContext } from "../context/WalletContext";
import ViewSafeStorage from "./common/SafeStorage";
import Title from "./common/Title";

const Settings: React.FC = () => {
  const { safeStorage, loadStorage, safeAccount } = useSafeWalletContext();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (safeAccount && isConnected && !isAddressEqual(safeAccount, zeroAddress)) {
      loadStorage(safeAccount);
    }
  }, [isConnected, safeAccount, loadStorage]);

  return (
    <Box id="settings-grid-container">
      <Grid size={12}>
        <Title text="Settings" />
      </Grid>
      <Grid container spacing={2} size={12}>
        {safeStorage && (
          <Grid>
            <ViewSafeStorage safeStorage={safeStorage} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Settings;
