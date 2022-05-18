import React from 'react';
import './App.scss';
import { ShoppingList } from './shopping-list/shopping-list';
import { MiddagAppBar } from './app-bar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    }
  },
});

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <MiddagAppBar/>
        <div className="App">
          <ShoppingList></ShoppingList>
        </div>
      </ThemeProvider>
    </div>
    );
}

export default App;
