import { Container, Typography } from "@mui/material";
import type React from "react";

const Terms: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Terms of Service
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Last Updated: [01-01-2025]</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>1. Acceptance of Terms</strong>
        <br />
        By accessing or using this wallet UI (the "Service"), you agree to be bound by these Terms of Service ("Terms").
        If you do not agree, you may not use the Service.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>2. Nature of Service</strong>
        <br />
        This Service provides an interface for interacting with smart contract accounts deployed on EVM-compatible
        blockchain networks. The Service does not custody funds, execute transactions, or hold private keys on behalf of
        users. All interactions with blockchain networks are conducted at your sole discretion and risk.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>3. No Warranty</strong>
        <br />
        The Service is provided "as is" and "as available" without any representations or warranties, express or
        implied. We do not guarantee that the Service will be uninterrupted, error-free, secure, or free from bugs,
        vulnerabilities, or exploits.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>4. User Responsibility</strong>
        <br />
        You acknowledge and agree that:
        <ul>
          <li>
            You are solely responsible for managing and safeguarding your private keys, seed phrases, and wallet
            credentials.
          </li>
          <li>
            Any loss or damages resulting from your use of the Service, including but not limited to loss of funds, are
            your sole responsibility.
          </li>
        </ul>
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>5. Limitation of Liability</strong>
        <br />
        To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, special,
        consequential, or exemplary damages arising from your use of or inability to use the Service, even if we have
        been advised of the possibility of such damages.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>6. No Responsibility for Smart Contracts</strong>
        <br />
        We do not control or audit any smart contracts that you may interact with via the Service. Any vulnerabilities,
        bugs, or issues in these smart contracts are beyond our control, and we disclaim any liability for losses or
        damages resulting from their use.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>7. Third-Party Services</strong>
        <br />
        The Service may link to or integrate with third-party services. We do not endorse, control, or take
        responsibility for the content, terms, or operations of these third-party services. Your interactions with third
        parties are solely at your risk.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>8. Compliance and Legal Use</strong>
        <br />
        You are solely responsible for ensuring your use of the Service complies with all applicable laws, regulations,
        and tax obligations in your jurisdiction.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>9. Indemnification</strong>
        <br />
        You agree to indemnify and hold us harmless from any claims, losses, damages, liabilities, or expenses arising
        from your use of the Service or violation of these Terms.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>10. Changes to the Terms</strong>
        <br />
        We reserve the right to update or modify these Terms at any time. Continued use of the Service after such
        changes constitutes your acceptance of the revised Terms.
      </Typography>
      <Typography variant="body1">
        <em>
          By using this Service, you acknowledge that you have read, understood, and agreed to these Terms of Service.
        </em>
      </Typography>
    </Container>
  );
};

export default Terms;
