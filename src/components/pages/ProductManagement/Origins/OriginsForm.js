import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../../axios";
import { RotateLeft } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "20vw",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submitButton: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    fontWeight: "600",
    color: "#EF9300",
    background: "#ffffff",
    border: "1px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
    margin: theme.spacing(3, 2, 2),
    width: "40%",
  },
  resetButton: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    fontWeight: "600",
    color: "#7B7B7B",
    background: "#ffffff",
    border: "1px solid #7B7B7B",
    borderRadius: 0,
    // "&:hover": {
    //   background: "#EF9300",
    //   color: "#ffffff",
    // },
    margin: theme.spacing(3, 2, 2),
    width: "40%",
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
  country_name: Yup.string()
    .required("This field is Required")
    .test(
      "Not empty",
      "Please remove any spaces at the beginning",
      (val) => !(val?.substring(0, 1) === " ")
    ),
});

function OriginsForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    country_name: itemToEdit ? itemToEdit.country_name : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (itemToEdit) {
      axios
        .post(`/update/origin/countries/${itemToEdit.id}`, formData)
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
        .post("/add/origin/countries", formData)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setIsSubmitting(false);
          setResponseErrors(response.data.errors);
        });
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
      country_name: "",
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
          handleSubmit,
          handleChange,
          handleBlur,
          touched,
          resetForm,
        }) => (
          <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="country_name"
                  required
                  fullWidth
                  label="Origin Country Name"
                  // prefix="%"
                  value={formData.country_name}
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
              </Grid>
              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.country_name?.map((msg) => (
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
            <Grid container justify="center" style={{ marginTop: 10 }}>
              <Button
                className={classes.submitButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Submit
              </Button>
              <Button
                className={classes.resetButton}
                startIcon={<RotateLeft />}
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

export default OriginsForm;
