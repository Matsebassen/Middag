import {RecipeItem} from "./recipeItem";

export interface SimpleDialogProps {
    open: boolean;
    onClose: (value: RecipeItem[] | null) => void;
}