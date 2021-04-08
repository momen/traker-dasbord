import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../axios";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
  from: Yup.date().required("Please select a starting date").nullable(),
  to: Yup.date()
    .min(Yup.ref("from"), "This date can't be eariler than the starting one")
    .required("Please select an ending date")
    .nullable(),
});

function FAQ_Form({
  setOpenPopup,
  filterData,
  updateFilterData,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState(filterData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async (e) => {
    updateFilterData(formData);
    setOpenPopup(false);
  };

  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    updateFormData({
      from: null,
      to: null,
    });
    setFromDate(null);
    setToDate(null);
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
          handleBlur,
          setFieldValue,
          touched,
          values,
          status,
          resetForm,
        }) => (
          <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <div>
                    <KeyboardDatePicker
                      name="from"
                      required
                      disableToolbar
                      disableFuture
                      autoOk={true}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-from"
                      label="From"
                      value={fromDate}
                      onChange={(date) => {
                        setFieldValue("from", date);
                        setFromDate(date);
                        updateFormData({
                          ...formData,
                          from: date.toISOString().slice(0, 10),
                        });
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.from ||
                        Boolean(touched.from && errors.from)
                      }
                      helperText={touched.from && errors.from}
                      KeyboardButtonProps={{
                        "aria-label": "from date",
                      }}
                    />
                    {responseErrors ? (
                      <div className={classes.inputMessage}>
                        {responseErrors.from?.map((msg) => (
                          <span key={msg} className={classes.errorMsg}>
                            {msg}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Grid>

                <Grid item xs={6} md={3}>
                  <div>
                    <KeyboardDatePicker
                      name="to"
                      required
                      disableToolbar
                      disableFuture
                      autoOk={true}
                      minDate={fromDate}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-to"
                      label="To"
                      value={toDate}
                      onChange={(date) => {
                        setFieldValue("to", date);
                        setToDate(date);
                        updateFormData({
                          ...formData,
                          to: date.toISOString().slice(0, 10),
                        });
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.to || Boolean(touched.to && errors.to)
                      }
                      helperText={touched.to && errors.to}
                      KeyboardButtonProps={{
                        "aria-label": "from date",
                      }}
                    />
                    {responseErrors ? (
                      <div className={classes.inputMessage}>
                        {responseErrors.to?.map((msg) => (
                          <span key={msg} className={classes.errorMsg}>
                            {msg}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>

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
