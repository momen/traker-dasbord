import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40vw",
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

function ProductsForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [formData, updateFormData] = useState({
    country_name: itemToEdit ? itemToEdit.country_name : "",
    name_en: itemToEdit ? itemToEdit.name_en : "",
    country_code: itemToEdit ? itemToEdit.country_code : "",
    phonecode: itemToEdit ? itemToEdit.phonecode : "",
  });

  const validationSchema = Yup.object().shape({
    country_name: Yup.string()
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
    name_en: Yup.string()
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
    country_code: Yup.string()
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
    phonecode: Yup.number().required("This field is Required"),
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Update on other components
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (itemToEdit) {
      await axios
        .post(`/countries/${itemToEdit.id}`, formData)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch((res) => {
          setIsSubmitting(false); // Update on other components
          setResponseErrors(res.response.data.errors);
        });
    } else {
      await axios
        .post("/countries", formData)
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
          <form onSubmit={handleSubmit} className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div>
                  <TextField
                    name="country_name"
                    required
                    fullWidth
                    id="country_name"
                    label="Country Name (Ar)"
                    value={values.country_name}
                    autoFocus
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.country_name ||
                      Boolean(touched.country_name && errors.country_name)
                    }
                    helperText={touched.country_name && errors.country_name}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.country_name?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12} sm={6}>
                <div>
                  <TextField
                    name="name_en"
                    required
                    fullWidth
                    id="name_en"
                    label="Country Name (En)"
                    value={values.name_en}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.name_en ||
                      Boolean(touched.name_en && errors.name_en)
                    }
                    helperText={touched.name_en && errors.name_en}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.name_en?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="country_code"
                  disabled={itemToEdit}
                  required
                  fullWidth
                  id="country_code"
                  label="Country Code"
                  value={formData.country_code}
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.country_code ||
                    Boolean(touched.country_code && errors.country_code)
                  }
                  helperText={touched.country_code && errors.country_code}
                />

                {responseErrors ? (
                  <div className={classes.inputMessage}>
                    {responseErrors.country_code?.map((msg) => (
                      <span key={msg} className={classes.errorMsg}>
                        {msg}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6}>
                <div>
                  <NumberFormat
                    allowNegative={false}
                    customInput={TextField}
                    name="phonecode"
                    disabled={itemToEdit}
                    fullWidth
                    label="Phone Code"
                    // prefix="%"
                    value={formData.phonecode}
                    onChange={(e) => {
                      updateFormData({
                        ...formData,
                        phonecode: e.target.value
                          ? parseInt(e.target.value)
                          : "",
                      });
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.phonecode ||
                      Boolean(touched.phonecode && errors.phonecode)
                    }
                    helperText={touched.phonecode && errors.phonecode}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.phonecode?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              {/****************************** ******************************/}

              {/* <Grid item xs={6} md={3}>
                <div>
                  <TextField
                    select
                    label="Store"
                    value={formData.store_id}
                    name="store_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.store_id ||
                      Boolean(touched.store_id && errors.store_id)
                    }
                    helperText="Please select a Store"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {stores?.map((store) => (
                      <option value={store.id}>{store.name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.store_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid> */}
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
                {isSubmitting ? (
                  <CircularProgress
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "#EF9300",
                    }}
                  />
                ) : (
                  t("global.submitBtn")
                )}
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
                {t("global.resetBtn")}
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default ProductsForm;
