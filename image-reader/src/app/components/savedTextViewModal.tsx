import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface TextRecord {
    id: string;
    text: string;
    createdAt: Date;
}

interface SavedTextViewModalProps {
    show: boolean;
    onHide: () => void;
    textRecord: TextRecord;
}

const SavedTextViewModal: React.FC<SavedTextViewModalProps> = ({ show, onHide, textRecord }) => {
    return (
        <Modal open={show} onClose={onHide}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2" color="black">
                    Text Record
                </Typography>
                <Typography sx={{ mt: 2 }} color="black">
                    {textRecord.text}
                </Typography>
                <Typography sx={{ mt: 2 }} color="black">
                    Created At: {textRecord.createdAt.toLocaleString()}
                </Typography>
                <Button variant="contained" color="secondary" onClick={onHide} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default SavedTextViewModal;