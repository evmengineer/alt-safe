import { Container, Typography } from "@mui/material";
import type React from "react";

const About: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Who We Are</strong>
        <br />
        This project is a standalone initiative with no corporate backing or legal representation. It is the brainchild
        of independent developers who are passionate about decentralization and blockchain technology. There is no
        formal organization or company behind this project, and it is operated as an open and experimental platform.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Our Mission</strong>
        <br />
        Our mission is simple yet ambitious: to empower blockchain users by providing a seamless and decentralized way
        to interact with Safe smart contracts. This project is designed to work without relying on any additional
        backend services, ensuring that users retain full control over their data and transactions.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Why We Built This</strong>
        <br />
        The motivation behind this project is to make life easier for blockchain users by simplifying interactions with
        Safe Smart Account contracts and act as an alternative.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>No Tracking or Data Collection</strong>
        <br />
        We value your privacy and have ensured that the platform operates without any tracking or data collection. There
        are no cookies, analytics, or external data-sharing mechanisms. The project is designed to work entirely through
        local storage on your device, maintaining your data sovereignty.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Experimental Nature</strong>
        <br />
        Please note that this project is experimental and provided "as is." While we strive to ensure its functionality
        and reliability, it is not a commercial product and comes with no guarantees. Users are encouraged to approach
        the platform with an understanding of its exploratory and evolving nature.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Community-Driven Efforts</strong>
        <br />
        This project thrives on the support and feedback of its users. If you have suggestions, ideas, or issues to
        report, we encourage you to reach out. Together, we can make this platform a more robust and user-friendly tool
        for the blockchain community.
      </Typography>
      <Typography variant="body1">
        <em>
          Thank you for exploring our platform. We hope it makes your blockchain interactions smoother and more
          enjoyable.
        </em>
      </Typography>
    </Container>
  );
};

export default About;
