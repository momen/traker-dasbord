import React, { useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../../axios";
import { RotateLeft } from "@material-ui/icons";
import SuccessPopup from "../../../SuccessPopup";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // width: "30vw",
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
    width: "15%",
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
    width: "15%",
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
    width: "fit-content",
  },
}));

const validationSchema = Yup.object().shape({
  car_made: Yup.string()
    .required("This field is Required")
    .test(
      "No floating points",
      "Please remove any dots",
      (val) => !val?.includes(".")
    )
    .matches(/^([^0-9]*)$/, "Number are not allowed, only letters.")
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
    .matches(/^([^0-9]*)$/, "Number are not allowed, only letters.")
    .test(
      "Not empty",
      "Please remove any spaces at the beginning",
      (val) => !(val?.substring(0, 1) === " ")
    ),
  cartype_id: Yup.string().required(),
});

function CreateCarMade({
  setPage,
  setOpenPopup,
  itemToEdit,
  carTypes,
  setViewMode,
  setPageHeader,
}) {
  const classes = useStyles();
  const { t } = useTranslation();

  const formRef = useRef();
  const { lang } = useSelector((state) => state);

  const [formData, updateFormData] = useState({
    car_made: itemToEdit ? itemToEdit.car_made : "",
    name_en: itemToEdit ? itemToEdit.name_en : "",
    cartype_id: itemToEdit ? itemToEdit.cartype_id : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState(
    itemToEdit ? "Brand updated successfully." : "New Brand added successfully."
  );

  const closeDialog = () => {
    setDialogOpen(false);
    setViewMode("data-grid");
    setPageHeader("Brands List");
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (itemToEdit) {
      axios
        .put(`/car-mades/${itemToEdit.id}`, formData)
        .then((res) => {
          setPage(1);
          setDialogOpen(true);
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
          setDialogOpen(true);
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
      car_made: "",
      cartype_id: "",
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
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  name="car_made"
                  required
                  fullWidth
                  id="car_made"
                  label="Brand (Arabic)"
                  value={formData.car_made}
                  autoFocus
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.car_made ||
                    Boolean(touched.car_made && errors.car_made)
                  }
                  helperText={touched.car_made && errors.car_made}
                />
              </Grid>
              {responseErrors?.car_made ? (
                <Grid item xs={12}>
                  {responseErrors.car_made?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  name="name_en"
                  required
                  fullWidth
                  id="name_en"
                  label="Brand (English)"
                  value={formData.name_en}
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
              </Grid>
              {responseErrors?.name_en ? (
                <Grid item xs={12}>
                  {responseErrors.name_en?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={4}></Grid>

              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  select
                  label="Vehicle Type"
                  value={formData.cartype_id}
                  name="cartype_id"
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Please select a Vehicle Type"
                  fullWidth
                  required
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.cartype_id ||
                    Boolean(touched.cartype_id && errors.cartype_id)
                  }
                >
                  <option aria-label="None" value="" />
                  {carTypes?.map((carType) => (
                    <option value={carType.id}>
                      {lang === "ar"
                        ? carType.car_made || carType.name_en
                        : carType.name_en || carType.car_made}
                    </option>
                  ))}
                </TextField>
              </Grid>
              {responseErrors?.cartype_id ? (
                <Grid item xs={12}>
                  {responseErrors.cartype_id?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              {typeof responseErrors === "string" ? (
                <Grid item xs={12}>
                  <span key={`faluire-msg`} className={classes.errorMsg}>
                    {responseErrors}
                  </span>
                </Grid>
              ) : null}
            </Grid>

            <Grid container justify="center">
              <Button
                className={classes.submitButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
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
                className={classes.resetButton}
                startIcon={<RotateLeft />}
                variant="contained"
                onClick={() => {
                  handleReset();
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                {t("global.resetBtn")}
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
      <SuccessPopup
        open={dialogOpen}
        setOpen={setDialogOpen}
        message={dialogText}
        handleClose={closeDialog}
      />
    </div>
  );
}

export default CreateCarMade;
