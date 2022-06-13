import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Dinner } from '../models/dinner';
import { DinnerForm } from '../shared/dinner-form';
import { useRef } from 'react';
import { FormikProps } from 'formik';

export const EditDinnerDialog = (props: {
  open: boolean,
  dinner: Dinner,
  handleClose: () => void,
  handleSave: (dinner: Dinner) => void
}) => {
  const formikRef = useRef<FormikProps<Dinner>>(null);

  const saveDinner = () => {
    const dinner = formikRef?.current?.values;
    if ( !!dinner ) {
      props.handleSave(dinner);
    }
  };

  return (
    <Dialog open={props.open}
            onClose={props.handleClose}>
      <DialogTitle>Edit dinner</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div>
            <DinnerForm
              dinner={props.dinner}
              formikRef={formikRef}/>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={saveDinner}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDinnerDialog;
