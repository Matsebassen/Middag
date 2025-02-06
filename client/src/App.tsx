import React from "react";
import "./App.scss";
import { ShoppingList } from "./routes/shopping-list/shopping-list";
import { MiddagAppBar } from "./app-bar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddDinner from "./routes/add-dinner/add-dinner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchDinner } from "./routes/search-dinner/search-dinner";

const theme = createTheme({
  palette: {
    primary: {
      main: "#508ca4" //main: '#3f51b5',
    },
    secondary: {
      50: "#fef2f4",
      100: "#fde6ea",
      200: "#fad1d9",
      300: "#f5acba",
      400: "#ef7d96",
      main: "#e34a6f", //main: '#f50057',
      600: "#cf2f5d",
      700: "#af214e",
      800: "#921f47",
      900: "#7e1d42"
    },
    info: {
      main: "#fff"
    }
  }
});

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <MiddagAppBar />
          <div className="App">
            <Routes>
              <Route path="/" element={<ShoppingList />} />
              <Route path="/list" element={<ShoppingList />} />
              <Route path="/search" element={<SearchDinner />} />
              <Route path="/add" element={<AddDinner />} />
            </Routes>
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
