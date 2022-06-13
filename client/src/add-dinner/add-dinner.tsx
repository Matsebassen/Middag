import { Dinner } from '../models/dinner';
import './add-dinner.scss';
import { DinnerForm } from '../shared/dinner-form';
import { addDinner } from './add-dinner-service';
import * as React from 'react';
import { useRef, useState } from 'react';
import { FormikProps } from 'formik';
import { Button, Card, CardActions, CardContent, CardHeader, LinearProgress } from '@mui/material';


const AddDinner = () => {
  const formikRef = useRef<FormikProps<Dinner>>(null);
  const [ loading, setLoading ] = useState(false);

  const addNewDinner = async () => {
    try {
      const dinner: ( Dinner | undefined ) = formikRef.current?.values;
      if ( dinner ) {
        setLoading(true);
        await addDinner(dinner);
        formikRef?.current?.resetForm();
      }
    } catch ( e ) {
      alert('Failed to add dinner');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-dinner">
      <Card>
        <CardHeader
          title="Add dinner"
        />
        <CardContent>
          <DinnerForm dinner={null}
                      formikRef={formikRef}/>
        </CardContent>
        <CardActions>
          <div className="form-actions">
            {loading && <LinearProgress variant="indeterminate"/>}
            <Button
              color="primary"
              variant="contained"
              onClick={() => addNewDinner()}
              fullWidth>
              Add dinner
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}

export default AddDinner;
