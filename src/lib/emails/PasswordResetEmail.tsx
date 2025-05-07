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
        <title>Your Password Reset Code is Here</title>
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
      <Preview>
        Hey {username}, your reset code is: {otp}
      </Preview>
      <Section>
        <Row>
          <Heading as="h2">Hey {username},</Heading>
        </Row>
        <Row>
          <Text>
            We heard you need a password reset—no problem! Here's your code to
            get back into your account:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>{otp}</Text>
        </Row>
        <Row>
          <Text>
            Didn't ask to reset your password? No worries—just ignore this email
            and your account will stay just the way you left it.
          </Text>
        </Row>
        <Row>
          <Text>If you need help, we’re just a message away!</Text>
        </Row>
        <Row>
          <Button
            onClick={() => navigator.clipboard.writeText(otp)}
            style={{
              backgroundColor: "#61dafb",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Copy Code
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
