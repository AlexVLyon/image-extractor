"use client"; // Required for Next.js (since this is browser-side code)
import { useState, useEffect, useRef } from "react";
import { Button, Container, Paper, Typography, Box, Snackbar } from "@mui/material";
import { Receipt } from "../../../types/receipt";
import ReceiptCard from "./receiptCard";

const ReceiptReader = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [receiptFound, setReceiptFound] = useState<Receipt | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const  [snackBarText, setSnackBarText] = useState("");

    const [loading , setLoading] = useState(false);


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };


    const saveReceipt = async (receipt: Receipt) => {
        try {
            setLoading(true);
            const response = await fetch("/api/receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(receipt),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error("Failed to save receipt");
            }

            const data = await response.json();
            console.log("Receipt saved:", data);
            setReceiptFound(data);
            setOpenSnackbar(true);
            setSnackBarText("Receipt saved successfully");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error saving receipt:", error);
        }
    };

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "user" }
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
            setLoading(true);
            const fetchedCanvas = getCanvas();
            const image = fetchedCanvas?.toDataURL("image/jpeg");

            if (!image) {
                console.error("No image found in canvas");
                setLoading(false);
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
                setLoading(false);
                throw new Error("Failed to extract receipt from image");
            }

            const data = await response.json();
            console.log("Text extracted from image:", data.text);
             setReceiptFound(data);
             setLoading(false);
        } catch (error) {
            console.error("Error extracting receipt from image:", error);
            // open snackbar: 
            setSnackBarText("Error extracting receipt from image");
            setLoading(false);

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

                {loading && <Typography variant="h6">Loading...</Typography>}


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

export default ReceiptReader;
