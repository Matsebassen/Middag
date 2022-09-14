import React from 'react';
import './App.scss';
import { ShoppingList } from './shopping-list/shopping-list';
import { MiddagAppBar } from './app-bar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SearchDinner } from './search-dinner/search-dinner';
import AddDinner from './add-dinner/add-dinner';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

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

const queryClient = new QueryClient()


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <MiddagAppBar/>
          <div className="App">
            <Routes>
              <Route path="/" element={<ShoppingList/>} />
              <Route path="/list"
                     element={<ShoppingList/>}/>
              <Route path="/search"
                     element={<SearchDinner/>}/>
              <Route path="/add"
                     element={<AddDinner/>}/>
            </Routes>
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
    );
}

export default App;
