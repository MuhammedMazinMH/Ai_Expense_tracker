export interface Expense {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
    payment_method: string;
    notes?: string;
}

export interface ExpenseFormData {
    description: string;
    amount: number;
    category?: string;
    payment_method: string;
    notes?: string;
}
