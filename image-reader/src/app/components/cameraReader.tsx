"use client"; // Required for Next.js (since this is browser-side code)
import { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import { Button, Container, Paper, Typography, Box, Snackbar } from "@mui/material";

const CameraReader = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [recognizedText, setRecognizedText] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const sendTextToAPI = async (text: string) => {
        try {
            const response = await fetch("/api/store-text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error("Failed to send text to API");
            }

            const data = await response.json();
            console.log("Text successfully sent to API:", data);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error sending text to API:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" }
                    }
                });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

        startCamera();
    }, []);

    const captureFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to text with Tesseract
            Tesseract.recognize(canvas, "eng").then(({ data: { text } }) => {
                setRecognizedText(text);
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Button variant="contained" color="primary" onClick={captureFrame}>
                    Capture & Recognize Text
                </Button>
                <Button variant="contained" color="secondary" onClick={() => sendTextToAPI(recognizedText)}>
                    Save
                </Button>
                <Paper elevation={3} style={{ padding: '16px', width: '100%' }}>
                    <Typography variant="h6">Recognized Text:</Typography>
                    <Typography variant="body1" color="textSecondary">
                        {recognizedText || "No text detected yet."}
                    </Typography>
                </Paper>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000} // Snackbar will auto-hide after 2 seconds
                onClose={handleCloseSnackbar}
                message="Text successfully sent to API"
            />
        </Container>
    );
};

export default CameraReader;
