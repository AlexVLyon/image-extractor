import ReceiptReader from "../components/receiptReader";
import { Typography, Container, Box } from "@mui/material";

export default function ReceiptReaderPage() {
  return (
    <Container>
      <Box component="main" sx={{ my: 4 }}>
        <section id="camera">
          <Typography variant="h4" component="h1" gutterBottom>
            Receipt Reader
          </Typography>

          <Typography variant="body1" gutterBottom>
              Take a picture of a receipt and the app will extract the information from it.
          </Typography>
          <ReceiptReader />
        </section>
      </Box>
    </Container>
  );
}
