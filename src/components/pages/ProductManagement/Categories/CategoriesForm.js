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
import axios from "../../../../axios";
import { PhotoCamera, RotateLeft } from "@material-ui/icons";
import { CloseIcon } from "@material-ui/data-grid";
import { Alert } from "@material-ui/lab";
import * as Yup from "yup";
import { Formik } from "formik";
import SuccessPopup from "../../../SuccessPopup";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // width: "40vw",
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
  uploadButton: {
    margin: theme.spacing(3, 2, 2),
  },
  chip: {
    margin: theme.spacing(3, 2, 2),
    maxWidth: "100%",
  },
  productImages: {
    height: "60px",
    marginRight: "20px",
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
  name_en: Yup.string()
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
  maincategory_id: Yup.string().required(),
  description: Yup.string()
    .notRequired()
    .test(
      "Minimum 5 chars without spaces",
      "Please enter 5 characters excluding spaces",
      (val) => (val ? val?.trim().length >= 5 : true)
    )
    .test("Not empty", "Please remove any spaces at the beginning", (val) =>
      val ? val?.trim() !== "" : true
    )
    .min(5, "Description must be at least 5 characters")
    .max(255, "Description must not exceed 255 characters"),
  description_en: Yup.string()
    .notRequired()
    .test(
      "Minimum 5 chars without spaces",
      "Please enter 5 characters excluding spaces",
      (val) => (val ? val?.trim().length >= 5 : true)
    )
    .test("Not empty", "Please remove any spaces at the beginning", (val) =>
      val ? val?.trim() !== "" : true
    )
    .min(5, "Description must be at least 5 characters")
    .max(255, "Description must not exceed 255 characters"),
});

function CategoriesForm({
  setPage,
  setOpenPopup,
  itemToEdit,
  mainCategories,
  setViewMode,
  setPageHeader,
}) {
  const classes = useStyles();
  const { lang } = useSelector((state) => state);

  const formRef = useRef();
  const uploadRef = useRef();

  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    name_en: itemToEdit ? itemToEdit.name_en : "",
    maincategory_id: itemToEdit ? itemToEdit.maincategory_id : "",
    // description: itemToEdit ? itemToEdit.description : "",
    // description_en: itemToEdit ? itemToEdit.description_en : "",
    photo: "",
  });
  const [imgName, setImgName] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");
  const [bigImgSize, setBigImgSize] = useState(false);

  const [imageDeletedOnEdit, setImageDeletedOnEdit] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState(
    itemToEdit
      ? "Category updated successfully."
      : "New category added successfully."
  );

  const closeDialog = () => {
    setDialogOpen(false);
    setViewMode("data-grid");
    setPageHeader("Categories");
  };

  const handleSubmit = async () => {
    // if (!formData.photo && !itemToEdit) {
    //   setOpenAlert(true);
    // } else {
    let data = new FormData();
    data.append("name", formData.name);
    data.append("name_en", formData.name_en);
    data.append("maincategory_id", formData.maincategory_id);

    if (formData.description) {
      data.append("description", formData.description);
    }
    if (formData.description_en) {
      data.append("description", formData.description_en);
    }
    if (formData.photo && !imageDeletedOnEdit) {
      data.append("photo", formData.photo, formData.photo.name);
    } else {
      data.append("photo", "");
    }

    setIsSubmitting(true);

    if (itemToEdit) {
      await axios
        .post(`/product-categories/${itemToEdit.id}`, data, {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((res) => {
          setDialogOpen(true);
        })
        .catch((res) => {
          setIsSubmitting(false);
          setResponseErrors(res.response.data.errors);
        });
    } else {
      await axios
        .post("/product-categories", data, {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((res) => {
          setPage(1);
          setDialogOpen(true);
        })
        .catch((res) => {
          setIsSubmitting(false);
          setResponseErrors(res.response.data.errors);
        });
    }
    // }
  };

  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = (e) => {
    const imgSize = e.target.files[0]?.size / 1000; //Convert Size from bytes to kilo bytes

    setBigImgSize(false);

    // Maximum Size for an Image is 2MB
    if (imgSize > 512) {
      setBigImgSize(true);
      return;
    }

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
      name: "",
      maincategory_id: "",
      description: "",
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
                  variant="outlined"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Category Name (Arabic)"
                  value={formData.name}
                  autoFocus
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.name || Boolean(touched.name && errors.name)
                  }
                  helperText={touched.name && errors.name}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.name?.map((msg) => (
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
                  label="Category Name (English)"
                  // prefix="%"
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
              {responseErrors ? (
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
                <div>
                  <TextField
                    variant="outlined"
                    select
                    label="Main Category"
                    value={formData.maincategory_id}
                    name="maincategory_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.maincategory_id ||
                      Boolean(touched.maincategory_id && errors.maincategory_id)
                    }
                    helperText="Please select a Main Category"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {mainCategories?.map((category) => (
                      <option value={category.id}>
                        {lang === "ar"
                          ? category.main_category_name || category.name_en
                          : category.name_en || category.main_category_name}
                      </option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.maincategory_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={8}></Grid>

              {/* <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  variant="outlined"
                  id="description"
                  name="description"
                  label="Description (Arabic)"
                  multiline
                  rows={4}
                  rowsMax={8}
                  value={formData.description}
                  fullWidth
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.description ||
                    Boolean(touched.description && errors.description)
                  }
                  helperText={touched.description && errors.description}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.description?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  variant="outlined"
                  id="description_en"
                  name="description_en"
                  label="Description (English)"
                  multiline
                  rows={4}
                  rowsMax={8}
                  value={formData.description_en}
                  fullWidth
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.description_en ||
                    Boolean(touched.description_en && errors.description_en)
                  }
                  helperText={touched.description_en && errors.description_en}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.description_en?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null} */}

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

              <Grid item xs md={9}>
                {itemToEdit && !imageDeletedOnEdit && !imgName ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Chip
                      className={classes.chip}
                      label={itemToEdit.photo.file_name}
                      onDelete={() => setImageDeletedOnEdit(true)}
                      variant="outlined"
                      color="primary"
                    />
                    <img
                      src={itemToEdit.photo.image}
                      alt={`cat-img`}
                      className={classes.productImages}
                    />
                  </div>
                ) : imgName ? (
                  <Chip
                    className={classes.chip}
                    label={imgName}
                    onDelete={handleDeleteImage}
                    variant="outlined"
                    color="primary"
                  />
                ) : null}
              </Grid>

              {bigImgSize ? (
                <Grid item xs={12}>
                  <p className={classes.errorMsg}>
                    The uploaded image size shouldn't exceed 512 KB.
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
            <Grid container justify="center">
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

export default CategoriesForm;
