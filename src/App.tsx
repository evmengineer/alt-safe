import { Box, Container } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddCustomDeployment from "./components/AddCustomDeployment.tsx";
import BottomBar from "./components/BottomBar.tsx";
import Home from "./components/Home";
import ImportSafe from "./components/ImportSafe.tsx";
import NavigationBar from "./components/NavigationBar";
import SafeTransactionHistory from "./components/SafeTransactionHistory.tsx";
import Settings from "./components/Settings";
import Welcome from "./components/Welcome.tsx";
import CreateSafe from "./components/createSafe/CreateSafe.tsx";
import About from "./components/other/About.tsx";
import PrivacyPolicy from "./components/other/PrivacyPolicy.tsx";
import SafeInfo from "./components/safeInfo/SafeInfo.tsx";
import AggregateSignaturesAndExecute from "./components/transaction/AggregateSignaturesAndExecute.tsx";
import CreateTransaction from "./components/transaction/CreateTransaction.tsx";
import { WalletProvider } from "./context/WalletContext";
import SafeLiteThemeProvider from "./theme/SafeLiteThemeProvider.tsx";

function App() {
  return (
    <>
      <SafeLiteThemeProvider>
        <WalletProvider>
          <Router>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <NavigationBar />
              <Container>
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/create" element={<CreateSafe />} />
                  <Route path="/transact" element={<CreateTransaction />} />
                  <Route path="/history" element={<SafeTransactionHistory />} />
                  <Route path="/safe-info" element={<SafeInfo />} />
                  <Route path="/import" element={<ImportSafe />} />
                  <Route path="/add-custom-deployment" element={<AddCustomDeployment />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/aggregate-signatures" element={<AggregateSignaturesAndExecute />} />
                </Routes>
              </Container>
            </Box>
            <Box>
              <BottomBar />
            </Box>
          </Router>
        </WalletProvider>
      </SafeLiteThemeProvider>
    </>
  );
}

export default App;
