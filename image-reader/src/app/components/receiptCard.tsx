import React, { useState } from 'react';

import { Receipt } from '../../../types/receipt';

interface ReceiptCardProps {
    receipt: Receipt;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="receipt-card">
            <div className="receipt-header" onClick={toggleCollapse}>
                <h2>Receipt #{receipt.id}</h2>
                <p>Date: {receipt.createdAt.toDateString()}</p>
                <p>Total: ${receipt.totalSum ? receipt.totalSum.toFixed(2) : '0.00'}</p>
                
            </div>
            {!isCollapsed && (
                <div className="receipt-items">
                    <h3>Items:</h3>
                    <ul>
                        {receipt.items.map(item => (
                            <li key={item.id}>
                                {item.itemName} - ${item.price ? item.price.toFixed(2) : '0.00'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ReceiptCard;