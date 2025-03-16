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

    return (
        <Card className="receipt-card">
            <CardHeader
                title={`Receipt ${receipt.storeName ? `from ${receipt.storeName}` : ''}`}
                subheader={`Total: ${receipt.totalSum ? receipt.totalSum.toFixed(2) : '0.00'} ${receipt.currency}`}
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
                        {receipt.items.map(item => (
                            <ListItem key={item.id}>
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
