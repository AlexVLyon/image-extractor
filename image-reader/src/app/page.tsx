import CameraReader from "./components/cameraReader";
import { Typography, Container, Box } from "@mui/material";

export default function CameraReaderPage() {
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
    </Container>
  );
}
