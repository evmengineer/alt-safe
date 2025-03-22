import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import ExistingSafeAccounts from "./ExistingSafeAccounts";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Grid container spacing={2} style={{ flex: 1 }} sx={{ minHeight: "100vh" }}>
        <Grid size={12}>
          <ExistingSafeAccounts />
        </Grid>
        <Grid container size={12}>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Button onClick={() => navigate("/create")} variant="contained" fullWidth>
              Create new Safe
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Button onClick={() => navigate("/import")} variant="outlined" fullWidth>
              Import
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
