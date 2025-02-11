import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { SimpleDialogProps } from "../../models/dialog";
import { useState } from "react";
import { RecipeItem } from "../../models/recipeItem";

const AddIngredientsDialog = (props: SimpleDialogProps) => {
  const [recipeItems, setRecipeItems] = useState("");
  const { onClose, open } = props;

  const handleClose = () => {
    onClose([]);
  };

  const addRecipeItems = () => {
    if (recipeItems?.length === 0) {
      onClose([]);
    }
    const items: RecipeItem[] = recipeItems
      .split("\n")
      .filter((item) => item?.trim()?.length > 0)
      .map((item) => item.replace("\t", " ").trim())
      .map((item) => {
        const itemArray = item.split(" ");
        return {
          qty: itemArray[0],
          unit: itemArray[1] || "",
          name: itemArray?.slice(2)?.join(" ")
        };
      });
    setRecipeItems("");
    onClose(items);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Legg til ingredienser</DialogTitle>
      <DialogContent>
        <h5>Formatet er: kvantitet enhet ingrediens</h5>
        <TextField
          multiline
          fullWidth
          label="Ingredienser"
          autoFocus
          rows={12}
          value={recipeItems}
          onChange={(e) => setRecipeItems(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={addRecipeItems}>
          Legg til
        </Button>
        <Button onClick={handleClose}>Lukk</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIngredientsDialog;
