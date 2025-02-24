import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { ReactNode } from "react";

// Create a custom theme for SafeLite
const safeliteTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4E8E8F", // Brighter Teal for better visibility
      contrastText: "#E0E0E0", // Soft Light Gray
    },
    secondary: {
      main: "#A68C5B", // Brighter Dusty Gold for better visibility
      contrastText: "#E0E0E0",
    },
    background: {
      default: "#1A1A1A", // Charcoal Black
      paper: "#2B2B2B", // Dark Slate Gray
    },
    text: {
      primary: "#E0E0E0", // Soft Light Gray
      secondary: "#B0B0B0", // Cool Gray
    },
    divider: "#4F4F4F", // Dim Gray
    success: {
      main: "#547F4E", // Moss Green
    },
    error: {
      main: "#9B3D3D", // Brick Red
    },
    warning: {
      main: "#A6792C", // Amber Brown
    },
    action: {
      hover: "#32383D", // Soft Gunmetal
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    fontSize: 14,
    h1: { fontWeight: 700, fontSize: "2.125rem", lineHeight: 1.3 },
    h2: { fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.4 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.57 },
  },
  shape: {
    borderRadius: 0, // Global border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 0, // Specific override for Button
          padding: "6px 16px",
        },
        containedPrimary: {
          backgroundColor: "#387076",
          "&:hover": {
            backgroundColor: "#4A8E8C", // Slightly brighter teal on hover
          },
        },
        containedSecondary: {
          backgroundColor: "#A68C5B",
          "&:hover": {
            backgroundColor: "#B49C6E", // Slightly brighter dusty gold on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#2B2B2B",
          border: "1px solid #4F4F4F",
          borderRadius: 0, // Specific override for Card
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#32383D",
          borderRadius: 0, // Specific override for Input
          padding: "6px 12px",
        },
      },
    },
  },
});

const SafeLiteThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={safeliteTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default SafeLiteThemeProvider;
