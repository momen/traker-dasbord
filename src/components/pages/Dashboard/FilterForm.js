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
import { RotateLeft } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "25vw",
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
    border: "2px solid #EF9300",
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
    border: "2px solid #7B7B7B",
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
  const [newFromDate, setNewFromDate] = useState(fromDate);
  const [newToDate, setNewToDate] = useState(toDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    setFromDate(newFromDate);
    setToDate(newToDate);
    updateFilterData({
      from: newFromDate.toISOString().slice(0, 10),
      to: newToDate.toISOString().slice(0, 10),
    });
    setOpenPopup(false);
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
        initialValues={{
          from: fromDate,
          to: toDate,
        }}
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
                <Grid item xs={6}>
                  <div>
                    <KeyboardDatePicker
                      name="from"
                      disableToolbar
                      disableFuture
                      autoOk={true}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-from"
                      label="From *"
                      value={newFromDate}
                      onChange={(date) => {
                        setFieldValue("from", date);
                        setNewFromDate(date);
                        // updateFormData({
                        //   ...formData,
                        //   from: date.toISOString().slice(0, 10),
                        // });
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
                      InputProps={{ readOnly: true }}
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

                <Grid item xs={6}>
                  <div>
                    <KeyboardDatePicker
                      name="to"
                      disableToolbar
                      disableFuture
                      autoOk={true}
                      minDate={newFromDate}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-to"
                      label="To *"
                      value={newToDate}
                      onChange={(date) => {
                        setFieldValue("to", date);
                        setNewToDate(date);
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.to || Boolean(touched.to && errors.to)
                      }
                      helperText={touched.to && errors.to}
                      KeyboardButtonProps={{
                        "aria-label": "from date",
                      }}
                      InputProps={{ readOnly: true }}
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

export default FAQ_Form;
