import { Dinner } from '../models/dinner';
import { RecipeItem } from '../models/recipeItem';
import './dinner.form.scss';

import * as React from 'react';
import { Field, FieldArray, Form, Formik, FormikProps, useFormikContext } from 'formik';
import { IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { TextField as FormikTextField } from 'formik-mui';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

export const DinnerForm = (props: {
                             dinner: Dinner | null,
                             formikRef: React.RefObject<FormikProps<Dinner>>
                           }
) => {
  const { dinner } = props;

  return (
    <div>
      <Formik initialValues={{
        id: dinner?.id || 0,
        name: dinner?.name || '',
        picUrl: dinner?.picUrl || '',
        portions: dinner?.portions || '',
        tags: dinner?.tags || '',
        url: dinner?.url || '',
        ingredients: dinner?.ingredients || ( [ { qty: '', unit: '', ingredient: {name: ''} } ] as RecipeItem[] )
      }}
              innerRef={props.formikRef}
              onSubmit={() => console.log('submit')}>
        <DinnerFormikForm/>
      </Formik>
    </div>
  );
};

const DinnerFormikForm = () => {
  const { values, handleSubmit, handleChange } = useFormikContext<Dinner>();
  return (
    <Form onSubmit={handleSubmit}
          autoComplete="off">
      <div className="add-dinner__form">
        <DinnerTextField id="name"
                         value={values.name}
                         handleChange={handleChange}/>
        <DinnerTextField id="picUrl"
                         value={values.picUrl}
                         handleChange={handleChange}/>
        <DinnerTextField id="portions"
                         value={values.portions}
                         handleChange={handleChange}/>
        <DinnerTextField id="tags"
                         value={values.tags}
                         handleChange={handleChange}/>
        <DinnerTextField id="url"
                         value={values.url}
                         handleChange={handleChange}/>

        <Typography variant="h6">Ingredients</Typography>

        <FieldArray name="ingredients">
          {({ remove, push }) => (
            <React.Fragment>
              {values?.ingredients?.length > 0 &&
              values?.ingredients.map((ingredient, index) => (
                <div key={index}
                     className="add-dinner__form-ingredients">
                  <Field
                    name={`ingredients[${index}].ingredient.name`}
                    component={FormikTextField}
                    InputLabelProps={{ shrink: true }}
                    style={{ flex: '2 2 auto', marginRight: '8px' }}
                    label="Name"
                    variant="standard"/>
                  <Field
                    name={`ingredients[${index}].qty`}
                    component={FormikTextField}
                    InputLabelProps={{ shrink: true }}
                    style={{ flex: '0 0 60px', marginRight: '8px' }}
                    label="Qty"
                    variant="standard"/>
                  <Field
                    name={`ingredients[${index}].unit`}
                    component={FormikTextField}
                    InputLabelProps={{ shrink: true }}
                    style={{ flex: '0 0 80px' }}
                    label="Unit"
                    variant="standard"/>
                  <Tooltip title="Remove">
                    <IconButton color="error"
                                onClick={() => remove(index)}>
                      <ClearIcon/>
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
              <Tooltip title="Add new ingredient">
                <IconButton color="primary"
                            className="add-ingredient"
                            onClick={() => push({ name: '', qty: '', unit: '' })}>
                  <AddIcon/>
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )}
        </FieldArray>
      </div>
    </Form>
  );
};

const DinnerTextField = (props: { id: string, value: string, handleChange: (e: React.ChangeEvent<any>) => void }) => {
  return (
    <TextField
      className="dinner-input"
      id={props.id}
      name={props.id}
      label={props.id?.charAt(0)?.toUpperCase() + props.id?.slice(1)}
      value={props.value}
      onChange={props.handleChange}
    />
  );
};
