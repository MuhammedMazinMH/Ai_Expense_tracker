import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Tooltip, Chip } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, ChartTooltip, Legend);

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  payment_method: string;
  notes?: string;
}

interface InsightsData {
  total_spent: number;
  category_totals: { [key: string]: number };
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    groceries: '#4CAF50',
    dining: '#2196F3',
    transportation: '#FF9800',
    shopping: '#F44336',
    entertainment: '#9C27B0',
    utilities: '#00BCD4',
    healthcare: '#E91E63',
    education: '#673AB7',
    rent: '#009688',
    fitness: '#8BC34A',
    default: '#757575'
  };
  return colors[category.toLowerCase()] || colors.default;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<InsightsData>({ total_spent: 0, category_totals: {} });
  const [expanded, setExpanded] = useState<string | false>('expenses');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      try {
        const expenseRes = await fetch('http://localhost:8000/expenses/');
        
        if (!expenseRes.ok) {
          throw new Error(`Expenses API error: ${expenseRes.status} ${expenseRes.statusText}`);
        }
        
        const expenseData = await expenseRes.json();
        if (Array.isArray(expenseData)) {
          setExpenses(expenseData);
        } else {
          throw new Error('Invalid expense data format');
        }
        
        const insightRes = await fetch('http://localhost:8000/insights/');
        
        if (!insightRes.ok) {
          throw new Error(`Insights API error: ${insightRes.status} ${insightRes.statusText}`);
        }
        
        const insightData = await insightRes.json();
        setInsights(insightData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching data:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: Object.keys(insights.category_totals || {}),
    datasets: [{
      data: Object.values(insights.category_totals || {}),
      backgroundColor: Object.keys(insights.category_totals || {}).map(category => getCategoryColor(category)),
      borderWidth: 1,
      borderColor: Object.keys(insights.category_totals || {}).map(() => 'rgba(255,255,255,0.1)'),
      hoverBorderColor: Object.keys(insights.category_totals || {}).map(() => 'rgba(255,255,255,0.5)'),
      hoverBorderWidth: 2,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
          color: 'rgba(255,255,255,0.8)',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = Object.values(insights.category_totals).reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'rgba(255,255,255,0.9)',
        bodyColor: 'rgba(255,255,255,0.9)',
        padding: 12,
        boxPadding: 6,
      },
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    },
  };

  const calculateGrowth = () => {
    if (expenses.length === 0) return 0;
    
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentExpenses = sortedExpenses.slice(0, Math.ceil(sortedExpenses.length / 2));
    const olderExpenses = sortedExpenses.slice(Math.ceil(sortedExpenses.length / 2));
    
    const recentTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const olderTotal = olderExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    if (olderTotal === 0) return 0;
    return Math.round(((recentTotal - olderTotal) / olderTotal) * 100);
  };

  const growth = calculateGrowth();

  if (loading) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
        borderRadius: 4,
        p: 3,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography variant="h4" sx={{ color: 'white' }}>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
        borderRadius: 4,
        p: 3,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography variant="h4" sx={{ color: 'white' }}>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
      borderRadius: 4,
      p: 3,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      {/* Insights Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 3 }}>
        {/* Total Spent Card */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoneyIcon color="primary" />
            <Typography variant="h6">Total Spent</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ${insights.total_spent.toFixed(2)}
          </Typography>
        </Paper>

        {/* Categories Card */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon color="primary" />
            <Typography variant="h6">Categories</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {Object.keys(insights.category_totals).length}
          </Typography>
        </Paper>

        {/* Growth Card */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6">Monthly Growth</Typography>
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              color: calculateGrowth() >= 0 ? 'success.main' : 'error.main'
            }}
          >
            {calculateGrowth() >= 0 ? '+' : ''}{calculateGrowth()}%
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Paper 
            elevation={24}
            sx={{ 
              p: 3, 
              height: '100%',
              background: 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(10,25,41,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Accordion 
              expanded={expanded === 'expenses'} 
              onChange={() => setExpanded(expanded === 'expenses' ? false : 'expenses')}
              sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 2,
                '&:before': { display: 'none' },
                boxShadow: 3
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Recent Expenses</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {expenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          mb: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            transition: 'transform 0.2s ease-in-out'
                          }
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {expense.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              size="small"
                              label={expense.category}
                              sx={{
                                bgcolor: getCategoryColor(expense.category),
                                color: 'white'
                              }}
                            />
                            <Tooltip title={expense.payment_method} arrow>
                              <Chip
                                size="small"
                                label={expense.payment_method}
                                variant="outlined"
                              />
                            </Tooltip>
                            <Tooltip title={formatDate(expense.date)} arrow>
                              <Chip
                                size="small"
                                icon={<DateRangeIcon />}
                                label={formatDate(expense.date)}
                                variant="outlined"
                              />
                            </Tooltip>
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}
                        >
                          ${expense.amount.toFixed(2)}
                        </Typography>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Paper 
            elevation={24}
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(10,25,41,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon color="primary" />
              Spending by Category
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Doughnut data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Dashboard;
