"use client"; // Required for Next.js (since this is browser-side code)
import { useState, useEffect, useRef } from "react";
import { Button, Container, Paper, Typography, Box, Snackbar } from "@mui/material";
import { Receipt } from "../../../types/receipt";
import ReceiptCard from "./receiptCard";

const CameraReader = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [receiptFound, setReceiptFound] = useState<Receipt | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const  [snackBarText, setSnackBarText] = useState("");


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };


    const saveReceipt = async (receipt: Receipt) => {
        try {
            const response = await fetch("/api/receipts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(receipt),
            });

            if (!response.ok) {
                throw new Error("Failed to save receipt");
            }

            const data = await response.json();
            console.log("Receipt saved:", data);
            setReceiptFound(data);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error saving receipt:", error);
        }
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
            const fetchedCanvas = getCanvas();
            const image = fetchedCanvas?.toDataURL("image/jpeg");

            if (!image) {
                console.error("No image found in canvas");
                return;
            }

            const response = await fetch("/api/open-ai/receipt-extractor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image }),
            });

            if (!response.ok) {
                // open snackbar: 
                setSnackBarText("Error extracting receipt from image");
                setOpenSnackbar(true);
                throw new Error("Failed to extract receipt from image");

            }

            const data = await response.json();
            console.log("Text extracted from image:", data.text);
             setReceiptFound(data);
        } catch (error) {
            console.error("Error extracting receipt from image:", error);
            // open snackbar: 
            setSnackBarText("Error extracting receipt from image");

            setOpenSnackbar(true);
        }
    }



    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Button variant="contained" color="primary" onClick={() => extractTextFromImageUsingOpenAI()}>
                    Extract Receipt using OpenAI
                </Button>


                {receiptFound && (
                    <Paper elevation={3} style={{ padding: '16px', width: '100%' }}>
                        <Typography variant="h6">Found Receipt:</Typography>
                        <ReceiptCard receipt={receiptFound} />
                        <Button variant="contained" color="secondary" onClick={() => saveReceipt(receiptFound)}>
                            Save
                        </Button>
                    </Paper>
                )}
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000} // Snackbar will auto-hide after 2 seconds
                onClose={handleCloseSnackbar}
                message={snackBarText}
            />
        </Container>

    );
};

export default CameraReader;
