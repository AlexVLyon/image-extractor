import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';
import { Receipt } from '../../../types/receipt';
import ReceiptCard from './receiptCard'; // Adjust the import path as necessary

interface SavedReceiptModalProps {
    show: boolean;
    onHide: () => void;
    receipt: Receipt;
}

const SavedReceiptModal: React.FC<SavedReceiptModalProps> = ({ show, onHide, receipt }) => {

    const [receiptAnalysis, setReceiptAnalysis] = useState<string | null>(null);
    const [question, setQuestion] = useState<string>('');
    const [perplexityLoading, setPerplexityLoading] = useState<boolean>(false);

    const askPerplexityAboutTheReceipt = async (question: string) => {
        setPerplexityLoading(true);

        try {
            const response = await fetch('/api/perplexity/check-receipt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({receipt, question}),
            });

            if (!response.ok) {
                setPerplexityLoading(false);
                throw new Error('Failed to get perplexity');

            }

            const result = await response.json();
            
            if (result.receiptAnalysis) {
                setPerplexityLoading(false);
                setReceiptAnalysis(result.receiptAnalysis);
            } else {
                setPerplexityLoading(false);
                throw new Error('Failed to get perplexity');
            }
        } catch (err) {
            setPerplexityLoading(false)
            console.error('Error getting answear from perplexity:', err);
        }
    }

    return (
        <Modal open={show} onClose={onHide}>
            <Box sx={{ overflow: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <ReceiptCard receipt={receipt} />
                <TextField
                    label="Question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => askPerplexityAboutTheReceipt(question)} 
                    sx={{ mt: 2 }} 
                    disabled={perplexityLoading}
                >
                    {perplexityLoading ? 'Loading...' : 'Ask a question'}
                </Button>
                <Box sx={{ mt: 2, color: 'black', maxHeight: 200, overflowY: 'auto' }}>
                    {receiptAnalysis && <Typography variant="body1">Perplexity: {receiptAnalysis}</Typography>}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onHide} sx={{ minWidth: 'auto', padding: 1 }} variant='contained'>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SavedReceiptModal;
