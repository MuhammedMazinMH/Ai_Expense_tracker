import React, { useState } from 'react';
import { Container, Box, Paper, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import '@fontsource/poppins';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#0A1929',
      paper: 'rgba(13, 19, 33, 0.7)',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(13, 19, 33, 0.7)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A1929 0%, #1A1A2E 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 50%, rgba(63, 81, 181, 0.1) 0%, rgba(245, 0, 87, 0.1) 100%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(63, 81, 181, 0.3)',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              mb: 4
            }}
          >
            AI Expense Tracker
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper 
              elevation={24}
              sx={{ 
                p: 3,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(13, 19, 33, 0.7)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </Paper>

            <Dashboard key={refreshKey} />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
