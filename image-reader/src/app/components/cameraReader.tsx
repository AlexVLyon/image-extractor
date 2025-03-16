"use client"; // Required for Next.js (since this is browser-side code)
import { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import { Button, Container, Paper, Typography, Box, Snackbar } from "@mui/material";

const CameraReader = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [recognizedText, setRecognizedText] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [readerType, setReaderType] = useState("tesseract");

    const sendTextToAPI = async (text: string) => {
        try {
            const response = await fetch("/api/store-text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, readerType }),
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
        setReaderType("tesseract");

        const canvas = getCanvas();
        if(!canvas) {
            console.error("No canvas found");
            return;
        }

            // Convert to text with Tesseract
            Tesseract.recognize(canvas, "eng").then(({ data: { text } }) => {
                setRecognizedText(text);
            });
        
    };

    const getCanvas = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas;
        }
        return
    }
    


    const extractTextFromImageUsingOpenAI = async () => {
        try {
            setReaderType("openai");

            // const image = canvasRef.current?.toDataURL("image/jpeg");
            const fetchedCanvas = getCanvas();
            const image = fetchedCanvas?.toDataURL("image/jpeg");

            if (!image) {
                console.error("No image found in canvas");
                return;
            }

            const response = await fetch("/api/open-ai/extract-text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image }),
            });

            if (!response.ok) {
                throw new Error("Failed to extract text from image");
            }

            const data = await response.json();
            console.log("Text extracted from image:", data.text);
            setRecognizedText(data.text);
        } catch (error) {
            console.error("Error extracting text from image:", error);
        }
    }



    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Button variant="contained" color="primary" onClick={captureFrame}>
                    Capture & Recognize Text (Tesseract)
                </Button>
                <Button variant="contained" color="primary" onClick={() => extractTextFromImageUsingOpenAI()}>
                    Extract Text using OpenAI
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
