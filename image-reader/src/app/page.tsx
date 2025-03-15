import Image from "next/image";
import CameraReader from "./components/cameraReader";
import { Typography, Container, Box, Link } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Box component="main" sx={{ my: 4 }}>
        <section id="camera">
          <Typography variant="h4" component="h1" gutterBottom>
            Camera Reader
          </Typography>
          <CameraReader />
        </section>
      </Box>
      <Box component="footer" sx={{ py: 2, textAlign: 'center' }}>
        <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" underline="none">
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </Link>
      </Box>
    </Container>
  );
}
