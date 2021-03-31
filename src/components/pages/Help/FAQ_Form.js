import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "60vw",
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

function FAQ_Form({ setOpenPopup, itemToEdit }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    question: itemToEdit ? itemToEdit.question : "",
    answer: itemToEdit ? itemToEdit.answer : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
              name="question"
              required
              fullWidth
              id="question"
              label="Question"
              value={formData.question}
              autoFocus
              onChange={handleChange}
              error={responseErrors?.question}
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
              id="answer"
              name="answer"
              label="Answer"
              multiline
              rowsMax={10}
              value={formData.answer}
              fullWidth
              onChange={handleChange}
              error={responseErrors?.answer}
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

export default FAQ_Form;
