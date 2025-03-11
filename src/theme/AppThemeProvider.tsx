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
