import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../axios";
import { RotateLeft } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "45vw",
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
    width: "30%",
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
    width: "30%",
  },
  uploadButton: {
    margin: theme.spacing(3, 2, 2),
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
  question: Yup.string()
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
  answer: Yup.string()
    .required("This field is Required")
    .test(
      "Not empty",
      "Cannot enter an empty value",
      (val) => val?.trim() !== ""
    ),
});

function FilterForm({ setOpenPopup, itemToEdit }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    question: itemToEdit ? itemToEdit.question : "",
    answer: itemToEdit ? itemToEdit.answer : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (itemToEdit) {
      await axios
        .post(`/update/question/${itemToEdit.id}`, formData)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch((res) => {
          setIsSubmitting(false);
          setResponseErrors(res.response.data.errors);
        });
    } else {
      await axios
        .post("/add/question", formData)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch((res) => {
          setIsSubmitting(false);
          setResponseErrors(res.response.data.errors);
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
      question: "",
      answer: "",
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
          values,
          status,
          resetForm,
        }) => (
          <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField
                  multiline
                  name="question"
                  required
                  fullWidth
                  id="question"
                  label="Question"
                  value={formData.question}
                  autoFocus
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.question ||
                    Boolean(touched.question && errors.question)
                  }
                  helperText={touched.question && errors.question}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.question?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <TextField
                  multiline
                  id="answer"
                  name="answer"
                  label="Answer"
                  multiline
                  rowsMax={10}
                  value={formData.answer}
                  fullWidth
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.answer ||
                    Boolean(touched.answer && errors.answer)
                  }
                  helperText={touched.answer && errors.answer}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.answer?.map((msg) => (
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

export default FilterForm;
