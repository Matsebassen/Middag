import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Dinner } from "../models/dinner";
import { DinnerCard } from "./dinner-card";
import {
  addDinnerToShoppingList,
  editDinner,
  searchDinner,
} from "./search-dinner-service";
import "./search-dinner.scss";

import {
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import EditDinnerDialog from "./edit-dinner-dialog";

export const SearchDinner = () => {
  const [searchInput, setSearchInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentDinner, setCurrentDinner] = useState<null | Dinner>(null);
  // eslint-disable-next-line
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const queryClient = useQueryClient();
  const {
    data: dinners,
    isFetching,
    ...dinnersQuery
  } = useQuery({
    queryKey: ["dinners", searchInput],
    queryFn: () => searchDinner(searchInput),
    enabled: false,
  });

  const open = Boolean(anchorEl);
  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    dinner: Dinner
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentDinner(dinner);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onInputKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      await dinnerSearch();
    }
  };

  const dinnerSearch = async () => {
    await dinnersQuery.refetch();
  };

  const openDinnerDialog = async () => {
    if (currentDinner?.id) {
      handleMenuClose();
      setDialogOpen(true);
    }
  };

  const saveDinner = async (dinner: Dinner) => {
    try {
      setLoading(true);
      setDialogOpen(false);
      const result: Dinner = await editDinner(dinner);
      queryClient.setQueryData(["dinners"], (dinners: Dinner[] | undefined) =>
        dinners?.map((dinner) => {
          if (dinner.id === result.id) {
            return result;
          }
          return dinner;
        })
      );
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const addDinnerToList = async (dinner: Dinner) => {
    if (dinner?.id) {
      try {
        setLoading(true);
        const result = await addDinnerToShoppingList(dinner.id);
        setSnackbarMsg(result);
        setSnackbarOpen(true);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="search-dinner">
        <TextField
          className="search-input"
          label="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e?.target?.value)}
          onKeyDown={onInputKeyDown}
          variant="outlined"
        />
        <Button onClick={dinnerSearch}>Search</Button>
      </div>
      {isFetching && <LinearProgress></LinearProgress>}
      <div className="dinner-list">
        {dinners?.map((dinner: Dinner) => (
          <DinnerCard
            dinner={dinner}
            key={dinner.id}
            addDinnerToList={addDinnerToList}
            openMenu={handleMenuClick}
          />
        ))}
      </div>
      {currentDinner && (
        <EditDinnerDialog
          open={dialogOpen}
          dinner={currentDinner}
          handleSave={(dinner: Dinner) => saveDinner(dinner)}
          handleClose={() => setDialogOpen(false)}
        />
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={openDinnerDialog}>Edit</MenuItem>
      </Menu>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};
