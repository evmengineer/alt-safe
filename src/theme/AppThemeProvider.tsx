import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { amber, grey } from "@mui/material/colors";
import type { ReactNode } from "react";

// Create a custom theme for SafeLite with a retro aesthetic
const safeliteTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: amber[300],
    },
    secondary: {
      main: grey[500],
    },
    background: {
      default: "#121212",
      paper: "#1c1c1c",
    },
    text: {
      primary: grey[300],
      secondary: grey[400],
    },
  },
  typography: {
    fontFamily: "'IBM Plex Mono', monospace",
    h1: {
      fontWeight: 700,
      fontSize: "2rem", // Default for xs
      "@media (min-width:600px)": { fontSize: "2.5rem" }, // sm
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.8rem",
      "@media (min-width:600px)": { fontSize: "2.2rem" },
    },
    body1: {
      fontSize: "1rem",
      "@media (min-width:600px)": { fontSize: "1.1rem" },
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
  },
});

const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={safeliteTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
