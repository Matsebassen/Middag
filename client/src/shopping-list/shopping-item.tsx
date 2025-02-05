import "./shopping-item.scss";
import { ShopItem } from "../models/shopItem";

import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Input
} from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as React from "react";
import milk from "../assets/milk.png"; // Import using relative path
import fish from "../assets/fish.png"; // Import using relative path
import soap from "../assets/soap.png"; // Import using relative path
import vegetables from "../assets/vegetables.png"; // Import using relative path
import cans from "../assets/cans.png";
import cheese from "../assets/cheese.png";
import chocolate from "../assets/chocolate.png";
import baking from "../assets/baking.png";

export const ShoppingItem = (props: {
  shopItem: ShopItem;
  isEditing: boolean;
  editIngredient: (ingredient: ShopItem) => void;
  toggleHaveBought: (id: number) => void;
  setEdit: (id: number) => void;
  openMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    shopItem: ShopItem
  ) => void;
}) => {
  const theme = useTheme();

  const getBackgroundImage = (id: number | undefined) => {
    if (!id) {
      return null;
    }
    switch (id) {
      case 1:
        return milk;
      case 2:
        return fish;
      case 3:
        return vegetables;
      case 4:
        return cans;
      case 5:
        return soap;
      case 6:
        return cheese;
      case 7:
        return baking;
      case 8:
        return chocolate;
    }
  };

  const background = () => {
    return {
      backgroundColor:
        props.shopItem.recentlyUsed > 0
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
      backgroundImage: `url(${getBackgroundImage(props.shopItem.ingredientItem.ingredientTypeId)})`
    };
  };

  const spanStyle = {
    fontSize: calculateFontSize(props.shopItem.ingredientItem.name)
  };

  function onOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    props.openMenu(event, props.shopItem);
  }

  return (
    <Card
      className="shopping-item"
      onClick={() => props.toggleHaveBought(props.shopItem.id)}
    >
      <CardContent sx={background} className="shopping-item__content">
        <IconButton
          aria-label="settings"
          className="shopping-item__menu"
          onClick={onOpenMenu}
        >
          <MoreVertIcon color="info" />
        </IconButton>
        <div className="shopping-item__heading">
          {props.shopItem.ingredientItem.name?.substring(0, 1)?.toUpperCase()}
        </div>
        <span style={spanStyle}>{props.shopItem.ingredientItem.name}</span>
      </CardContent>
      <CardActions onClick={(e) => e.stopPropagation()}>
        <IngredientDescription
          ingredient={props.shopItem}
          isEditing={props.isEditing}
          editIngredient={props.editIngredient}
          setEdit={props.setEdit}
        />
      </CardActions>
    </Card>
  );
};

const IngredientDescription = (props: {
  ingredient: ShopItem;
  isEditing: boolean;
  editIngredient: (ingredient: ShopItem) => void;
  setEdit: (id: number) => void;
}) => {
  const [ingredientDesc, setIngredientDesc] = useState(
    props.ingredient.description
  );
  const theme = useTheme();

  function onEditDesc(
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      props.editIngredient({
        ...props.ingredient,
        description: ingredientDesc
      });
    }
  }

  if (props.isEditing) {
    return (
      <div
        className="shopping-item__actions"
        style={{ backgroundColor: theme.palette.grey.A100 }}
      >
        <Input
          value={ingredientDesc}
          onChange={(e) => setIngredientDesc(e.target.value)}
          onKeyDown={(e) => onEditDesc(e)}
          autoFocus={true}
        />
        <IconButton
          onClick={() =>
            props.editIngredient({
              ...props.ingredient,
              description: ingredientDesc
            })
          }
        >
          <CheckIcon />
        </IconButton>
      </div>
    );
  } else {
    return (
      <div className="shopping-item__actions">
        <span>{props.ingredient.description}</span>
        <IconButton
          aria-label="Add description"
          className="shopping-item__desc"
          sx={{ color: theme.palette.primary.light }}
          onClick={() => props.setEdit(props.ingredient.id)}
        >
          {props.ingredient.description ? (
            <ModeEditOutlineOutlinedIcon fontSize="small" />
          ) : (
            <AddOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      </div>
    );
  }
};

const calculateFontSize = (name: string) => {
  if (!name) {
    return "12px";
  }
  const length = name.length;
  let fontSize = "16px";
  if (14 <= length && length <= 17) {
    fontSize = "14px";
  } else if (17 < length && length <= 21) {
    fontSize = "12px";
  } else if (21 < length) {
    fontSize = "10px";
  }
  return fontSize;
};
