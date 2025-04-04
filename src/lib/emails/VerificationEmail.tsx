import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Your Verification Code is Here</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Hi there! Your verification code is: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hey {username}, glad to see you!</Heading>
        </Row>
        <Row>
          <Text>
            Thanks for signing up! Here’s your verification code to finish your
            registration:
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>
            Didn’t request this code? No worries—just ignore this email.
          </Text>
        </Row>
        <Row>
          <Button
            onClick={() => navigator.clipboard.writeText(otp)}
            style={{ color: "#61dafb" }}
          >
            Copy
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
