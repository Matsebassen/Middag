import { Dinner } from '../models/dinner';
import './add-dinner.scss';

import { Formik, Form, Field, useFormikContext, FieldArray, FormikProps } from 'formik';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import * as React from 'react';
import { Ingredient } from '../models/ingredient';
import {TextField as FormikTextField} from 'formik-mui'
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { addDinner } from './add-dinner-service';
import { useRef, useState } from 'react';

const AddDinner = (props: {}) => {
  const formikRef = useRef<FormikProps<Dinner>>(null);
  const [loading, setLoading] = useState(false);

  const addNewDinner = async (dinner: Dinner) => {
    try {
      setLoading(true);
      await addDinner(dinner);
      formikRef?.current?.resetForm();
    } catch(e){
      alert('Failed to add dinner');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-dinner">
      <Formik initialValues={{
        name: '',
        picUrl: '',
        portions: '',
        tags: '',
        url: '',
        ingredients: [{name: '', qty: '', unit: ''}] as Ingredient[]
      }}
              innerRef={formikRef}
              onSubmit={((values: Dinner) => addNewDinner(values))}>
        <DinnerForm loading={loading}/>
      </Formik>
    </div>
  );
}

const DinnerForm = (props: {loading: boolean}) => {
  const { values, handleSubmit, handleChange } = useFormikContext<Dinner>();
  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
        <Card>
          <CardHeader
            title="Add dinner"
          />
          <CardContent>
            <div className="add-dinner__form">
              <DinnerTextField id="name" value={values.name} handleChange={handleChange}/>
              <DinnerTextField id="picUrl" value={values.picUrl} handleChange={handleChange}/>
              <DinnerTextField id="portions" value={values.portions} handleChange={handleChange}/>
              <DinnerTextField id="tags" value={values.tags} handleChange={handleChange}/>
              <DinnerTextField id="url" value={values.url} handleChange={handleChange}/>

              <Typography variant="h6">Ingredients</Typography>

              <FieldArray name="ingredients">
                {({ remove, push }) => (
                   <React.Fragment>
                     {values?.ingredients?.length > 0 &&
                     values?.ingredients.map((ingredient, index) => (
                       <div key={index} className="add-dinner__form-ingredients">
                         <Field
                           name={`ingredients[${index}].name`}
                           component={FormikTextField}
                           InputLabelProps={{ shrink: true }}
                           style={{flex: "2 2 auto", marginRight: "8px"}}
                           label="Name"
                           variant="standard"/>
                         <Field
                           name={`ingredients[${index}].qty`}
                           component={FormikTextField}
                           InputLabelProps={{ shrink: true }}
                           style={{flex: "0 0 60px", marginRight: "8px"}}
                           label="Qty"
                           variant="standard"/>
                         <Field
                           name={`ingredients[${index}].unit`}
                           component={FormikTextField}
                           InputLabelProps={{ shrink: true }}
                           style={{flex: "0 0 80px"}}
                           label="Unit"
                           variant="standard"/>
                         <Tooltip title="Remove">
                           <IconButton color="error" onClick={() => remove(index)}>
                             <ClearIcon/>
                           </IconButton>
                         </Tooltip>
                       </div>
                     ))}
                     <Tooltip title="Add new ingredient">
                       <IconButton color="primary"
                                   className="add-ingredient"
                                   onClick={() => push({name: '', qty:'', unit:''})}>
                         <AddIcon/>
                       </IconButton>
                     </Tooltip>
                   </React.Fragment>
                  )}
              </FieldArray>
            </div>
          </CardContent>
          <CardActions>
            <div className="form-actions">
              {props.loading && <LinearProgress variant="indeterminate"/>}
              <Button color="primary" variant="contained"  type="submit" fullWidth  >
                Add dinner
              </Button>
            </div>
          </CardActions>
        </Card>
    </Form>
  );
};

const DinnerTextField = (props: {id: string, value: string, handleChange: (e: React.ChangeEvent<any>) => void}) => {
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
}

export default AddDinner;
