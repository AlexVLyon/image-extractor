"use client";

import React, { useEffect, useState } from 'react';
import SavedReceiptsList from '../components/savedReceipstList';
import { Receipt } from '../../../types/receipt';

const SavedReceipts: React.FC = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTexts = async () => {
            try {
                const response = await fetch('/api/receipt');
                
                if (!response.ok || !response.body) {
                    throw new Error('Failed to fetch receipts');
                }
                const result = await response.json();
                const data: Receipt[] = result.records;

                setReceipts(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTexts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            {receipts && receipts.length > 0 ? (
            <SavedReceiptsList savedReceipts={receipts} />
            ) : (
            <div>No receipts found</div>
            )}
        </>
    );
};

export default SavedReceipts;