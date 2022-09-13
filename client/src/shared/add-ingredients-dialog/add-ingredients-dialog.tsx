import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {SimpleDialogProps} from "../../models/dialog";
import {useState} from "react";
import {RecipeItem} from "../../models/recipeItem";

const AddIngredientsDialog = (props: SimpleDialogProps) => {
  const [recipeItems, setRecipeItems] = useState('');
  const { onClose, open } = props;

  const handleClose = () => {
      onClose([]);
  };

  const addRecipeItems = () => {
    if (recipeItems?.length === 0){
      onClose([]);
    }
    const items: RecipeItem[] = recipeItems
      .split('\n')
      .filter(item => item?.trim()?.length > 0)
      .map(item => item.replace('\t', ' ').trim())
      .map(item => {
        const itemArray = item.split(' ');
        return {
          qty: itemArray[0],
          unit: itemArray[1] || '',
          ingredient: {name: itemArray?.slice(2)?.join(' ')}
        };
    });
    setRecipeItems('');
    onClose(items);
  }

  return (
        <Dialog
          onClose={handleClose}
          open={open}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add ingredients</DialogTitle>
          <DialogContent>
            <h5>Format is: quantity unit ingredient</h5>
            <TextField
              multiline
              fullWidth
              label="Ingredients"
              autoFocus
              rows={12}
              value={recipeItems}
              onChange={(e) => setRecipeItems(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={addRecipeItems}
            >Add ingredients</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        );

}

export default AddIngredientsDialog;