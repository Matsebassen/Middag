import './shopping-item.scss';
import { ShopItem } from '../models/shopItem';

import { Card, CardActions, CardContent, IconButton, Input } from '@mui/material';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';


export const ShoppingItem = (props: {
  shopItem: ShopItem,
  isEditing: boolean,
  editIngredient: (ingredient: ShopItem) => void,
  toggleHaveBought: (id: number) => void,
  setEdit: (id: number) => void
}) => {
  const theme = useTheme();

  const backgroundColor = {
    backgroundColor: (props.shopItem.recentlyUsed > 0) ? theme.palette.primary.light : theme.palette.secondary.light
  };

  const spanStyle = {
    fontSize: calculateFontSize(props.shopItem?.ingredient?.name)
  };

  return (
    <Card className="shopping-item"
          onClick={() => props.toggleHaveBought(props.shopItem.id)}>
      <CardContent
        sx={{ backgroundColor }}
        className="shopping-item__content">
        <div className="shopping-item__heading">
          {props.shopItem.ingredient?.name?.substring(0, 1)?.toUpperCase()}
        </div>
        <span style={spanStyle}>
          {props.shopItem.ingredient?.name}
        </span>
      </CardContent>
      <CardActions onClick={(e) => e.stopPropagation()}>
        <IngredientDescription
          ingredient={props.shopItem}
          isEditing={props.isEditing}
          editIngredient={props.editIngredient}
          setEdit={props.setEdit}/>
      </CardActions>
    </Card>
  )
}

const IngredientDescription = (props:{
  ingredient: ShopItem,
  isEditing: boolean,
  editIngredient: (ingredient: ShopItem) => void,
  setEdit: (id: number) => void
}) => {
  const [ingredientDesc, setIngredientDesc] = useState(props.ingredient.description);
  const theme = useTheme();

  function onEditDesc(event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if (event.key === 'Enter') {
      props.editIngredient({...props.ingredient, description: ingredientDesc})
    }
  }

  if (props.isEditing) {
    return (
      <div className="shopping-item__actions"
           style={{backgroundColor: theme.palette.grey.A100}}>
        <Input value={ingredientDesc}
               onChange={(e) => setIngredientDesc(e.target.value)}
               onKeyDown={(e) => onEditDesc(e)}
               autoFocus={true}/>
        <IconButton onClick={() => props.editIngredient({...props.ingredient, description: ingredientDesc})} >
          <CheckIcon/>
        </IconButton>
      </div>
    )
  } else {
    return (
      <div className="shopping-item__actions">
        <span>{props.ingredient.description}</span>
        <IconButton aria-label="Add description"
                    className="shopping-item__desc"
                    sx={{color: theme.palette.primary.light}}
                    onClick={() => props.setEdit(props.ingredient.id)}>
          {props.ingredient.description
            ? <ModeEditOutlineOutlinedIcon fontSize="small"/>
            : <AddOutlinedIcon fontSize="small"/>}
        </IconButton>
      </div>
    );
  }
}


const calculateFontSize = (name: string) => {
  if (!name){
    return '12px';
  }
  const length = name.length;
  let fontSize = '16px';
  if (14 <= length && length <= 17) {
  fontSize = '14px';
  } else if (length > 17 ) {
  fontSize = '12px';
  }
  return fontSize;
}

