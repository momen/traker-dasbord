import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Chip,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { CloudUpload, PhotoCamera } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { CloseIcon } from "@material-ui/data-grid";
import * as Yup from "yup";
import { Formik } from "formik";

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
    whiteSpace: "nowrap",
    minWidth: "fit-content",
    // width: "15%",
  },
  uploadButton: {
    whiteSpace: "nowrap",
  },
  uploadInput: {
    display: "none",
  },
  chip: {
    // margin: theme.spacing(3, 2, 2),
    maxWidth: "100%",
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#F44336",
  },
  error: {
    color: "#F44336",
  },
  errorAlert: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
  },
}));

const validationSchema = Yup.object().shape({
  vendor_name: Yup.string()
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
  email: Yup.string()
    .required("This field is Required")
    .email("Please enter a valid Email"),
  type: Yup.string().required("Please specify a type"),
  userid_id: Yup.string().required(),
  commercial_no: Yup.string()
    .required("This field is Required")
    .matches(/^(?!.* )/, "Please remove any spaces"),
  tax_card_no: Yup.string()
    .required("This field is Required")
    .matches(/^(?!.* )/, "Please remove any spaces"),

  bank_account: Yup.string()
    .required("This field is Required")
    .matches(/^(?!.* )/, "Please remove any spaces"),
});

function VendorsForm({ setPage, setOpenPopup, itemToEdit, users }) {
  const classes = useStyles();

  const formRef = useRef();
  const uploadRef = useRef();
  const commercialDocRef = useRef();
  const taxDocRef = useRef();
  const [formData, updateFormData] = useState({
    vendor_name: itemToEdit ? itemToEdit.vendor_name : "",
    email: itemToEdit ? itemToEdit.email : "",
    type: itemToEdit ? itemToEdit.type : "",
    userid_id: itemToEdit ? itemToEdit.userid_id : "",
    bank_account: itemToEdit ? itemToEdit.bank_account : "",
    commercial_no: itemToEdit ? itemToEdit.commercial_no : "",
    commercialDocs: "",
    tax_card_no: itemToEdit ? itemToEdit.tax_card_no : "",
    taxCardDocs: "",
    images: "",
  });
  const [usersList, setUsersList] = useState(users);
  const [openAlert, setOpenAlert] = useState(false);
  const [imgName, setImgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");
  const [bigImgSize, setBigImgSize] = useState(false);

  const [bigCommercialDoc, setBigCommercialDoc] = useState(false);
  const [commercialDocName, setCommercialDocName] = useState("");
  const [commericalDocNotFound, setCommercialDocNotFound] = useState(false);
  const [bigTaxDoc, setBigTaxDoc] = useState(false);
  const [taxDocName, setTaxDocName] = useState("");
  const [taxDocNotFound, setTaxDocNotFound] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      axios
        .post(`add-vendors/edit/list/${itemToEdit.id}`)
        .then(({ data }) => setUsersList(data.data));
    }
  }, []);

  const uploadCommercialDoc = (e) => {
    const doc = e.target.files[0]?.size / 1000; //Convert Size from bytes to kilo bytes

    // Maximum Size for an Image is 2MB
    if (doc > 1000) {
      setBigCommercialDoc(true);
      setCommercialDocName("");
      updateFormData({
        ...formData,
        commercialDocs: "",
      });
      return;
    }

    setCommercialDocNotFound(false);
    setBigCommercialDoc(false);

    setCommercialDocName(e.target.files[0]?.name);
    updateFormData({
      ...formData,
      commercialDocs: e.target.files[0],
    });
  };

  const deleteCommercialDoc = () => {
    updateFormData({
      ...formData,
      commercialDocs: "",
    });
    setCommercialDocName("");
    commercialDocRef.current.value = "";
    // Empty the FileList of the input file, to be able to add the file again to avoid bad user experience
    // as we can't manipulate the FileList directly.
  };

  const uploadTaxDoc = (e) => {
    const doc = e.target.files[0]?.size / 1000; //Convert Size from bytes to kilo bytes

    // Maximum Size for an Image is 2MB
    if (doc > 1000) {
      setBigTaxDoc(true);
      setTaxDocName("");
      updateFormData({
        ...formData,
        taxCardDocs: "",
      });
      return;
    }

    setTaxDocNotFound(false);
    setBigTaxDoc(false);

    setTaxDocName(e.target.files[0]?.name);
    updateFormData({
      ...formData,
      taxCardDocs: e.target.files[0],
    });
  };

  const deleteTaxDoc = () => {
    updateFormData({
      ...formData,
      taxCardDocs: "",
    });
    setTaxDocName("");
    taxDocRef.current.value = "";
    // Empty the FileList of the input file, to be able to add the file again to avoid bad user experience
    // as we can't manipulate the FileList directly.
  };

  const handleSubmit = async () => {
    if (!formData.commercialDocs && !itemToEdit) {
      setCommercialDocNotFound(true);
      setIsSubmitting(false);
      return;
    }
    if (!formData.taxCardDocs && !itemToEdit) {
      setTaxDocNotFound(true);
      setIsSubmitting(false);
      return;
    }
    if (!formData.images && !itemToEdit) {
      setOpenAlert(true);
      setIsSubmitting(false);
    } else {
      let data = new FormData();
      data.append("vendor_name", formData.vendor_name);
      data.append("email", formData.email);
      data.append("type", formData.type);
      data.append("userid_id", formData.userid_id);
      data.append("commercial_no", formData.commercial_no);
      data.append("tax_card_no", formData.tax_card_no);
      data.append("bank_account", formData.bank_account);

      data.append("commercialDocs", formData.commercialDocs);
      data.append("taxCardDocs", formData.taxCardDocs);
      data.append("images", formData.images);

      setIsSubmitting(true);

      if (itemToEdit) {
        await axios
          .post(`/add-vendors/${itemToEdit.id}`, data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setOpenPopup(false);
          })
          .catch((res) => {
            setIsSubmitting(false);
            setResponseErrors(res.response.data.errors);
          });
      } else {
        await axios
          .post("/add-vendors", data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setPage(1);
            setOpenPopup(false);
          })
          .catch((res) => {
            setIsSubmitting(false);
            setResponseErrors(res.response.data.errors);
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

    setImgName(e.target.files[0]?.name);
    updateFormData({
      ...formData,
      images: e.target.files[0],
    });
    setOpenAlert(false);
  };

  const handleDeleteImage = () => {
    updateFormData({
      ...formData,
      images: "",
    });

    setImgName("");

    uploadRef.current.value = "";
    // Empty the FileList of the input file, to be able to add the file again to avoid bad user experience
    // as we can't manipulate the FileList directly.
  };

  //Customize
  const handleReset = () => {
    updateFormData({
      vendor_name: "",
      email: "",
      type: "",
      userid_id: "",
      bank_account: "",
      commercial_no: "",
      commercialDocs: "",
      tax_card_no: "",
      taxCardDocs: "",
      images: "",
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
            <Grid container spacing={4}>
              <Grid item xs={6} sm={8}>
                <TextField
                  name="vendor_name"
                  // variant="outlined"
                  required
                  fullWidth
                  id="vendor_name"
                  label="Vendor Name"
                  value={formData.vendor_name}
                  autoFocus
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.vendor_name ||
                    Boolean(touched.vendor_name && errors.vendor_name)
                  }
                  helperText={touched.vendor_name && errors.vendor_name}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.vendor_name?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={6} sm={4}>
                <FormControl>
                  {
                    <TextField
                      select
                      label="User"
                      value={formData.userid_id}
                      name="userid_id"
                      SelectProps={{
                        native: true,
                      }}
                      InputLabelProps={{ shrink: !!formData.userid_id }}
                      fullWidth
                      required
                      onChange={(e) => {
                        handleChange(e);
                        handleStateChange(e);
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.userid_id ||
                        Boolean(touched.userid_id && errors.userid_id)
                      }
                      helperText="Please select a User"
                    >
                      <option aria-label="None" value="" />

                      {Object.entries(usersList)?.map(([key, value]) => (
                        <option key={key} value={key.toString()}>
                          {value}
                        </option>
                      ))}
                    </TextField>
                  }
                </FormControl>
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.userid_id?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  // variant="outlined"
                  type="email"
                  required
                  value={formData.email}
                  fullWidth
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.email ||
                    Boolean(touched.email && errors.email)
                  }
                  helperText={touched.email && errors.email}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.email?.map((msg) => (
                    <div className={classes.errorsContainer}>
                      <span key={msg} className={classes.errorMsg}>
                        {msg}
                      </span>
                    </div>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <FormControl
                  component="fieldset"
                  error={
                    responseErrors?.type || Boolean(touched.type && errors.type)
                  }
                >
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup
                    aria-label="type"
                    name="type"
                    value={formData.type}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Vendor"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Wholesaler"
                    />
                    <FormControlLabel
                      value="3"
                      control={<Radio />}
                      label="Both"
                    />
                  </RadioGroup>
                  <FormHelperText>{touched.type && errors.type}</FormHelperText>
                </FormControl>
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.type?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Commerical Number *"
                  name="commercial_no"
                  // variant="outlined"
                  value={formData.commercial_no}
                  error={
                    Boolean(touched.commercial_no && errors.commercial_no) ||
                    responseErrors.commercial_no
                  }
                  helperText={
                    (touched.commercial_no && errors.commercial_no) ||
                    responseErrors.commercial_no
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
                />
              </Grid>

              <Grid item xs={6}></Grid>

              <Grid item xs={4}>
                <input
                  ref={commercialDocRef}
                  accept="application/pdf,image/*"
                  className={classes.uploadInput}
                  id="commercial-docs-btn"
                  type="file"
                  onChange={uploadCommercialDoc}
                />
                <label htmlFor="commercial-docs-btn">
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.uploadButton}
                    startIcon={<CloudUpload />}
                    component="span"
                  >
                    Commercial Document
                  </Button>
                </label>
              </Grid>

              {commercialDocName ? (
                <Grid item xs={8}>
                  <Chip
                    className={classes.chip}
                    // icon={<FaceIcon/>}
                    label={commercialDocName}
                    onDelete={deleteCommercialDoc}
                    variant="outlined"
                  />
                </Grid>
              ) : bigCommercialDoc ? (
                <Grid item xs={8}>
                  <span className={classes.error}>
                    Maximum size for the document is 1MB
                  </span>
                </Grid>
              ) : (
                <Grid item xs={8}></Grid>
              )}

              {commericalDocNotFound ? (
                <Grid item xs={12}>
                  <span className={classes.error}>
                    Please upload a commercial document
                  </span>
                </Grid>
              ) : null}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tax Card Number *"
                  name="tax_card_no"
                  // variant="outlined"
                  value={formData.tax_card_no}
                  error={
                    Boolean(touched.tax_card_no && errors.tax_card_no) ||
                    responseErrors.tax_card_no
                  }
                  helperText={
                    (touched.tax_card_no && errors.tax_card_no) ||
                    responseErrors.tax_card_no
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
                />
              </Grid>

              <Grid item xs={6}></Grid>

              <Grid item xs={4}>
                <input
                  ref={taxDocRef}
                  accept="application/pdf,image/*"
                  className={classes.uploadInput}
                  id="upload-tax-doc"
                  type="file"
                  onChange={uploadTaxDoc}
                />
                <label htmlFor="upload-tax-doc">
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.uploadButton}
                    startIcon={<CloudUpload />}
                    component="span"
                  >
                    Tax Document
                  </Button>
                </label>
              </Grid>

              {taxDocName ? (
                <Grid item xs={8}>
                  <Chip
                    className={classes.chip}
                    // icon={<FaceIcon/>}
                    label={taxDocName}
                    onDelete={deleteTaxDoc}
                    variant="outlined"
                  />
                </Grid>
              ) : bigTaxDoc ? (
                <Grid item xs={8}>
                  <span className={classes.error}>
                    Maximum size for the document is 1MB
                  </span>
                </Grid>
              ) : (
                <Grid item xs={8}></Grid>
              )}

              {taxDocNotFound ? (
                <Grid item xs={12}>
                  <span className={classes.error}>
                    Please upload a Tax document
                  </span>
                </Grid>
              ) : null}

              <Grid item xs={9}></Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="bank_account"
                  label="Bank Account Number"
                  // variant="outlined"
                  value={formData.bank_account}
                  error={
                    Boolean(touched.bank_account && errors.bank_account) ||
                    responseErrors.bank_account
                  }
                  helperText={
                    (touched.bank_account && errors.bank_account) ||
                    responseErrors.bank_account
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
                />
              </Grid>
              <Grid item md={6}></Grid>

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
                    startIcon={<PhotoCamera />}
                    component="span"
                  >
                    Logo
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
                  <span className={classes.errorMsg}>
                    The uploaded image size shouldn't exceed 2MB.
                  </span>
                </Grid>
              ) : null}

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.images?.map((msg) => (
                    <p key={msg} className={classes.errorMsg}>
                      {msg}
                    </p>
                  ))}
                </Grid>
              ) : null}

              {openAlert ? (
                <Grid item xs={12}>
                  <span className={classes.error}>Please upload an Image</span>
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

export default VendorsForm;
