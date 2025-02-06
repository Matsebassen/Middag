import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";

import { useRef } from "react";
import { FormikProps } from "formik";
import { DinnerForm } from "../../shared/dinner-form";
import { Dinner } from "../../models/dinner";

export const EditDinnerDialog = (props: {
  open: boolean;
  dinner: Dinner;
  handleClose: () => void;
  handleSave: (dinner: Dinner) => void;
}) => {
  const formikRef = useRef<FormikProps<Dinner>>(null);

  const saveDinner = () => {
    const dinner = formikRef?.current?.values;
    if (dinner) {
      props.handleSave(dinner);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Rediger</DialogTitle>
      <DialogContent>
        <div>
          <DinnerForm dinner={props.dinner} formikRef={formikRef} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={saveDinner}>
          Lagre
        </Button>
        <Button onClick={props.handleClose}>Lukk</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDinnerDialog;
