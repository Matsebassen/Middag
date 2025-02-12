import { Dinner } from "../models/dinner";
import { RecipeItem } from "../models/recipeItem";
import "./dinner.form.scss";

import * as React from "react";
import {
  Field,
  FieldArray,
  Form,
  Formik,
  FormikProps,
  useFormikContext
} from "formik";
import { IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { TextField as FormikTextField } from "formik-mui";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useState } from "react";
import AddIngredientsDialog from "./add-ingredients-dialog/add-ingredients-dialog";

export const DinnerForm = (props: {
  dinner: Dinner | null;
  formikRef: React.RefObject<FormikProps<Dinner>>;
}) => {
  const { dinner } = props;

  return (
    <div>
      <Formik
        initialValues={{
          id: dinner?.id || "",
          name: dinner?.name || "",
          picUrl: dinner?.picUrl || "",
          portions: dinner?.portions || "",
          tags: dinner?.tags || "",
          url: dinner?.url || "",
          ingredients: dinner?.ingredients || ([] as RecipeItem[])
        }}
        innerRef={props.formikRef}
        onSubmit={() => console.log("submit")}
      >
        <DinnerFormikForm />
      </Formik>
    </div>
  );
};

const DinnerFormikForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { values, handleSubmit, handleChange } = useFormikContext<Dinner>();

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <div className="add-dinner__form">
        <DinnerTextField
          id="name"
          label="Navn"
          value={values.name}
          handleChange={handleChange}
        />
        <DinnerTextField
          id="picUrl"
          label="Url bilde"
          value={values.picUrl}
          handleChange={handleChange}
        />
        <DinnerTextField
          id="portions"
          label="Porsjoner"
          value={values.portions}
          handleChange={handleChange}
        />
        <DinnerTextField
          id="tags"
          label="Tags"
          value={values.tags}
          handleChange={handleChange}
        />
        <DinnerTextField
          id="url"
          label="Url"
          value={values.url}
          handleChange={handleChange}
        />

        <Typography variant="h6">Ingredienser</Typography>

        <FieldArray name="ingredients">
          {({ remove, push }) => (
            <React.Fragment>
              <Tooltip title="Legg til ingredienser som liste">
                <IconButton
                  color="primary"
                  className="add-ingredient"
                  onClick={() => setDialogOpen(true)}
                >
                  <PostAddIcon />
                </IconButton>
              </Tooltip>
              <AddIngredientsDialog
                open={dialogOpen}
                onClose={(items) => {
                  items?.forEach((item) => push(item));
                  setDialogOpen(false);
                }}
              />
              {values?.ingredients?.length > 0 &&
                values?.ingredients.map((ingredient, index) => (
                  <div key={index} className="add-dinner__form-ingredients">
                    <Field
                      name={`ingredients[${index}].name`}
                      component={FormikTextField}
                      InputLabelProps={{ shrink: true }}
                      style={{ flex: "2 2 auto", marginRight: "8px" }}
                      label="Navn"
                      variant="standard"
                    />
                    <Field
                      name={`ingredients[${index}].qty`}
                      component={FormikTextField}
                      InputLabelProps={{ shrink: true }}
                      style={{ flex: "0 0 60px", marginRight: "8px" }}
                      label="Kvantiet"
                      variant="standard"
                    />
                    <Field
                      name={`ingredients[${index}].unit`}
                      component={FormikTextField}
                      InputLabelProps={{ shrink: true }}
                      style={{ flex: "0 0 80px" }}
                      label="Enhet"
                      variant="standard"
                    />
                    <Tooltip title="Slett">
                      <IconButton color="error" onClick={() => remove(index)}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
              <Tooltip title="Legg til ingrediens">
                <IconButton
                  color="primary"
                  className="add-ingredient"
                  onClick={() => push({ name: "", qty: "", unit: "" })}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )}
        </FieldArray>
      </div>
    </Form>
  );
};

const DinnerTextField = (props: {
  id: string;
  value: string;
  label: string;
  handleChange: (e: React.ChangeEvent<any>) => void;
}) => {
  return (
    <TextField
      className="dinner-input"
      id={props.id}
      name={props.id}
      label={props.label}
      value={props.value}
      onChange={props.handleChange}
    />
  );
};
