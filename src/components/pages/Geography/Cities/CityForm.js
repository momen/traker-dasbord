import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { PhotoCamera } from "@material-ui/icons";
import { CloseIcon } from "@material-ui/data-grid";
import { Alert, Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import { Formik } from "formik";

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
  uploadButton: {
    margin: theme.spacing(3, 2, 2),
  },
  uploadInput: {
    display: "none",
  },

  inputMessage: {
    wordBreak: "break-word",
  },
  chip: {
    margin: theme.spacing(0.5),
    maxWidth: "100%",
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function ProductsForm({ setPage, setOpenPopup, itemToEdit, areas = [] }) {
  const classes = useStyles();

  const [formData, updateFormData] = useState({
    city_name: itemToEdit ? itemToEdit.city_name : "",
    area_id: itemToEdit ? itemToEdit.area_id : "",
  });

  const validationSchema = Yup.object().shape({
    city_name: Yup.string()
      .required("This field is Required")
      .test(
        "No floating points",
        "Please remove any dots",
        (val) => !val?.includes(".")
      )
      .test(
        "Not empty",
        "Please remove any spaces at the beginning",
        (val) => !(val?.substring(0, 1) === " ")
      ),
    area_id: Yup.string().required(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Update on other components
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (itemToEdit) {
      await axios
        .post(`/cities/${itemToEdit.id}`, formData)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch((res) => {
          setIsSubmitting(false); // Update on other components
          setResponseErrors(res.response.data.errors);
        });
    } else {
      await axios
        .post("/cities", formData)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch((res) => {
          setIsSubmitting(false); // Update on other components
          setResponseErrors(res.response.data.errors);
        });
    }
  };

  // Update Function Name on other components
  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleReset = () => {
    updateFormData({});
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
          handleSubmit,
          handleChange,
          handleBlur,
          touched,
          values,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div>
                  <TextField
                    name="city_name"
                    required
                    fullWidth
                    id="city_name"
                    label="City Name"
                    value={values.city_name}
                    autoFocus
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.city_name ||
                      Boolean(touched.city_name && errors.city_name)
                    }
                    helperText={touched.city_name && errors.city_name}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.city_name?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>
              {/****************************** ******************************/}

              <Grid item xs={6}>
                <div style={{ maxWidth: "100%" }}>
                  <TextField
                    select
                    label="Area"
                    value={formData.area_id}
                    name="area_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.area_id ||
                      Boolean(touched.area_id && errors.area_id)
                    }
                    helperText="Please select an Area"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {areas?.map((area) => (
                      <option value={area.id}>{area.area_name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.area_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>
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
                disabled={isSubmitting} // Update on other components
              >
                Submit
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                disabled={isSubmitting} // Update on other components
                onClick={() => {
                  handleReset();
                  resetForm();
                  errors.categories = false;
                  touched.categories = false;
                  errors.tags = false;
                  touched.tags = false;
                }} // Apply to other forms -For refactoring all forms-
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

export default ProductsForm;
