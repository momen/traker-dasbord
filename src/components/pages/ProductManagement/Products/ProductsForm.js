import React, { useEffect, useRef, useState } from "react";
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

function ProductsForm({
  setPage,
  setOpenPopup,
  itemToEdit,
  stores,
  categories,
  carMades,
  carYears,
  productTags,
  manufacturers,
  originCountries,
  carTypes,
  productTypes,
}) {
  const classes = useStyles();
  const uploadRef = useRef();

  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    description: itemToEdit ? itemToEdit.description : "",
    car_made_id: itemToEdit ? itemToEdit.car_made_id : "",
    models: itemToEdit
      ? itemToEdit.models.map(({ id, carmodel }) => ({ id, carmodel }))
      : [],
    year_from: itemToEdit ? itemToEdit.year_from : "",
    year_to: itemToEdit ? itemToEdit.year_to : "",
    discount:
      itemToEdit?.discount && itemToEdit?.discount > 0
        ? itemToEdit.discount
        : "",
    maincategory_id: itemToEdit ? itemToEdit.maincategory_id : "",
    category_id: itemToEdit ? itemToEdit.category_id : "",
    price: itemToEdit ? itemToEdit.price : "",
    holesale_price: itemToEdit ? itemToEdit.holesale_price : "",
    no_of_orders: itemToEdit ? itemToEdit.no_of_orders : "",
    part_category_id: itemToEdit ? itemToEdit.part_category_id.toString() : "",
    manufacturer_id: itemToEdit ? itemToEdit.manufacturer_id : "",
    prodcountry_id: itemToEdit ? itemToEdit.prodcountry_id : "",
    transmission_id: itemToEdit ? itemToEdit.transmission_id : "",
    cartype_id: itemToEdit ? itemToEdit.cartype_id : "",
    tags: itemToEdit
      ? itemToEdit.tags.map(({ id, name }) => ({ id, name }))
      : [],
    store_id: itemToEdit ? itemToEdit.store_id : "",
    quantity: itemToEdit ? itemToEdit.quantity : "",
    serial_number: itemToEdit ? itemToEdit.serial_number : "",
    producttype_id: itemToEdit ? itemToEdit.producttype_id : "",
    photo: [],
  });

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
    serial_number: Yup.string()
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
    producttype_id: Yup.string().required(),
    holesale_price:
      formData.producttype_id.toString() === "2" ||
      formData.producttype_id.toString() === "3"
        ? Yup.number()
            .min(1, "Enter a value greater than 0")
            .required("This field is Required")
        : Yup.string().nullable().notRequired(),
    no_of_orders:
      formData.producttype_id.toString() === "2" ||
      formData.producttype_id.toString() === "3"
        ? Yup.number()
            .min(1, "Minimum value should be 1")
            .required("This field is Required")
        : Yup.string().nullable().notRequired(),
    car_made_id: Yup.string().required(),
    year_from: Yup.string().required(),
    year_to: Yup.string().required(),
    discount: Yup.number()
      .min(5, "Minimum value for discount is 5%")
      .max(80, "Maximum value for discount is 80%"),
    price:
      formData.producttype_id.toString() === "1" ||
      formData.producttype_id.toString() === "3"
        ? Yup.number()
            .required("This field is Required")
            .min(1, "Enter a value greater than 0")
        : Yup.string().nullable().notRequired(),
    maincategory_id: Yup.string().required(),
    category_id: Yup.string().required(),
    part_category_id: Yup.string().required(),
    manufacturer_id: Yup.string().required(),
    prodcountry_id: Yup.string().required(),
    transmission_id: Yup.string().required(),
    cartype_id: Yup.string().required(),
    store_id: Yup.string().required(),
    quantity: Yup.number()
      .min(5, "Minimum value should be 5")
      .required("This field is Required"),
    description: Yup.string()
      .required("This field is Required")
      .test(
        "Minimum 5 chars without spaces",
        "Please enter 5 characters excluding spaces",
        (val) => val?.trim().length >= 5
      )
      .test(
        "Not empty",
        "Please remove any spaces at the beginning",
        (val) => val?.trim() !== ""
      )
      .min(5, "Description must be at least 5 characters")
      .max(255, "Description must not exceed 255 characters"),
  });

  const [carModels, setCarModels] = useState(null);
  const [partCategories, setPartCategories] = useState(null);
  const [toYears, setToYears] = useState([]);

  const [imagesToDelete, setImagesToDelete] = useState("");

  const [productImages, setProductImages] = useState(() =>
    itemToEdit
      ? itemToEdit.photo.map(({ id, file_name }) => ({ id, file_name }))
      : null
  );

  const [openAlert, setOpenAlert] = useState(false);
  const [autoSelectModelError, setAutoSelectModelError] = useState(false);
  const [autoSelectTagError, setAutoSelectTagError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Update on other components
  const [responseErrors, setResponseErrors] = useState("");
  const [bigImgSize, setBigImgSize] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      axios
        .get(`/car-modelslist/${itemToEdit.car_made_id}`)
        .then((res) => {
          const _carModels = res.data.data.map(({ id, carmodel }) => ({
            id,
            carmodel,
          })); // Customize
          setCarModels(_carModels);
        })
        .catch(() => {
          alert("Failed to Fetch Brands List");
        });

      axios
        .get(`/part-categorieslist/${itemToEdit.category_id}`)
        .then((res) => {
          const _partCategories = res.data.data.map(
            ({ id, category_name }) => ({
              id,
              category_name,
            })
          ); // Customize
          setPartCategories(_partCategories);
        })
        .catch(() => {
          alert("Failed to Fetch Part Categories List");
        });
    }
  }, []);

  const handleSubmit = async () => {
    if (formData.tags.length === 0) {
      setAutoSelectTagError(true);
      return;
    }
    setAutoSelectTagError(false);

    setIsSubmitting(true); // Update on other components
    let data = new FormData();

    if (formData.photo.length === 0 && !itemToEdit) {
      setOpenAlert(true);
      setIsSubmitting(false);
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo") return;
        if (key === "tags") {
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
    const updatedData = formData;
    if (e.target.name === "producttype_id" && e.target.value == "1") {
      delete updatedData.holesale_price;
      delete updatedData.no_of_orders;
    } else if (e.target.name === "producttype_id" && e.target.value == "2") {
      delete updatedData.price;
    }
    updateFormData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const updateAutoCompleteModels = (e, val) => {
    if (autoSelectModelError) {
      setAutoSelectModelError(false);
    }
    const models = val.length > 0 ? val : [];
    updateFormData({
      ...formData,
      models: models,
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
      models: [],
      year_from: "",
      year_to: "",
      discount: "",
      price: "",
      maincategory_id: "",
      category_id: [],
      part_category_id: "",
      manufacturer_id: "",
      prodcountry_id: "",
      transmission_id: "",
      cartype_id: "",
      tags: [],
      store_id: "",
      quantity: "",
      qty_reminder: "",
      serial_number: "",
      producttype_id: "",
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
              <Grid item xs={6} sm={4}>
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

              <Grid item xs={6} sm={4}>
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

              <Grid item xs={6} sm={4}>
                <div>
                  <TextField
                    select
                    label="Product Type"
                    value={formData.producttype_id}
                    name="producttype_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.producttype_id ||
                      Boolean(touched.producttype_id && errors.producttype_id)
                    }
                    helperText="Please select a Product Type"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {productTypes?.map((type) => (
                      <option value={type.id}>{type.producttype}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.producttype_id?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12}></Grid>

              {formData.producttype_id.toString() === "2" ||
              formData.producttype_id.toString() === "3" ? (
                <>
                  <Grid item xs={6} md={3}>
                    <div>
                      <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        thousandSeparator={true}
                        required
                        fullWidth
                        name="holesale_price"
                        label="Wholesale Price"
                        value={
                          formData.holesale_price || itemToEdit?.holesale_price
                        }
                        onValueChange={({ floatValue }) => {
                          updateFormData({
                            ...formData,
                            holesale_price: Math.round(floatValue),
                          });
                          values.holesale_price = Math.round(floatValue);
                          if (floatValue > 0) {
                            errors.holesale_price = false;
                          } else if (floatValue === 0) {
                            errors.holesale_price =
                              "Enter a value greater than 0";
                          } else {
                            errors.holesale_price = "This field is Required";
                          }
                        }}
                        onBlur={handleBlur}
                        error={
                          responseErrors?.holesale_price ||
                          Boolean(
                            touched.holesale_price && errors.holesale_price
                          )
                        }
                        helperText={
                          touched.holesale_price && errors.holesale_price
                        }
                      />

                      {responseErrors ? (
                        <div className={classes.inputMessage}>
                          {responseErrors.holesale_price?.map((msg) => (
                            <span key={msg} className={classes.errorMsg}>
                              {msg}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Grid>

                  <Grid item xs={6} md={3} lg={2}>
                    <div>
                      <NumberFormat
                        allowNegative={false}
                        customInput={TextField}
                        thousandSeparator={true}
                        name="no_of_orders"
                        required
                        fullWidth
                        label="Number of orders"
                        value={formData.no_of_orders || itemToEdit.no_of_orders}
                        onValueChange={({ floatValue }) => {
                          updateFormData({
                            ...formData,
                            no_of_orders: floatValue,
                          });
                          values.no_of_orders = floatValue;
                          if (floatValue >= 5) {
                            errors.no_of_orders = false;
                          } else if (floatValue) {
                            errors.no_of_orders = "Minimum value should be 1";
                          } else {
                            errors.no_of_orders = "This field is Required";
                          }
                        }}
                        onBlur={handleBlur}
                        error={
                          responseErrors?.no_of_orders ||
                          Boolean(touched.no_of_orders && errors.no_of_orders)
                        }
                        helperText={touched.no_of_orders && errors.no_of_orders}
                      />

                      {responseErrors ? (
                        <div className={classes.inputMessage}>
                          {responseErrors.no_of_orders?.map((msg) => (
                            <span key={msg} className={classes.errorMsg}>
                              {msg}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Grid>
                </>
              ) : null}

              {formData.producttype_id.toString() === "1" ||
              formData.producttype_id.toString() === "3" ? (
                <Grid item xs={6} md={3}>
                  <div>
                    <NumberFormat
                      allowNegative={false}
                      customInput={TextField}
                      thousandSeparator={true}
                      required
                      fullWidth
                      name="price"
                      label="Price"
                      value={formData.price || itemToEdit.price}
                      onValueChange={({ floatValue }) => {
                        updateFormData({ ...formData, price: floatValue });
                        values.price = floatValue;
                        if (floatValue > 0) {
                          errors.price = false;
                        } else if (floatValue === 0) {
                          errors.price = "Enter a value greater than 0";
                        } else {
                          errors.price = "This field is Required";
                        }
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
              ) : null}

              {formData.producttype_id ? (
                <Grid item xs={4} md={2}>
                  <div>
                    <NumberFormat
                      allowNegative={false}
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
              ) : null}

              <Grid item xs={12}></Grid>

              <Grid item xs={4} md={3}>
                <div>
                  <NumberFormat
                    allowNegative={false}
                    customInput={TextField}
                    thousandSeparator={true}
                    name="quantity"
                    required
                    fullWidth
                    label="Qunatity"
                    value={formData.quantity}
                    onValueChange={({ floatValue }) => {
                      updateFormData({
                        ...formData,
                        quantity: Math.round(floatValue),
                      });
                      values.quantity = Math.round(floatValue);
                      if (floatValue >= 5) {
                        errors.quantity = false;
                      } else if (floatValue) {
                        errors.quantity = "Minimum value should be 5";
                      } else {
                        errors.quantity = "This field is Required";
                      }
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

              <Grid item xs={4} md={3}>
                <div>
                  <NumberFormat
                    allowNegative={false}
                    customInput={TextField}
                    thousandSeparator={true}
                    name="qty_reminder"
                    required
                    fullWidth
                    label="Reminder Quantity"
                    value={formData.qty_reminder}
                    onValueChange={({ floatValue }) => {
                      updateFormData({
                        ...formData,
                        qty_reminder: Math.round(floatValue),
                      });
                      values.qty_reminder = Math.round(floatValue);
                      if (floatValue >= 5) {
                        errors.qty_reminder = false;
                      } else if (floatValue) {
                        errors.qty_reminder = "Minimum value should be 5";
                      } else {
                        errors.qty_reminder = "This field is Required";
                      }
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.qty_reminder ||
                      Boolean(touched.qty_reminder && errors.qty_reminder)
                    }
                    helperText={touched.qty_reminder && errors.qty_reminder}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.qty_reminder?.map((msg) => (
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
                  <TextField
                    select
                    label="Category"
                    value={formData.category_id}
                    name="category_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                      if (e.target.value) {
                        axios
                          .get(`/part-categorieslist/${e.target.value}`)
                          .then((res) => {
                            const _partCategories = res.data.data.map(
                              ({ id, category_name }) => ({
                                id,
                                category_name,
                              })
                            ); // Customize
                            setPartCategories(_partCategories);
                          })
                          .catch(() => {
                            alert("Failed to Fetch Part Categories List");
                          });
                      } else {
                        setPartCategories(null);
                      }
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.category_id ||
                      Boolean(touched.category_id && errors.category_id)
                    }
                    helperText="Please select a Category"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {categories?.map((category) => (
                      <option value={category.id}>{category.name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.category_id?.map((msg) => (
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
                  <TextField
                    disabled={!partCategories}
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
                    InputLabelProps={{ shrink: !!formData.part_category_id }}
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

              <Grid item xs={6} md={3}>
                <div>
                  <TextField
                    select
                    label="Brand"
                    value={formData.car_made_id}
                    name="car_made_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                      if (e.target.value) {
                        axios
                          .get(`/car-modelslist/${e.target.value}`)
                          .then((res) => {
                            const _carModels = res.data.data.map(
                              ({ id, carmodel }) => ({
                                id,
                                carmodel,
                              })
                            ); // Customize
                            setCarModels(_carModels);
                            console.log(_carModels);
                          })
                          .catch(() => {
                            alert("Failed to Fetch Brands List");
                          });
                      } else {
                        setCarModels(null);
                      }
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.car_made_id ||
                      Boolean(touched.car_made_id && errors.car_made_id)
                    }
                    helperText="Please select a Brand"
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

              <Grid item xs={9}>
                <div>
                  <Autocomplete
                    disabled={!formData.car_made_id}
                    multiple
                    // filterSelectedOptions
                    options={carModels ? carModels : []}
                    value={formData.models}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.carmodel}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.carmodel}
                      </React.Fragment>
                    )}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="models"
                        variant="outlined"
                        label="Models *"
                        placeholder="Select related Models for the selected Brand"
                        fullWidth
                        error={responseErrors?.models || autoSelectModelError}
                        helperText="At least one model must be selected."
                      />
                    )}
                    onBlur={() => {
                      if (formData.models.length === 0) {
                        setAutoSelectModelError(true);
                      }
                    }}
                    onChange={(e, val) => {
                      updateAutoCompleteModels(e, val);
                      if (val.length === 0) {
                        setAutoSelectModelError(true);
                      } else {
                        setAutoSelectModelError(false);
                      }
                    }}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.models?.map((msg) => (
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
                  <TextField
                    select
                    label="From Year"
                    value={formData.year_from}
                    name="year_from"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                      setToYears(
                        carYears.filter(
                          (year) => parseInt(year) >= parseInt(e.target.value)
                        )
                      );
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.year_from ||
                      Boolean(touched.year_from && errors.year_from)
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
                      {responseErrors.year_from?.map((msg) => (
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
                  <TextField
                    disabled={!formData.year_from}
                    select
                    label="To Year"
                    value={formData.year_to}
                    name="year_to"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.year_to ||
                      Boolean(touched.year_to && errors.year_to)
                    }
                    helperText="Please select a Year"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {toYears.map((carYear) => (
                      <option value={carYear.id}>{carYear.year}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.year_to?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              {/****************************** ******************************/}

              <Grid item xs={6} md={3}>
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

              <Grid item xs={6} md={3}>
                <div>
                  <TextField
                    select
                    label="Manufacturer"
                    value={formData.manufacturer_id}
                    name="manufacturer_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.manufacturer_id ||
                      Boolean(touched.manufacturer_id && errors.manufacturer_id)
                    }
                    helperText="Please select a Manufacturer"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {manufacturers?.map((manufacturer) => (
                      <option value={manufacturer.id}>
                        {manufacturer.manufacturer_name}
                      </option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.manufacturer_id?.map((msg) => (
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
                  <TextField
                    select
                    label="Country of Origin"
                    value={formData.prodcountry_id}
                    name="prodcountry_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.prodcountry_id ||
                      Boolean(touched.prodcountry_id && errors.prodcountry_id)
                    }
                    helperText="Please select a Country"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {originCountries?.map((country) => (
                      <option value={country.id}>{country.country_name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.prodcountry_id?.map((msg) => (
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
                  <TextField
                    select
                    label="Transmission"
                    value={formData.transmission_id}
                    name="transmission_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.transmission_id ||
                      Boolean(touched.transmission_id && errors.transmission_id)
                    }
                    helperText="Please select a Transmission"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    <option value={1}>Manual</option>
                    <option value={2}>Automatic</option>
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.transmission_id?.map((msg) => (
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
                  <TextField
                    select
                    label="Car Types"
                    value={formData.cartype_id}
                    name="cartype_id"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.cartype_id ||
                      Boolean(touched.cartype_id && errors.cartype_id)
                    }
                    helperText="Please select a Car Type"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {carTypes?.map((carType) => (
                      <option value={carType.id}>{carType.type_name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.cartype_id?.map((msg) => (
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
