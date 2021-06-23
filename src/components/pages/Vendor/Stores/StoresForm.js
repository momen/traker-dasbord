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
  country_id: Yup.string().required("Please select a Country"),
  area_id: Yup.string().required("Please select an Area"),
  city_id: Yup.string().required("Please select a City"),
});

function StoresForm({ setPage, setOpenPopup, itemToEdit, countries }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    address: itemToEdit ? itemToEdit.address : "",
    moderator_phone: itemToEdit ? itemToEdit.moderator_phone : "",
    moderator_alt_phone: itemToEdit?.moderator_alt_phone
      ? itemToEdit.moderator_alt_phone
      : "",
    lat: itemToEdit ? itemToEdit.lat : "",
    long: itemToEdit ? itemToEdit.long : "",
    country_id: itemToEdit ? itemToEdit.country_id : "",
    area_id: itemToEdit ? itemToEdit.area_id : "",
    city_id: itemToEdit ? itemToEdit.city_id : "",
  });
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
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
      moderator_phone: mod_phone,
      moderator_alt_phone: mod_alt_phone,
      lat: formData.lat,
      long: formData.long,
      country_id: formData.country_id,
      area_id: formData.area_id,
      city_id: formData.city_id,
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
      moderator_phone: "",
      moderator_alt_phone: "",
      lat: "",
      long: "",
      country_id: "",
      area_id: "",
      city_id: "",
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
              <Grid item xs={4}>
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

              <Grid item xs={4}>
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

              <Grid item xs={4}>
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

              <Grid item xs={4}>
                <TextField
                  select
                  label="country"
                  name="country_id"
                  value={formData.country_id}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleChange(e);
                      handleStateChange(e);
                      axios
                        .get(`areas/list/all/${e.target.value}`)
                        .then(({ data }) => {
                          const _areas = data.data.map(({ id, area_name }) => ({
                            id,
                            area_name,
                          })); // Customize
                          setAreas(_areas);
                        })
                        .catch(() => {
                          alert("Failed to Fetch Areas List");
                        });
                    } else {
                      setAreas([]);
                      updateFormData({
                        ...formData,
                        country_id: "",
                        area_id: "",
                        city_id: "",
                      });
                    }
                  }}
                  fullWidth
                  error={
                    Boolean(touched.country_id && errors.country_id) ||
                    responseErrors.country_id
                  }
                  helperText={
                    (touched.country_id && errors.country_id) ||
                    responseErrors.country_id
                  }
                  onBlur={handleBlur}
                  InputProps={{
                    classes: {
                      input: classes.input,
                    },
                  }}
                  FormHelperTextProps={{
                    classes: {
                      error: classes.error,
                    },
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {countries?.map((country) => (
                    <option
                      key={`country-${country.id}`}
                      value={country.id}
                      className={classes.dropdownOption}
                    >
                      {country.country_name}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  disabled={!formData.country_id}
                  select
                  label="Area"
                  name="area_id"
                  value={formData.area_id}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleChange(e);
                      handleStateChange(e);
                      axios
                        .get(`cities/list/all/${e.target.value}`)
                        .then(({ data }) => {
                          const _cities = data.data.map(
                            ({ id, city_name }) => ({
                              id,
                              city_name,
                            })
                          ); // Customize
                          setCities(_cities);
                        })
                        .catch(() => {
                          alert("Failed to Fetch Cities List");
                        });
                    } else {
                      setCities([]);
                      updateFormData({
                        ...formData,
                        area_id: "",
                        city_id: "",
                      });
                    }
                  }}
                  fullWidth
                  error={
                    Boolean(touched.area_id && errors.area_id) ||
                    responseErrors.area_id
                  }
                  helperText={
                    (touched.area_id && errors.area_id) ||
                    responseErrors.area_id
                  }
                  onBlur={handleBlur}
                  InputProps={{
                    classes: {
                      input: classes.input,
                    },
                  }}
                  FormHelperTextProps={{
                    classes: {
                      error: classes.error,
                    },
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value=""></option>
                  {areas?.map((area) => (
                    <option
                      key={`area-${area.id}`}
                      value={area.id}
                      className={classes.dropdownOption}
                    >
                      {area.area_name}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  disabled={!formData.area_id}
                  select
                  label="City"
                  name="city_id"
                  fullWidth
                  value={formData.city_id}
                  error={
                    Boolean(touched.city_id && errors.city_id) ||
                    responseErrors.city_id
                  }
                  helperText={
                    (touched.city_id && errors.city_id) ||
                    responseErrors.city_id
                  }
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  InputProps={{
                    classes: {
                      input: classes.input,
                    },
                  }}
                  FormHelperTextProps={{
                    classes: {
                      error: classes.error,
                    },
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value=""></option>
                  {cities?.map((city) => (
                    <option
                      key={`city-${city.id}`}
                      value={city.id}
                      className={classes.dropdownOption}
                    >
                      {city.city_name}
                    </option>
                  ))}
                </TextField>
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
