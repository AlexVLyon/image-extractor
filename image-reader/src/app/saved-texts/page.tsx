"use client";

import React, { useEffect, useState } from 'react';
import SavedTextsList from '../components/savedTextList';
import { TextRecord } from '../../../types/textRecord';

const SavedTexts: React.FC = () => {
    const [texts, setTexts] = useState<TextRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTexts = async () => {
            try {
                const response = await fetch('/api/store-text');
                
                if (!response.ok || !response.body) {
                    throw new Error('Failed to fetch texts');
                }
                const result = await response.json();
                const data: TextRecord[] = result.records;

                setTexts(data);
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
            <SavedTextsList savedTexts={texts} />
        </>
    );
};

export default SavedTexts;