import React, { useRef, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../../axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30vw",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(3, 2, 2),
    width: "15%",
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
  },
}));

const validationSchema = Yup.object().shape({
  vendor_name: Yup.string().required("This field is Required"),
  email: Yup.string().email().required("This field is Required"),
  type: Yup.string().required("Please specify a type"),
  userid_id: Yup.string().required(),
});

function CreateCarMade({ setPage, setOpenPopup, itemToEdit, categories }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    car_made: itemToEdit ? itemToEdit.car_made : "",
    categoryid_id: itemToEdit ? itemToEdit.categoryid_id : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (itemToEdit) {
      axios
        .put(`/car-mades/${itemToEdit.id}`, formData)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setIsSubmitting(false);
          setResponseErrors(response.data.errors);
        });
    } else {
      axios
        .post("/car-mades", formData)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setIsSubmitting(false);
          setResponseErrors(response.data.errors);
        })
    }
  };

  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    updateFormData({
      car_made: "",
      categoryid_id: "",
    });
    setResponseErrors("");
  };
  return (
    <div className={classes.paper}>
      <Formik 
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleChange,
          handleBlur,
          touched,
          values,
          status,
          resetForm,
        }) => (
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="car_made"
              required
              fullWidth
              id="car_made"
              label="Car Made"
              value={formData.car_made}
              autoFocus
              onChange={handleChange}
              error={responseErrors?.car_made}
            />
          </Grid>
          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.car_made?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              {
                <TextField
                  id="standard-select-currency-native"
                  select
                  label="Category"
                  value={formData.categoryid_id}
                  name="categoryid_id"
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Please select a Category"
                  fullWidth
                  required
                  error={responseErrors?.categoryid_id}
                >
                  <option aria-label="None" value="" />
                  {categories?.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </TextField>
              }
            </FormControl>
          </Grid>
          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.categoryid_id?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}
        </Grid>

        {typeof responseErrors === "string" ? (
              <Grid item xs={12}>
                <span key={`faluire-msg`} className={classes.errorMsg}>
                  {responseErrors}
                </span>
              </Grid>
            ) : null}
        <Grid container justify="center">
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Submit
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => {
              handleReset();
              resetForm();
            }} 
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </Grid>
      </form>
      )}
      </Formik>
    </div>
  );
}

export default CreateCarMade;
