import React, { useState } from 'react';
import { Receipt } from '../../../types/receipt';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import SavedReceiptViewModal from './savedReceiptViewModal';

interface SavedReceiptListProps {
    savedReceipts: Receipt[];
}

const SavedReceiptList: React.FC<SavedReceiptListProps> = ({ savedReceipts }) => {
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

    return (
        <div className="saved-receipt-list">
            <Typography variant="h4" gutterBottom>
                Saved Receipts
            </Typography>
            <List>
                {savedReceipts.map((savedReceipt) => (
                    <ListItemButton
                        key={savedReceipt.id}
                        onClick={() => setSelectedReceipt(savedReceipt)}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            backgroundColor: '#333',
                        }}
                    >
                        <ListItemText
                            primary={`Date: ${savedReceipt.createdAt.toLocaleString()}`}
                            secondary={`Total: $${(savedReceipt.totalSum ?? 0).toFixed(2)}`}
                            primaryTypographyProps={{ style: { color: 'white' } }}
                            secondaryTypographyProps={{ style: { color: 'white' } }}
                        />
                        <Typography variant="body2" style={{ color: 'white' }}>
                            Store: {savedReceipt.storeName}
                        </Typography>
                    </ListItemButton>
                ))}
            </List>
            {selectedReceipt && (
                <SavedReceiptViewModal
                    show={Boolean(selectedReceipt)}
                    onHide={() => setSelectedReceipt(null)}
                    receipt={selectedReceipt}
                />
            )}
        </div>
    );
};

export default SavedReceiptList;