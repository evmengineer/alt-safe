import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Address } from "viem";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";
import { STORAGE_KEY } from "../constants";
import { type SafeAccount, useSafeWalletContext } from "../context/WalletContext";
import AccountAddress from "./common/AccountAddress";

const ExistingSafeAccounts: React.FC = () => {
  const [safeAccounts, setSafeAccounts] = useState<SafeAccount[]>([]);
  const { setSafeAccount, storage } = useSafeWalletContext();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const storageAccounts = (await storage.getItem(STORAGE_KEY.SAFE_ACCOUNTS)) as SafeAccount[];
      setSafeAccounts(storageAccounts || []);
    })();
  }, [storage]);

  const handleDelete = async (addressToDelete: Address) => {
    const updatedAccounts = safeAccounts.filter((account: SafeAccount) => account.address !== addressToDelete);
    setSafeAccounts(updatedAccounts);
    await storage.setItem(STORAGE_KEY.SAFE_ACCOUNTS, updatedAccounts);
  };

  const handleAddressClick = async (address: Address) => {
    setSafeAccount(address);
    await storage.setItem(STORAGE_KEY.LAST_SELECTED_SAFE_ACCOUNT, address);
    navigate("/safe-info");
  };

  const handleSettingsClick = async (address: Address) => {
    setSafeAccount(address);
    await storage.setItem(STORAGE_KEY.LAST_SELECTED_SAFE_ACCOUNT, address);
    navigate("/settings");
  };

  const onHistoryClick = async () => {
    navigate("/history");
  };

  return (
    <Grid container spacing={2}>
      <Grid sx={{ marginTop: 2 }} container size={12} justifyContent="space-between" alignItems="center">
        <Grid>
          <Typography variant="h4">Safe Accounts</Typography>
        </Grid>
        <Grid>
          <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => onHistoryClick()}>
            Transaction History
          </Button>
        </Grid>
      </Grid>
      {safeAccounts.length > 0 ? (
        safeAccounts.map((safeAccount) => (
          <Grid size={12} key={safeAccount.address}>
            <AccountCard
              safeAccount={safeAccount}
              onAddressClick={handleAddressClick}
              onSettingsClick={handleSettingsClick}
              onDeleteClick={handleDelete}
            />
          </Grid>
        ))
      ) : (
        <Grid size={12}>
          <Typography>No accounts available. Create a new account or import existing.</Typography>
        </Grid>
      )}
    </Grid>
  );
};

const AccountCard: React.FC<{
  safeAccount: SafeAccount;
  onAddressClick: (address: Address) => void;
  onSettingsClick: (address: Address) => void;
  onDeleteClick: (address: Address) => void;
}> = ({ safeAccount, onAddressClick, onSettingsClick, onDeleteClick }) => {
  const address = safeAccount.address;
  const { data: balance } = useBalance({ address });
  const handleCopyToClipboard = (address: Address) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <Card>
      <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Grid container size={12} alignItems="center">
          <Grid sx={{ cursor: "pointer" }} onClick={() => onAddressClick(address)}>
            <Grid>
              <AccountAddress address={address} />
            </Grid>
          </Grid>
          <Grid>
            <IconButton size="small" onClick={() => handleCopyToClipboard(address)} sx={{ ml: 1 }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Grid>
          <Grid container size={12}>
            <Grid size={12}>
              <Typography>
                Balance: {formatUnits(balance?.value || 0n, 18)} {balance?.symbol}
              </Typography>
            </Grid>
            <Grid size={12}>Chains: {safeAccount.chainIds.join(", ")}</Grid>
          </Grid>
        </Grid>
        <CardActions>
          <IconButton onClick={() => onSettingsClick(address)}>
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={() => onDeleteClick(address)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ExistingSafeAccounts;
