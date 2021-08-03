import React, { useRef, useState } from "react";
import {
  Button,
  Chip,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../../axios";
import { RotateLeft } from "@material-ui/icons";
import SuccessPopup from "../../../SuccessPopup";
import { Alert } from "@material-ui/lab";
import { CloseIcon } from "@material-ui/data-grid";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    width: "15%",
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
    width: "15%",
  },
  uploadButton: {
    margin: theme.spacing(3, 2, 2),
  },
  chip: {
    margin: theme.spacing(3, 2, 2),
    maxWidth: "100%",
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
  type_name: Yup.string()
    .required("This field is Required")
    .test(
      "Not empty",
      "Please remove any spaces at the beginning",
      (val) => !(val?.substring(0, 1) === " ")
    ),
});

function CarTypesForm({
  setPage,
  setOpenPopup,
  itemToEdit,
  setViewMode,
  setPageHeader,
}) {
  const classes = useStyles();

  const formRef = useRef();
  const uploadRef = useRef();

  const [formData, updateFormData] = useState({
    type_name: itemToEdit ? itemToEdit.type_name : "",
    photo: "",
  });
  const [imgName, setImgName] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");
  const [bigImgSize, setBigImgSize] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState(
    itemToEdit
      ? "Car Type edited successfully."
      : "New car type added successfully."
  );

  const closeDialog = () => {
    setDialogOpen(false);
    setViewMode("data-grid");
    setPageHeader("Car Types");
  };

  const handleSubmit = () => {
    if (!formData.photo && !itemToEdit) {
      setOpenAlert(true);
    } else {
      let data = new FormData();

      data.append("type_name", formData.type_name);

      data.append("photo", formData.photo, formData.photo.name);

      setIsSubmitting(true);

      if (itemToEdit) {
        axios
          .post(`/car-types/${itemToEdit.id}`, data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setDialogOpen(true);
          })
          .catch(({ response }) => {
            setIsSubmitting(false);
            setResponseErrors(response.data.errors);
          });
      } else {
        axios
          .post("/car-types", data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setPage(1);
            setDialogOpen(true);
          })
          .catch(({ response }) => {
            setIsSubmitting(false);
            setResponseErrors(response.data.errors);
          });
      }
    }
  };

  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = (e) => {
    const imgSize = e.target.files[0]?.size / 1000; //Convert Size from bytes to kilo bytes

    // Maximum Size for an Image is 2MB
    if (imgSize > 2000) {
      setBigImgSize(true);
      return;
    }

    setBigImgSize(false);

    setImgName(e.target.files[0].name);
    updateFormData({
      ...formData,
      photo: e.target.files[0],
    });
    setOpenAlert(false);
  };

  const handleDeleteImage = () => {
    updateFormData({
      ...formData,
      photo: "",
    });

    setImgName("");

    uploadRef.current.value = "";
    // Empty the FileList of the input file, to be able to add the file again to avoid bad user experience
    // as we can't manipulate the FileList directly.
  };

  const handleReset = () => {
    updateFormData({
      type_name: "",
    });
    setResponseErrors("");
    setImgName("");
    setOpenAlert(false);
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
                  name="type_name"
                  required
                  fullWidth
                  label="Type Name"
                  // prefix="%"
                  value={formData.type_name}
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.type_name ||
                    Boolean(touched.type_name && errors.type_name)
                  }
                  helperText={touched.type_name && errors.type_name}
                />
              </Grid>
              <Grid item xs={8}></Grid>
              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.type_name?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={12} md={3}>
                <input
                  ref={uploadRef}
                  accept="image/*"
                  className={classes.uploadInput}
                  id="icon-button-file"
                  type="file"
                  onChange={handleUpload}
                />
                <label htmlFor="icon-button-file">
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.uploadButton}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </Grid>

              {imgName ? (
                <Grid item xs md={9}>
                  <Chip
                    className={classes.chip}
                    // icon={<FaceIcon/>}
                    label={imgName}
                    onDelete={handleDeleteImage}
                    variant="outlined"
                  />
                </Grid>
              ) : null}

              {bigImgSize ? (
                <Grid item xs={12}>
                  <p className={classes.errorMsg}>
                    The uploaded image size shouldn't exceed 2MB.
                  </p>
                </Grid>
              ) : null}

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.photo?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <FormControl>
                  <Collapse in={openAlert}>
                    <Alert
                      severity="error"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOpenAlert(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      Please upload an Image.
                    </Alert>
                  </Collapse>
                </FormControl>
              </Grid>
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
      <SuccessPopup
        open={dialogOpen}
        setOpen={setDialogOpen}
        message={dialogText}
        handleClose={closeDialog}
      />
    </div>
  );
}

export default CarTypesForm;
