import { Box, Button, Container, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import FeatureBox from "./common/Features";
import "../index.css";
import { supportedChains } from "../wagmi";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h1" className="gradientText">
          ALT Wallet
        </Typography>
        <Typography variant="h5">
          A simple alternative user interface to interact with Safe Smart Account contracts.
        </Typography>
        <Button sx={{ margin: 4 }} onClick={() => navigate("/home")} variant="contained">
          Get Started
        </Button>
        <Grid container spacing={4} size={12}>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox
              icon="🔒"
              title="Non-Custodial"
              description="You have full control over your funds. No intermediaries, no risks."
            />
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox
              icon="⚡"
              title="No Backend"
              description="Enjoy fast and seamless transactions with a backend-less architecture."
            />
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox
              icon="🔗"
              title="Bring Your Own RPC"
              description="Customize your experience by connecting to any RPC URL of your choice."
            />
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox icon="🛡️" title="Full Privacy" description="No trackers, No data collection." />
          </Grid>

          <Grid size={12}>
            <Typography>
              <Link href="https://github.com/evmengineer/alt-wallet" target="_blank">
                View Soruce Code
              </Link>
            </Typography>
          </Grid>
          <Grid container size={12}>
            <Grid size={12}>
              <Typography variant="h5">Supported Chains</Typography>
            </Grid>
            <Grid>
              {supportedChains.map((chain) => (
                <Typography key={chain.id} sx={{ marginRight: 2 }} variant="caption" gutterBottom>
                  {chain.name}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
