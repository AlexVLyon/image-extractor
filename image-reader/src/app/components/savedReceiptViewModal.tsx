import React from 'react';
import { Modal, Box, Button } from '@mui/material';
import { Receipt } from '../../../types/receipt';
import ReceiptCard from './receiptCard'; // Adjust the import path as necessary

interface SavedReceiptModalProps {
    show: boolean;
    onHide: () => void;
    receipt: Receipt;
}

const SavedReceiptModal: React.FC<SavedReceiptModalProps> = ({ show, onHide, receipt }) => {
    return (
        <Modal open={show} onClose={onHide}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <ReceiptCard receipt={receipt} />
                <Button variant="contained" color="secondary" onClick={onHide} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default SavedReceiptModal;
