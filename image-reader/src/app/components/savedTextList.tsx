import React, { useState } from 'react';
import { TextRecord } from '../../../types/textRecord';
import SavedTextViewModal from './savedTextViewModal';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';

interface SavedTextListProps {
    savedTexts: TextRecord[];
}

const SavedTextList: React.FC<SavedTextListProps> = ({ savedTexts }) => {
    const [selectedText, setSelectedText] = useState<TextRecord | null>(null);

    return (
        <div className="saved-text-list">
            <Typography variant="h4" gutterBottom>
                Saved Texts
            </Typography>
            <List>
                {savedTexts.map((savedText) => (
                    <ListItemButton
                        key={savedText.id}
                        onClick={() => setSelectedText(savedText)}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            backgroundColor: '#333',
                        }}
                    >
                        <ListItemText
                            primary={`Created At: ${savedText.createdAt.toLocaleString()}`}
                            secondary={`Preview: ${savedText.text.length > 100 ? `${savedText.text.substring(0, 100)}...` : savedText.text}`}
                            primaryTypographyProps={{ style: { color: 'white' } }}
                            secondaryTypographyProps={{ style: { color: 'white' } }}
                        />
                        <Typography variant="body2" style={{ color: 'white' }}>
                            Reader: {savedText.readerType}
                        </Typography>
                    </ListItemButton>
                ))}
            </List>
            {selectedText && (
                <SavedTextViewModal
                    show={Boolean(selectedText)}
                    onHide={() => setSelectedText(null)}
                    textRecord={selectedText}
                />
            )}
        </div>
    );
};

export default SavedTextList;