import { Container, Typography } from "@mui/material";
import type React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Last Updated: [01-01-2025]</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>1. Introduction</strong>
        <br />
        This Privacy Policy ("Policy") delineates the modalities through which [Your Company Name] ("we," "us," or
        "our") administers, utilizes, and safeguards information pertinent to users ("you" or "your") within the ambit
        of our wallet user interface ("Service"). By engaging with our Service, you manifest your assent to the
        stipulations encapsulated herein.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>2. Data Collection and Usage</strong>
        <br />
        <em>a. Personal Data</em>
        <br />
        We categorically abstain from the collection, storage, or processing of any personal data that could be employed
        to identify an individual, either directly or indirectly. Our Service is architected to function devoid of
        necessitating such information.
        <br />
        <em>b. Non-Personal Data</em>
        <br />
        We do not accumulate non-personal data, including but not limited to anonymized or aggregated data, through your
        interaction with the Service.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>3. Local Storage Utilization</strong>
        <br />
        Our Service leverages the local storage mechanism inherent to your web browser to preserve data indispensable
        for its operational efficacy. This data is confined to your device and is not transmitted to or accessible by
        us. The utilization of local storage is imperative for functionalities such as:
        <ul>
          <li>Retention of user preferences and settings.</li>
          <li>Maintenance of session states to facilitate seamless user experience.</li>
          <li>Storage of cryptographic keys or identifiers requisite for blockchain interactions.</li>
        </ul>
        You retain the autonomy to manage or expunge local storage data via your browser settings; however, such actions
        may impede or incapacitate certain functionalities of the Service.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>4. Cookies and Tracking Technologies</strong>
        <br />
        We do not deploy cookies, beacons, pixels, or analogous tracking technologies within our Service. Our commitment
        to user privacy ensures that no tracking mechanisms are employed to monitor, collect, or analyze user behavior
        or interactions.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>5. Third-Party Services</strong>
        <br />
        Our Service may encompass integrations or references to third-party services, decentralized applications
        (dApps), or external links. It is imperative to acknowledge that:
        <ul>
          <li>We do not govern or oversee the data collection practices of these third-party entities.</li>
          <li>
            Engagement with third-party services is subject to their respective privacy policies and terms of service.
          </li>
          <li>We disclaim any liability arising from your interactions with such third-party services.</li>
        </ul>
        We advocate for a meticulous review of the privacy policies and terms of any third-party services prior to
        engagement.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>6. Data Security and User Responsibility</strong>
        <br />
        While we endeavor to implement robust security protocols to safeguard the Service's infrastructure, the onus of
        ensuring the security and confidentiality of data stored on your device resides with you. This encompasses:
        <ul>
          <li>Safeguarding access to your device through secure passwords or biometric authentication.</li>
          <li>Regularly updating software to mitigate vulnerabilities.</li>
          <li>Exercising caution when interacting with external links or downloading content.</li>
        </ul>
        We repudiate any liability for data breaches, unauthorized access, or data leaks emanating from your device or
        arising from your actions.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>7. Legal Compliance and Jurisdictional Considerations</strong>
        <br />
        Our Service is engineered to operate in consonance with pertinent data protection regulations and privacy laws.
        However, given the global accessibility of the Service in the form of code, it is incumbent upon you to ensure
        that your use complies with local laws and regulations. We disclaim responsibility for any non-compliance
        arising from your use of the Service in jurisdictions with specific legal requisites.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>8. Amendments to This Privacy Policy</strong>
        <br />
        We reserve the unmitigated right to modify, amend, or update this Policy at our sole discretion. Such changes
        shall become effective immediately upon posting the revised Policy within the Service. Continued utilization of
        the Service post-amendment constitutes your acceptance of the revised terms. We encourage periodic review of
        this Policy to remain apprised of any alterations.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>9. Contact Information</strong>
        <br />
        For inquiries, concerns, or elucidations regarding this Privacy Policy, please contact us at [Insert Contact
        Information].
      </Typography>
      <Typography variant="body1">
        <em>
          By accessing and utilizing this Service, you acknowledge that you have read, comprehended, and consented to
          the terms delineated in this Privacy Policy.
        </em>
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
