import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Fragment, useState } from "react";
import {
  useAddCategory,
  useDeleteCategory,
  useEditCategory,
} from "../api/category-api";
import { NameId } from "../models/shopItem";

type ShoppingCategoriesDialogProps = {
  categories: NameId[];
  isOpen: boolean;
  onClose: () => void;
};

export const ShoppingCategoriesDialog = ({
  categories,
  isOpen,
  onClose,
}: ShoppingCategoriesDialogProps) => {
  const { editCategory } = useEditCategory();
  const { deleteCategory } = useDeleteCategory();
  const { addCategory } = useAddCategory();

  const [currentlyEditing, setCurrentlyEditing] = useState<number | undefined>(
    undefined
  );
  const [categoryName, setCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const toggleEdit = (id: number | undefined) => {
    if (id === currentlyEditing) {
      if (!id) {
        addCategory(categoryName);
      } else {
        editCategory({ id: id, name: categoryName });
      }
      setCurrentlyEditing(undefined);
    } else {
      setCurrentlyEditing(id);
      setCategoryName(categories?.find((c) => c.id === id)?.name || "");
    }
  };

  const onAddCategory = async () => {
    await addCategory(newCategoryName);
    setNewCategoryName("");
  };

  return (
    <Dialog onClose={onClose} open={isOpen} maxWidth="sm" fullWidth>
      <DialogTitle>Edit categories</DialogTitle>
      <DialogContent>
        <div className="shopping-list-categories__grid">
          {categories?.map((category) => {
            const isEditing = currentlyEditing === category.id;
            return (
              <Fragment>
                {isEditing ? (
                  <TextField
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    onKeyUp={(event) =>
                      event.key === "Enter" && toggleEdit(category.id)
                    }
                  />
                ) : (
                  <span>{category.name}</span>
                )}
                <IconButton
                  color="primary"
                  className="shopping-list-categories__grid-icon"
                  onClick={() => toggleEdit(category.id)}
                >
                  {isEditing ? <CheckIcon /> : <EditIcon />}
                </IconButton>
                {category.id !== 1 ? (
                  <IconButton
                    onClick={() => deleteCategory(category.id)}
                    color="error"
                    className="shopping-list-categories__grid-icon"
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <div />
                )}
              </Fragment>
            );
          })}
        </div>
        <div className="shopping-list-categories__new">
          <TextField
            label="New category"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            onKeyUp={(event) => event.key === "Enter" && onAddCategory()}
          />
          <Button startIcon={<AddIcon />} onClick={onAddCategory}>
            Add
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
