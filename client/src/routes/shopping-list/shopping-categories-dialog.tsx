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
  TextField
} from "@mui/material";
import { useState } from "react";
import {
  useAddCategory,
  useDeleteCategory,
  useEditCategory
} from "../../api/category-api";
import { NameId } from "../../models/name-id";

type ShoppingCategoriesDialogProps = {
  currentCategory: string;
  categories: NameId[];
  isOpen: boolean;
  setCurrentCategory: (category: string) => void;
  onClose: () => void;
};

export const ShoppingCategoriesDialog = ({
  currentCategory,
  categories,
  isOpen,
  setCurrentCategory,
  onClose
}: ShoppingCategoriesDialogProps) => {
  const { editCategory } = useEditCategory();
  const { deleteCategory } = useDeleteCategory();
  const { addCategory } = useAddCategory();

  const [currentlyEditing, setCurrentlyEditing] = useState<string | undefined>(
    undefined
  );
  const [categoryName, setCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const toggleEdit = (id: string | undefined) => {
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

  const onDeleteCategory = async (id: string | undefined) => {
    if (currentCategory === id) {
      setCurrentCategory("1");
    }
    await deleteCategory(id);
  };

  const onAddCategory = async () => {
    await addCategory(newCategoryName);
    setNewCategoryName("");
  };

  return (
    <Dialog onClose={onClose} open={isOpen} maxWidth="sm" fullWidth>
      <DialogTitle>Kategorier</DialogTitle>
      <DialogContent>
        <ul className="shopping-list-categories__list">
          {categories?.map((category) => {
            const isEditing = currentlyEditing === category.id;
            return (
              <li
                className="shopping-list-categories__list-item"
                key={category.id}
              >
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
                <div className="shopping-list-categories__list-icons"></div>
                <IconButton
                  color="primary"
                  onClick={() => toggleEdit(category.id)}
                >
                  {isEditing ? <CheckIcon /> : <EditIcon />}
                </IconButton>

                <IconButton
                  disabled={category.id === "1"}
                  onClick={() => onDeleteCategory(category.id)}
                  color="error"
                  className="shopping-list-categories__list-icon"
                >
                  <DeleteIcon />
                </IconButton>
              </li>
            );
          })}
        </ul>
        <div className="shopping-list-categories__new">
          <TextField
            label="New category"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            onKeyUp={(event) => event.key === "Enter" && onAddCategory()}
          />
          <Button startIcon={<AddIcon />} onClick={onAddCategory}>
            Legg til
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Lukk
        </Button>
      </DialogActions>
    </Dialog>
  );
};
