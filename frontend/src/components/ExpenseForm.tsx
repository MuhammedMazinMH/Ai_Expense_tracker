import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Tooltip, IconButton, Collapse } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InfoIcon from '@mui/icons-material/Info';

interface Props {
  onExpenseAdded: () => void;
}

const categoryExamples = {
  groceries: "e.g., supermarket, fruits, vegetables, meat, dairy",
  dining: "e.g., restaurants, cafes, takeout, delivery",
  transportation: "e.g., gas, bus tickets, taxi, car maintenance",
  shopping: "e.g., clothing, retail stores, online shopping",
  entertainment: "e.g., movies, concerts, streaming services",
  utilities: "e.g., electricity, water, gas, internet bills",
  healthcare: "e.g., doctor visits, medicine, dental care",
  education: "e.g., tuition, textbooks, courses",
  rent: "e.g., rent payment, housing maintenance",
  fitness: "e.g., gym membership, sports equipment",
  electronics: "e.g., gadgets, computer accessories",
  travel: "e.g., flights, hotels, vacation packages",
  insurance: "e.g., car, health, home insurance",
  subscriptions: "e.g., digital services, memberships",
  gifts: "e.g., presents, donations, gift cards"
};

const ExpenseForm: React.FC<Props> = ({ onExpenseAdded }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      console.log('Submitting expense:', {
        description,
        amount: parseFloat(amount),
        date: date.toISOString().split('T')[0],
      });

      const response = await fetch('http://localhost:8000/expenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          date: date.toISOString().split('T')[0],
          payment_method: 'Card',
          notes: ''
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setDescription('');
      setAmount('');
      setDate(new Date());
      setError(null);
      onExpenseAdded();
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Add New Expense
        </Typography>
        <Tooltip title="View available categories">
          <IconButton 
            size="small" 
            onClick={() => setShowCategories(!showCategories)}
            sx={{ 
              color: 'primary.main',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={showCategories}>
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Available Categories & Examples:
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 2,
          }}>
            {Object.entries(categoryExamples).map(([category, examples]) => (
              <Box key={category}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {examples}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Collapse>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            error={!!error && !description}
            helperText={!description && error ? 'Description is required' : ''}
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            error={!!error && (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)}
            helperText={
              (!amount && error) ? 'Amount is required' :
              (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) && error ? 'Please enter a valid amount' : ''
            }
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue: Date | null) => setDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!error && !date,
                  helperText: !date && error ? 'Date is required' : '',
                },
              }}
            />
          </LocalizationProvider>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{
              mt: 2,
              height: 48,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'transform 0.6s ease-in-out',
                transform: 'translateX(-100%)',
              },
              '&:hover': {
                '&::after': {
                  transform: 'translateX(100%)',
                },
              },
            }}
          >
            Add Expense
          </Button>
        </Box>
      </form>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ExpenseForm;
