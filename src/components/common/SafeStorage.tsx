import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import type { SafeStorage } from "../../utils/storageReader";
import AccountAddress from "./AccountAddress";

const ViewSafeStorage: React.FC<{ safeStorage: SafeStorage }> = ({ safeStorage }) => {
  return (
    <>
      <Grid container size={12}>
        <Grid size={4}>
          <Typography>Safe Singleton</Typography>
        </Grid>
        <Grid size={8}>
          <AccountAddress address={safeStorage?.singleton} />
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={4}>
          <Typography>Fallbackhandler</Typography>
        </Grid>
        <Grid size={8}>
          <AccountAddress address={safeStorage?.fallbackHandler} />
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={4}>
          <Typography>Threshold</Typography>
        </Grid>
        <Grid size={8}>
          <Typography component="code" sx={{ fontFamily: "monospace" }} align="left">
            {safeStorage?.threshold.toString()}
          </Typography>
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={4}>
          <Typography>Safe Nonce</Typography>
        </Grid>
        <Grid size={8}>
          <Typography component="code" sx={{ fontFamily: "monospace" }} align="left">
            {safeStorage?.nonce.toString()}
          </Typography>
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={4}>
          <Typography>Owner Count</Typography>
        </Grid>
        <Grid size={8}>
          <Typography component="code" sx={{ fontFamily: "monospace" }} align="left">
            {safeStorage?.ownerCount.toString()}
          </Typography>
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={4}>
          <Typography>Owners</Typography>
        </Grid>
        <Grid container size={8}>
          {safeStorage?.owners?.map((owner) => (
            <Grid size={12} key={owner}>
              <AccountAddress address={owner} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid container size={12}>
        <Grid size={4}>
          <Typography>Modules</Typography>
        </Grid>
        <Grid size={8}>
          {safeStorage?.modules?.map((module) => (
            <Grid size={12} key={module}>
              <AccountAddress address={module} />
            </Grid>
          ))}

          {safeStorage?.modules?.length === 0 && (
            <Typography component="code" sx={{ fontFamily: "monospace" }} align="left">
              No modules enabled
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ViewSafeStorage;
