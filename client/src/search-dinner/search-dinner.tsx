import './search-dinner.scss';
import React, { useState } from 'react';
import { searchDinner } from './search-dinner-service';
import { Dinner } from '../models/dinner';
import { DinnerCard } from './dinner-card';

import { TextField } from '@mui/material';

export const SearchDinner = (props: {}) => {
  const [searchInput, setSearchInput] = useState('');
  const [dinners, setDinners] = useState([] as Dinner[]);

  const onDinnerSearch = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' ){
      const dinners = await searchDinner(searchInput);
      setDinners(dinners);
    }
  }

  return (
    <div>
      <TextField className="ingredient-input"
                 label="Search"
                 value={searchInput}
                 onChange={(e) => setSearchInput(e?.target?.value)}
                 onKeyDown={(e) => onDinnerSearch(e)}
                 variant="outlined"/>
      <div className='dinner-list'>
        {dinners?.map((dinner: Dinner) => (
          <DinnerCard dinner={dinner} key={dinner.id}/>
        ))}
      </div>
    </div>
  )
}
