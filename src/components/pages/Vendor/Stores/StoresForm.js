import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import axios from "../../../../axios";
import Map from "../../../Map/Map";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import { Formik } from "formik";

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
  uploadInput: {
    display: "none",
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
  name: Yup.string()
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
  address: Yup.string()
    .required("This field is Required")
    .test(
      "Not empty",
      "Please remove any spaces at the beginning",
      (val) => !(val?.substring(0, 1) === " ")
    ),
  moderator_name: Yup.string()
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
  moderator_phone: Yup.string()
    .test(
      "len",
      "Enter a valid phone number",
      (val) => val?.replace(/[^A-Z0-9]/gi, "").length === 12
    )
    .required("This field is Required"),
  moderator_alt_phone: Yup.string()
    .notRequired()
    .test("len", "Enter a valid phone number", (val) => {
      if (!val) {
        return true;
      }
      return val?.replace(/[^A-Z0-9]/gi, "").length === 12;
    }),
  // lat: Yup.string().required("This field is Required"),
  // long: Yup.string().required("This field is Required"),
});

function StoresForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    address: itemToEdit ? itemToEdit.address : "",
    moderator_name: itemToEdit ? itemToEdit.moderator_name : "",
    moderator_phone: itemToEdit ? itemToEdit.moderator_phone : "",
    moderator_alt_phone: itemToEdit?.moderator_alt_phone
      ? itemToEdit.moderator_alt_phone
      : "",
    lat: itemToEdit ? itemToEdit.lat : "",
    long: itemToEdit ? itemToEdit.long : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationNotSelected, setLocationNotSelected] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async () => {
    if (!formData.lat || !formData.long) {
      setLocationNotSelected(true);
      return;
    }

    let mod_phone = formData.moderator_phone.replace(/[^A-Z0-9]/gi, "");
    let mod_alt_phone = formData.moderator_alt_phone.replace(/[^A-Z0-9]/gi, "");

    let data = {
      name: formData.name,
      address: formData.address,
      moderator_name: formData.moderator_name,
      moderator_phone: mod_phone,
      moderator_alt_phone: mod_alt_phone,
      lat: formData.lat,
      long: formData.long,
    };

    setLocationNotSelected(false);
    setIsSubmitting(true);

    if (itemToEdit) {
      await axios
        .post(`/update/stores/${itemToEdit.id}`, data)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch((res) => {
          setIsSubmitting(false);
          setResponseErrors(res.response.data.errors);
        });
    } else {
      await axios
        .post("/add/stores", data)
        .then((res) => {
          setPage(1);
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

  //Customize
  const handleReset = () => {
    updateFormData({
      name: "",
      address: "",
      moderator_name: "",
      moderator_phone: "",
      moderator_alt_phone: "",
      lat: "",
      long: "",
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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Store Name"
                    value={formData.name}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.name ||
                      Boolean(touched.name && errors.name)
                    }
                    helperText={touched.name && errors.name}
                    autoFocus
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.name?.map((msg) => (
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
                  <TextField
                    name="moderator_name"
                    required
                    fullWidth
                    id="moderator_name"
                    label="Moderator Name"
                    value={formData.moderator_name}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.moderator_name ||
                      Boolean(touched.moderator_name && errors.moderator_name)
                    }
                    helperText={touched.moderator_name && errors.moderator_name}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.moderator_name?.map((msg) => (
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
                  <NumberFormat
                    name="moderator_phone"
                    required
                    fullWidth
                    format={
                      itemToEdit ? "+### ## ### ####" : "+966 ## ### ####"
                    }
                    mask="_ "
                    allowEmptyFormatting
                    customInput={TextField}
                    id="moderator_phone"
                    label="Moderator Phone"
                    value={formData.moderator_phone}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.moderator_phone ||
                      Boolean(touched.moderator_phone && errors.moderator_phone)
                    }
                    helperText={
                      touched.moderator_phone && errors.moderator_phone
                    }
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.moderator_phone?.map((msg) => (
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
                  <NumberFormat
                    name="moderator_alt_phone"
                    fullWidth
                    format="+966 ## ### ####"
                    mask="_ "
                    customInput={TextField}
                    id="moderator_alt_phone"
                    label="Moderator Alternative Phone"
                    value={formData.moderator_alt_phone}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.moderator_alt_phone ||
                      Boolean(
                        touched.moderator_alt_phone &&
                          errors.moderator_alt_phone
                      )
                    }
                    helperText={
                      touched.moderator_alt_phone && errors.moderator_alt_phone
                    }
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.moderator_alt_phone?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12}>
                <div>
                  <TextField
                    name="address"
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    value={formData.address}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.address ||
                      Boolean(touched.address && errors.address)
                    }
                    helperText={touched.address && errors.address}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.address?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item>
                <label htmlFor="stores-map" style={{ marginTop: "10px" }}>
                  Select your store location
                </label>
              </Grid>

              <Grid
                item
                xs={12}
                style={{
                  height: "60vh",
                  position: "relative",
                  marginBottom: "10px",
                }}
              >
                <div style={{ height: "60vh" }}>
                  <Map
                    id="stores-map"
                    lattitude={formData.lat ? parseFloat(formData.lat) : null}
                    longitude={formData.long ? parseFloat(formData.long) : null}
                    formData={formData}
                    updateFormData={updateFormData}
                    setLocationNotSelected={setLocationNotSelected}
                  />
                </div>
              </Grid>
              {locationNotSelected ? (
                <Grid item xs={12}>
                  <span key={`no-location`} className={classes.errorMsg}>
                    Please Select a location on the map.
                  </span>
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

export default StoresForm;
