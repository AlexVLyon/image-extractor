import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Collapse, IconButton, List, ListItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { Receipt } from '../../../types/receipt';

interface ReceiptCardProps {
    receipt: Receipt;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const totalSum = receipt?.totalSum ? parseFloat(receipt.totalSum.toString()) : 0;

    return (
        <Card className="receipt-card">
            <CardHeader
                title={`Receipt ${receipt.storeName ? `from ${receipt.storeName}` : ''}`}
                subheader={`Total: ${totalSum.toFixed(2)} ${receipt.currency}`}
                action={
                    <IconButton onClick={toggleCollapse}>
                        {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                }
            />
            <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
                <CardContent style={{ overflow: 'auto', maxHeight: '400px' }}>
                    <Typography variant="h6">Items:</Typography>
                    <List>
                        {receipt.items.map((item, index) => (
                            <ListItem key={`${item.id ?? item.itemName} (${index})`}>
                                {item.itemName} - {item.price ? item.price.toFixed(2) : '0.00'} {receipt.currency}
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="body2">
                        Created At: {new Date(receipt.createdAt).toLocaleDateString()}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default ReceiptCard;
