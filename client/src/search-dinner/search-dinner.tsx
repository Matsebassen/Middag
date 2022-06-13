import './search-dinner.scss';
import React, { useState } from 'react';
import { addDinnerToShoppingList, editDinner, getIngredients, searchDinner } from './search-dinner-service';
import { Dinner } from '../models/dinner';
import { DinnerCard } from './dinner-card';

import { Menu, MenuItem, TextField } from '@mui/material';
import EditDinnerDialog from './edit-dinner-dialog';
import { Ingredient } from '../models/ingredient';

export const SearchDinner = () => {
  const [ searchInput, setSearchInput ] = useState('');
  const [ dinners, setDinners ] = useState([] as Dinner[]);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
  const [ currentDinner, setCurrentDinner ] = useState<null | Dinner>(null);
  const [ ingredients, setIngredients ] = useState<{ [ id: string ]: Ingredient[] }>({});

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
      const dinners = await searchDinner(searchInput);
      setDinners(dinners);
    }
  };

  const openDinnerDialog = async () => {
    if ( currentDinner?.id ) {
      getDinnerIngredients(currentDinner.id);
      handleMenuClose();
      setDialogOpen(true);
    }
  };

  const getDinnerIngredients = async (id: number) => {
    const dinnerIngredients = await getIngredients(id);
    setIngredients({ ...ingredients, [ id ]: dinnerIngredients });
  };

  const saveDinner = async (dinner: Dinner) => {
    try {
      setDialogOpen(false);
      const result = await editDinner(dinner);
      console.log(result);
      const index = dinners.findIndex(d => d.id === dinner.id);
      const updatedDinners = [ ...dinners ];
      dinners.slice();
      updatedDinners[ index ] = dinner;
      setDinners(updatedDinners);
    } catch ( e ) {

    }
  };

  const addDinnerToList = async (dinner: Dinner) => {
    if ( dinner?.id ) {
      try {
        await getDinnerIngredients(dinner.id);
        const result = await addDinnerToShoppingList({ ...dinner, ingredients: ingredients[ dinner.id ] });
        console.log(result);
      } catch ( e ) {

      } finally {

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
      <div className="dinner-list">
        {dinners?.map((dinner: Dinner) => (
          <DinnerCard
            dinner={{ ...dinner, ingredients: ingredients[ dinner.id || 0 ] }}
            key={dinner.id}
            addDinnerToList={addDinnerToList}
            getIngredients={getDinnerIngredients}
            openMenu={handleMenuClick}
          />
        ))}
      </div>
      {currentDinner &&
      <EditDinnerDialog
          open={dialogOpen}
          dinner={( { ...currentDinner, ingredients: ingredients[ currentDinner?.id || 0 ] } )}
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

