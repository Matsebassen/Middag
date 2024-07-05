import SettingsIcon from "@mui/icons-material/Settings";

import { IconButton, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useFetchCategories } from "../api/category-api";
import { ShoppingCategoriesDialog } from "./shopping-categories-dialog";

type ShoppingCategoriesProps = {
  category: number;
  setCategory: (category: number) => void;
};

export const ShoppingCategories = ({
  category,
  setCategory,
}: ShoppingCategoriesProps) => {
  const { categories } = useFetchCategories();

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  return (
    <div className="shopping-list-categories">
      <Tabs
        value={category}
        onChange={(e, value) => setCategory(value)}
        aria-label="Category"
      >
        {categories
          ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
          .map((category) => (
            <Tab
              key={category.id}
              value={category.id}
              label={category.name}
            ></Tab>
          ))}
      </Tabs>
      <IconButton color="primary" onClick={() => setSettingsDialogOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <ShoppingCategoriesDialog
        currentCategory={category}
        categories={categories ?? []}
        isOpen={settingsDialogOpen}
        setCurrentCategory={setCategory}
        onClose={() => setSettingsDialogOpen(false)}
      />
    </div>
  );
};
