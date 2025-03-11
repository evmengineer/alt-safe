import { Box, Button, Container, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import FeatureBox from "./common/Features";
import "../index.css";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import { supportedChains } from "../wagmi";

const Welcome: React.FC = () => {
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
        <Typography variant="h2" fontWeight="bold" color="primary">
          &lt;ALT&gt; Safe
        </Typography>
        <Typography variant="h6" gutterBottom>
          A simple alternative user interface to interact with Safe Smart Account contracts.
        </Typography>
        <Button sx={{ margin: 4 }} onClick={() => navigate("/home")} variant="contained">
          Get Started
        </Button>
        <Grid container spacing={4} size={12}>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox
              icon={<IntegrationInstructionsIcon />}
              title="Templates"
              description="Easy to extend using JSON templates"
            />
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox icon={<ShieldIcon />} title="Privacy" description="No trackers, No data collection" />
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox
              icon={<FeaturedPlayListIcon />}
              title="All-inclusive"
              description="Execute multi-sig, batched transactions"
            />
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <FeatureBox
              icon={<RemoveCircleIcon />}
              title="No Backend"
              description="Easy to deploy, no backend required"
            />
          </Grid>
          <Grid size={12}>
            <Typography>
              <Link href="https://github.com/evmengineer/alt-wallet" target="_blank">
                View source code
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

export default Welcome;
