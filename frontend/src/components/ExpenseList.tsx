import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme } from '@mui/material';
import { Expense } from '../types';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { format } from 'date-fns';

interface Props {
  expenses: Expense[];
}

const getCategoryColor = (category: string): string => {
  const categories: { [key: string]: string } = {
    food: '#4caf50',
    dining: '#2196f3',
    transportation: '#ff9800',
    shopping: '#e91e63',
    entertainment: '#9c27b0',
    utilities: '#795548',
    healthcare: '#f44336',
    education: '#3f51b5',
    default: '#757575'
  };
  return categories[category.toLowerCase()] || categories.default;
};

const ExpenseList: React.FC<Props> = ({ expenses }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          mb: 3,
          color: 'primary.main',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <ListAltIcon /> Recent Expenses
      </Typography>
      <TableContainer 
        sx={{ 
          maxHeight: 440,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.default,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.light,
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.primary.main,
            },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #f5f7fa 30%, #e4e8eb 90%)',
                }}
              >
                Date
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #f5f7fa 30%, #e4e8eb 90%)',
                }}
              >
                Description
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #f5f7fa 30%, #e4e8eb 90%)',
                }}
              >
                Amount
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #f5f7fa 30%, #e4e8eb 90%)',
                }}
              >
                Category
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow 
                key={expense.id}
                sx={{
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                <TableCell>
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: expense.amount > 100 ? 'error.main' : 'success.main',
                    }}
                  >
                    ${expense.amount.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<LocalOfferIcon />}
                    label={expense.category}
                    size="small"
                    sx={{
                      backgroundColor: `${getCategoryColor(expense.category)}15`,
                      color: getCategoryColor(expense.category),
                      fontWeight: 500,
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {expenses.length === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">No expenses found</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ExpenseList;
