export interface ReceiptBase {
    storeName?: string;
    totalSum?: number;
    currency?: string;
    userId?: string;
    items: ReceiptItemBase[];
}

export interface ReceiptItemBase {
    itemName?: string;
    price?: number;
    receiptId: string;
}

export interface Receipt extends ReceiptBase {
    id: string;
    createdAt: Date;
    items: ReceiptItem[];
}

export interface ReceiptItem extends ReceiptItemBase {
    id: string;
    createdAt: Date;
    receipt: Receipt;
}