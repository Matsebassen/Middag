import './search-dinner.scss';
import React, { useState } from 'react';
import { addDinnerToShoppingList, editDinner, searchDinner } from './search-dinner-service';
import { Dinner } from '../models/dinner';
import { DinnerCard } from './dinner-card';

import { LinearProgress, Menu, MenuItem, TextField } from '@mui/material';
import EditDinnerDialog from './edit-dinner-dialog';

export const SearchDinner = () => {
  const [ searchInput, setSearchInput ] = useState('');
  const [ dinners, setDinners ] = useState([] as Dinner[]);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const [ currentDinner, setCurrentDinner ] = useState<null | Dinner>(null);
  const [ loading, setLoading ] = useState<boolean>(false);

  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, dinner: Dinner) => {
    setAnchorEl(event.currentTarget);
    setCurrentDinner(dinner);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onDinnerSearch = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ( e.key === 'Enter' ) {
      setLoading(true);
      const dinners = await searchDinner(searchInput);
      setDinners(dinners);
      setLoading(false);
    }
  };

  const openDinnerDialog = async () => {
    if ( currentDinner?.id ) {
      handleMenuClose();
      setDialogOpen(true);
    }
  };

  const saveDinner = async (dinner: Dinner) => {
    try {
      setLoading(true);
      setDialogOpen(false);
      const result: Dinner = await editDinner(dinner);
      const index = dinners.findIndex(d => d.id === dinner.id);
      const updatedDinners = [ ...dinners ];
      dinners.slice();
      updatedDinners[ index ] = result;
      setDinners(updatedDinners);
    } catch ( e ) {

    } finally {
      setLoading(false);
    }
  };

  const addDinnerToList = async (dinner: Dinner) => {
    if ( dinner?.id ) {
      try {
        setLoading(true);
        const result = await addDinnerToShoppingList(dinner.id);
        console.log(result);
      } catch ( e ) {

      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <TextField className="ingredient-input"
                 label="Search"
                 value={searchInput}
                 onChange={(e) => setSearchInput(e?.target?.value)}
                 onKeyDown={(e) => onDinnerSearch(e)}
                 variant="outlined"/>
      {loading && <LinearProgress></LinearProgress>}
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
      {currentDinner &&
      <EditDinnerDialog
          open={dialogOpen}
          dinner={currentDinner}
          handleSave={(dinner: Dinner) => saveDinner(dinner)}
          handleClose={() => setDialogOpen(false)}/>
      }
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={openDinnerDialog}>Edit</MenuItem>
      </Menu>
    </div>
  )
}

