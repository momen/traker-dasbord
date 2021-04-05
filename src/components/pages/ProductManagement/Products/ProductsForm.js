import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { PhotoCamera } from "@material-ui/icons";
import { CloseIcon } from "@material-ui/data-grid";
import { Alert, Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
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

  inputMessage: {
    wordBreak: "break-word",
  },
  chip: {
    margin: theme.spacing(0.5),
    maxWidth: "100%",
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("This field is Required"),
  description: Yup.string()
    .min(5, "Description must be at least 5 characters")
    .max(255, "Description must not exceed 255 characters")
    .required("This field is Required"),
  car_made_id: Yup.string().required(),
  car_model_id: Yup.string().required(),
  year_id: Yup.string().required(),
  discount: Yup.number()
    .min(5, "Minimum value for discount is 5%")
    .max(80, "Maximum value for discount is 80%"),
  price: Yup.number()
    .min(1, "Enter a value greater than 0")
    .required("This field is Required"),
  part_category_id: Yup.string().required(),
  store_id: Yup.string().required(),
  quantity: Yup.number()
    .min(5, "Minimum value should be 5")
    .required("This field is Required"),
  serial_number: Yup.string().required("This field is Required"),
});

function ProductsForm({
  setPage,
  setOpenPopup,
  itemToEdit,
  stores,
  categories,
  carMades,
  carModels,
  partCategories,
  carYears,
  productTags,
}) {
  const classes = useStyles();

  const uploadRef = useRef();
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    description: itemToEdit ? itemToEdit.description : "",
    car_made_id: itemToEdit ? itemToEdit.car_made_id : "",
    car_model_id: itemToEdit ? itemToEdit.car_model_id : "",
    year_id: itemToEdit ? itemToEdit.year_id : "",
    discount:
      itemToEdit?.discount && itemToEdit?.discount > 0
        ? itemToEdit.discount
        : "",
    price: itemToEdit ? itemToEdit.price : "",
    part_category_id: itemToEdit ? itemToEdit.part_category_id : "",
    categories: itemToEdit
      ? itemToEdit.categories.map(({ id, name }) => ({ id, name }))
      : [],
    tags: itemToEdit
      ? itemToEdit.tags.map(({ id, name }) => ({ id, name }))
      : [],
    store_id: itemToEdit ? itemToEdit.store_id : "",
    quantity: itemToEdit ? itemToEdit.quantity : "",
    serial_number: itemToEdit ? itemToEdit.serial_number : "",
    photo: [],
  });

  const [imagesToDelete, setImagesToDelete] = useState("");

  const [productImages, setProductImages] = useState(() =>
    itemToEdit
      ? itemToEdit.photo.map(({ id, file_name }) => ({ id, file_name }))
      : null
  );

  const [openAlert, setOpenAlert] = useState(false);
  const [autoSelectCategoryError, setAutoSelectCategoryError] = useState(false);
  const [autoSelectTagError, setAutoSelectTagError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Update on other components
  const [responseErrors, setResponseErrors] = useState("");
  const [bigImgSize, setBigImgSize] = useState(false);

  const handleSubmit = async () => {
    if (formData.categories.length === 0) {
      setAutoSelectCategoryError(true);
      return;
    }
    if (formData.tags.length === 0) {
      setAutoSelectTagError(true);
      return;
    }
    setAutoSelectCategoryError(false);
    setAutoSelectTagError(false);

    setIsSubmitting(true); // Update on other components
    let data = new FormData();

    if (!formData.photo && !itemToEdit) {
      setOpenAlert(true);
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo") return;
        if (key === "categories") {
          data.append(key, JSON.stringify(value.map((val) => val.id)));
        } else if (key === "tags") {
          data.append(key, JSON.stringify(value.map((val) => val.id)));
        } else if (key === "discount" && !value) {
          data.append(key, 0);
        } else {
          data.append(key, value);
        }
      });

      formData.photo.forEach((file) => {
        data.append("photo[]", file, file.name);
      });

      JSON.stringify(data);

      // formData.categories = formData.categories.map(category => category.id)
      // formData.tags = formData.tags.map(tag => tag.id)
      // formData.photo= formData.photo.map(async (img) => await toBase64(img));

      if (itemToEdit) {
        await axios
          .post(`/products/${itemToEdit.id}`, data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            if (imagesToDelete) {
              axios
                .post(`/products/remove/checked/media`, {
                  product_id: itemToEdit.id,
                  media_ids: JSON.stringify(imagesToDelete),
                })
                .then((res) => {
                  setOpenPopup(false);
                })
                .catch((res) => {
                  setResponseErrors(res.response.data.errors);
                });
            } else {
              setOpenPopup(false);
            }
          })
          .catch((res) => {
            setIsSubmitting(false); // Update on other components
            setResponseErrors(res.response.data.errors);
          });
      } else {
        await axios
          .post("/add/products", data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setPage(1);
            setOpenPopup(false);
          })
          .catch((res) => {
            setIsSubmitting(false); // Update on other components
            setResponseErrors(res.response.data.errors);
          });
      }
    }
  };

  // Update Function Name on other components
  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateAutoCompleteCategories = (e, val) => {
    if (autoSelectCategoryError) {
      setAutoSelectCategoryError(false);
    }
    updateFormData({
      ...formData,
      categories: val.length > 0 ? val : [],
    });
  };

  const updateAutoCompleteTags = (e, val) => {
    if (autoSelectTagError) {
      setAutoSelectTagError(false);
    }
    const tags = val.length > 0 ? val : [];
    updateFormData({
      ...formData,
      tags: tags,
    });
  };

  const handleUpload = (e) => {
    let filesList = []; //The arrary of new file to be added to the state

    //Loop on all files saved in the File Input, find if the image was already added to the state
    // & append only the new images to avoid duplication.
    Object.entries(e.target.files).forEach(([key, file]) => {
      if (!formData.photo.find((img) => img.name === file.name)) {
        if (file.size / 1000 > 2000) {
          setBigImgSize(true);
          return;
        }
        filesList.push(file);
      }
    });

    setBigImgSize(false);

    updateFormData({
      ...formData,
      photo: [...formData.photo, ...filesList],
    });
    setOpenAlert(false);
  };

  //The name of selected image to delete is passed so we can update the state with the filtered remaining ones
  const handleDeleteImage = (imgToDelete) => {
    setBigImgSize(false);
    updateFormData({
      ...formData,
      photo: formData.photo.filter((img) => img.name !== imgToDelete),
    });

    uploadRef.current.value = "";
    // Empty the FileList of the input file, to be able to add the file again to avoid bad user experience
    // as we can't manipulate the FileList directly.
  };

  const ToggleExistingImage = ({ id, file_name, deleted }) => {
    if (deleted) {
      setImagesToDelete(imagesToDelete.filter((img_id) => img_id !== id));
    } else {
      setImagesToDelete([...imagesToDelete, id]);
    }
    setProductImages(
      productImages.map((img) =>
        img.file_name === file_name ? { ...img, deleted: !img.deleted } : img
      )
    );
    setBigImgSize(false);
  };

  const handleReset = () => {
    updateFormData({
      name: "",
      description: "",
      car_made_id: "",
      car_model_id: "",
      year_id: "",
      discount: "",
      price: "",
      part_category_id: "",
      categories: [],
      tags: [],
      store_id: "",
      quantity: "",
      serial_number: "",
      photo: [],
    });
    setResponseErrors("");
    setOpenAlert(false);
    setBigImgSize(false);
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
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Product Name"
                    value={values.name}
                    autoFocus
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
                    name="serial_number"
                    required
                    fullWidth
                    id="serial_number"
                    label="Serial Number"
                    value={formData.serial_number}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.serial_number ||
                      Boolean(touched.serial_number && errors.serial_number)
                    }
                    helperText={touched.serial_number && errors.serial_number}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.serial_number?.map((msg) => (
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
                  <TextField
                    name="quantity"
                    type="number"
                    InputProps={{ inputProps: { min: 5 } }}
                    required
                    fullWidth
                    label="Qunatity"
                    value={formData.quantity}
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.quantity ||
                      Boolean(touched.quantity && errors.quantity)
                    }
                    helperText={touched.quantity && errors.quantity}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.quantity?.map((msg) => (
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
                    allowNegative={false}
                    customInput={TextField}
                    thousandSeparator={true}
                    required
                    fullWidth
                    name="price"
                    label="Price"
                    value={formData.price}
                    onValueChange={({ floatValue }) =>
                      updateFormData({ ...formData, price: floatValue })
                    }
                    onChange={(event, value) => {
                      // console.log(event.target.value);
                      // updateFormData({ ...formData, price: value });
                      handleChange(event);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.price ||
                      Boolean(touched.price && errors.price)
                    }
                    helperText={touched.price && errors.price}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.price?.map((msg) => (
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
                    customInput={TextField}
                    name="discount"
                    fullWidth
                    label="Discount"
                    // prefix="%"
                    value={formData.discount}
                    onChange={(e) => {
                      updateFormData({
                        ...formData,
                        discount: e.target.value
                          ? parseFloat(e.target.value)
                          : "",
                      });
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.discount ||
                      Boolean(touched.discount && errors.discount)
                    }
                    helperText={
                      (touched.discount && errors.discount) ||
                      "Min 5% & Max 80%"
                    }
                    InputProps={{ inputProps: { min: 5 } }}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.discount?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={4} sm={3}>
                <div>
                  <TextField
                    select
                    label="Car Made"
                    value={formData.car_made_id}
                    name="car_made_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.car_made_id ||
                      Boolean(touched.car_made_id && errors.car_made_id)
                    }
                    helperText="Please select a Car Made"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {carMades?.map((carMade) => (
                      <option value={carMade.id}>{carMade.car_made}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.car_made_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={4} sm={3}>
                <div>
                  <TextField
                    select
                    label="Car Model"
                    value={formData.car_model_id}
                    name="car_model_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.car_model_id ||
                      Boolean(touched.car_model_id && errors.car_model_id)
                    }
                    helperText="Please select a Car Model"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {carModels?.map((carModel) => (
                      <option value={carModel.id}>{carModel.carmodel}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.car_model_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={4} sm={3}>
                <div>
                  <TextField
                    select
                    label="Part Category"
                    value={formData.part_category_id}
                    name="part_category_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.part_category_id ||
                      Boolean(
                        touched.part_category_id && errors.part_category_id
                      )
                    }
                    helperText="Please select a Part Category"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {partCategories?.map((partCategory) => (
                      <option value={partCategory.id}>
                        {partCategory.category_name}
                      </option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.part_category_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={2}>
                <div>
                  <TextField
                    select
                    label="Year"
                    value={formData.year_id}
                    name="year_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.year_id ||
                      Boolean(touched.year_id && errors.year_id)
                    }
                    helperText="Please select a Year"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {carYears?.map((carYear) => (
                      <option value={carYear.id}>{carYear.year}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.year_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>
              {/****************************** ******************************/}
              <Grid item xs={6} sm={8}>
                <div>
                  <Autocomplete
                    multiple
                    // filterSelectedOptions
                    options={categories ? categories : []}
                    value={formData.categories}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </React.Fragment>
                    )}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="categories"
                        variant="outlined"
                        label="Categories *"
                        placeholder="Select related Categories for this Product"
                        fullWidth
                        error={
                          responseErrors?.categories || autoSelectCategoryError
                        }
                        helperText="At least one category must be selected."
                      />
                    )}
                    onBlur={() => {
                      if (formData.categories.length === 0) {
                        setAutoSelectCategoryError(true);
                      }
                    }}
                    onChange={(e, val) => {
                      updateAutoCompleteCategories(e, val);
                      if (val.length === 0) {
                        setAutoSelectCategoryError(true);
                      } else {
                        setAutoSelectCategoryError(false);
                      }
                    }}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.categories?.map((msg) => (
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
                  <TextField
                    select
                    label="Store"
                    value={formData.store_id}
                    name="store_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.store_id ||
                      Boolean(touched.store_id && errors.store_id)
                    }
                    helperText="Please select a Store"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {stores?.map((store) => (
                      <option value={store.id}>{store.name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.store_id?.map((msg) => (
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
                  <Autocomplete
                    multiple
                    // filterSelectedOptions
                    options={productTags ? productTags : []}
                    value={formData.tags}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </React.Fragment>
                    )}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="tags"
                        variant="outlined"
                        label="Tags *"
                        placeholder="Select related Tags for this Product"
                        fullWidth
                        error={responseErrors?.tags || autoSelectTagError}
                        helperText="At least one tag must be selected."
                      />
                    )}
                    onBlur={() => {
                      if (formData.tags.length === 0) {
                        setAutoSelectTagError(true);
                      }
                    }}
                    onChange={(e, val) => {
                      updateAutoCompleteTags(e, val);
                      if (val.length === 0) {
                        setAutoSelectTagError(true);
                      } else {
                        setAutoSelectTagError(false);
                      }
                    }}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.tags?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12}>
                <div style={{ minWidth: "100%", maxWidth: "100%" }}>
                  <TextField
                    name="description"
                    required
                    label="Description"
                    multiline
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

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.description?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12} lg={2}>
                <input
                  ref={uploadRef}
                  accept="image/*"
                  className={classes.uploadInput}
                  id="icon-button-file"
                  type="file"
                  onChange={handleUpload}
                  multiple
                />
                <label htmlFor="icon-button-file">
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.uploadButton}
                    startIcon={<PhotoCamera />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </Grid>

              <Grid item xs>
                {productImages?.map((img) => {
                  // console.log(imagesToDelete);
                  return (
                    <Chip
                      className={classes.chip}
                      // icon={<FaceIcon/>}
                      label={img.file_name}
                      onDelete={() => ToggleExistingImage(img)}
                      variant="outlined"
                      color={img.deleted ? "secondary" : "primary"}
                    />
                  );
                })}
                {formData.photo?.map((img) => (
                  <Chip
                    className={classes.chip}
                    // icon={<FaceIcon/>}
                    label={img.name}
                    onDelete={() => handleDeleteImage(img.name)}
                    variant="outlined"
                  />
                ))}
              </Grid>

              {bigImgSize ? (
                <Grid item xs={12}>
                  <p className={classes.errorMsg}>
                    Size has exceeded 2MB for one Image or more & have been
                    excluded.
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
                      Please upload at least one Image.
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
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting} // Update on other components
              >
                Submit
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                disabled={isSubmitting} // Update on other components
                onClick={() => {
                  handleReset();
                  resetForm();
                  errors.categories = false;
                  touched.categories = false;
                  errors.tags = false;
                  touched.tags = false;
                }} // Apply to other forms -For refactoring all forms-
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

export default ProductsForm;
