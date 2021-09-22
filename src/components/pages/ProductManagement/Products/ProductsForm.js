import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  makeStyles,
  Radio,
  RadioGroup,
  styled,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { PhotoCamera, RotateLeft } from "@material-ui/icons";
import { CloseIcon } from "@material-ui/data-grid";
import { Alert, Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import { Formik } from "formik";
import SuccessPopup from "../../../SuccessPopup";
import { spacing } from "@material-ui/system";
import { useSelector } from "react-redux";
import clsx from "clsx";

const Divider = styled(MuiDivider)(spacing);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // width: "60vw",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  radioLabel: {
    textTransform: "capitalize",
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
    width: 150,
    height: 40,
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
  chipError: {
    color: "red",
    borderColor: "red",
  },
  imageErrorMsg: {
    marginLeft: 10,
    color: "red",
  },
  productImages: {
    height: "60px",
    marginRight: "20px",
    marginLeft: "20px",
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
  mainCategories,
  // categories,
  // carMades,
  carYears,
  productTags,
  manufacturers,
  originCountries,
  carTypes,
  transmissionsList,
  productTypes,
  setViewMode,
  setPageHeader,
}) {
  const classes = useStyles();
  const uploadRef = useRef();
  const { lang } = useSelector((state) => state);

  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name || "" : "",
    name_en: itemToEdit ? itemToEdit.name_en || "" : "",
    description: itemToEdit ? itemToEdit.description || "" : "",
    description_en: itemToEdit ? itemToEdit.description_en || "" : "",
    car_made_id: itemToEdit ? itemToEdit.car_made_id || "" : "",
    models: itemToEdit
      ? itemToEdit.car_model?.map(({ id, carmodel }) => ({
          id,
          carmodel,
        }))
      : [],
    year_from: itemToEdit ? itemToEdit.year_from?.id || "" : "",
    year_to: itemToEdit ? itemToEdit.year_to?.id || "" : "",
    discount:
      itemToEdit?.discount && itemToEdit?.discount > 0
        ? itemToEdit.discount
        : "",
    maincategory_id: itemToEdit ? itemToEdit.category?.maincategory_id : "",
    category_id: itemToEdit ? itemToEdit.category?.id : "",
    price: itemToEdit ? parseFloat(itemToEdit.price) : "",
    holesale_price: itemToEdit ? parseFloat(itemToEdit.holesale_price) : "",
    no_of_orders: itemToEdit ? parseInt(itemToEdit.no_of_orders) : "",

    part_category_id: itemToEdit.part_category_id?.toString() || "",
    manufacturer_id: itemToEdit ? itemToEdit.manufacturer?.id : "",
    prodcountry_id: itemToEdit ? itemToEdit.origin_country?.id : "",
    transmission_id: itemToEdit ? itemToEdit.transmission_id || "" : "",
    cartype_id: itemToEdit ? itemToEdit.cartype_id : "",
    tags: itemToEdit
      ? itemToEdit.tags.map(({ id, name }) => ({ id, name }))
      : [],
    store_id: itemToEdit ? itemToEdit.store_id : "",
    quantity: itemToEdit ? parseInt(itemToEdit.quantity) : "",
    qty_reminder: itemToEdit ? parseInt(itemToEdit.qty_reminder) || 1 : 1,
    serial_number: itemToEdit ? itemToEdit.serial_number : "",
    producttype_id: itemToEdit ? itemToEdit.product_type?.id : "",
    photo: [],
  });

  const [brands, setBrands] = useState(null);
  const [carModels, setCarModels] = useState(null);
  const [categories, setCategories] = useState(null);
  const [partCategories, setPartCategories] = useState(null);
  const [toYears, setToYears] = useState([]);

  const [enableDiscount, setEnableDiscount] = useState(
    itemToEdit.discount ? true : false
  );

  const validationSchema = Yup.object().shape({
    name:
      lang === "ar"
        ? Yup.string()
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
            )
        : Yup.string()
            .notRequired()
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

    name_en:
      lang === "en"
        ? Yup.string()
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
            )
        : Yup.string()
            .notRequired()
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
      formData.producttype_id?.toString() == "2" ||
      formData.producttype_id?.toString() == "3"
        ? Yup.number()
            .min(1, "Enter a value greater than 0")
            .required("This field is Required")
        : Yup.string().nullable().notRequired(),
    no_of_orders:
      formData.producttype_id?.toString() == "2" ||
      formData.producttype_id?.toString() == "3"
        ? Yup.number()
            .min(1, "Minimum value should be 1")
            .required("This field is Required")
        : Yup.string().nullable().notRequired(),
    car_made_id:
      formData.category_id &&
      formData.category_id != "43" &&
      formData.category_id != "81" &&
      formData.category_id != "82" &&
      formData.category_id != "83" &&
      formData.category_id != "84" &&
      formData.category_id != "85" &&
      formData.maincategory_id &&
      formData.maincategory_id != "5"
        ? Yup.string().required()
        : Yup.string().nullable().notRequired(),
    year_from:
      formData.category_id &&
      formData.category_id != "43" &&
      formData.category_id != "81" &&
      formData.category_id != "82" &&
      formData.category_id != "83" &&
      formData.category_id != "84" &&
      formData.category_id != "85" &&
      formData.maincategory_id &&
      formData.maincategory_id != "5"
        ? Yup.string().required()
        : Yup.string().nullable().notRequired(),
    year_to:
      formData.category_id &&
      formData.category_id != "43" &&
      formData.category_id != "81" &&
      formData.category_id != "82" &&
      formData.category_id != "83" &&
      formData.category_id != "84" &&
      formData.category_id != "85" &&
      formData.maincategory_id &&
      formData.maincategory_id != "5"
        ? Yup.string().required()
        : Yup.string().nullable().notRequired(),
    discount: enableDiscount
      ? Yup.number()
          .required()
          .min(1, "Minimum value for discount is 1%")
          .max(80, "Maximum value for discount is 80%")
      : Yup.number().nullable().notRequired(),
    discount_value: Yup.number()
      .min(1, "Minimum value for discount is 1%")
      .max(formData.price * 0.8, "Maximum value for discount is 80%"),
    price:
      formData.producttype_id?.toString() == "1" ||
      formData.producttype_id?.toString() == "3"
        ? Yup.number()
            .required("This field is Required")
            .min(1, "Enter a value greater than 0")
        : Yup.string().nullable().notRequired(),
    maincategory_id: Yup.string().required(),
    category_id: Yup.string().required(),
    part_category_id: partCategories?.length
      ? Yup.string().required()
      : Yup.string().nullable().notRequired(),
    manufacturer_id: Yup.string().required(),
    prodcountry_id: Yup.string().required(),
    transmission_id:
      formData.category_id &&
      formData.category_id != "43" &&
      formData.category_id != "81" &&
      formData.category_id != "82" &&
      formData.category_id != "83" &&
      formData.category_id != "84" &&
      formData.category_id != "85" &&
      formData.maincategory_id &&
      formData.maincategory_id != "5"
        ? Yup.string().required()
        : Yup.string().nullable().notRequired(),
    cartype_id:
      formData.category_id &&
      formData.category_id != "43" &&
      formData.category_id != "81" &&
      formData.category_id != "82" &&
      formData.category_id != "83" &&
      formData.category_id != "84" &&
      formData.category_id != "85" &&
      formData.maincategory_id &&
      formData.maincategory_id != "5"
        ? Yup.string().required()
        : Yup.string().nullable().notRequired(),
    store_id: Yup.string().required(),
    quantity:
      formData.producttype_id?.toString() !== "2"
        ? Yup.number()
            .required("This field is Required")
            .nullable()
            .min(5, "Minimum value should be 5")
        : Yup.string().nullable().notRequired(),
    qty_reminder:
      formData.producttype_id?.toString() !== "2"
        ? Yup.number().nullable().required("This field is Required")
        : Yup.number().notRequired().nullable(),
    description:
      lang === "ar"
        ? Yup.string()
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
            .max(255, "Description must not exceed 255 characters")
        : Yup.string()
            .nullable()
            .notRequired()
            .test(
              "Minimum 5 chars without spaces",
              "Please enter 5 characters excluding spaces",
              (val) => (val ? val?.trim().length >= 5 : true)
            )
            .test(
              "Not empty",
              "Please remove any spaces at the beginning",
              (val) => (val ? val?.trim() !== "" : true)
            )
            .min(5, "Description must be at least 5 characters")
            .max(255, "Description must not exceed 255 characters"),
    description_en:
      lang === "en"
        ? Yup.string()
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
            .max(255, "Description must not exceed 255 characters")
        : Yup.string()
            .test(
              "Minimum 5 chars without spaces",
              "Please enter 5 characters excluding spaces",
              (val) => (val ? val?.trim().length >= 5 : true)
            )
            .test(
              "Not empty",
              "Please remove any spaces at the beginning",
              (val) => (val ? val?.trim() !== "" : true)
            )
            .min(5, "Description must be at least 5 characters")
            .max(255, "Description must not exceed 255 characters")
            .notRequired()
            .nullable(),
  });
  // This is the for an image if you are editing a product, if you try to delete it there is a confirmation Dialog
  // appearing before the action is done, so the image info is needed if the user confirms to delete.
  const [imageToDelete, setImageToDelete] = useState({});

  // List of images Ids to be deleted on submit (applies for previously saved images on editing a product, not new uploaded images)
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [productImages, setProductImages] = useState(() =>
    itemToEdit
      ? itemToEdit.photo.map(({ id, file_name, image }) => ({
          id,
          file_name,
          image,
        }))
      : []
  );

  const [openAlert, setOpenAlert] = useState(false);
  const [autoSelectModelError, setAutoSelectModelError] = useState(false);
  const [autoSelectTagError, setAutoSelectTagError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Update on other components
  const [responseErrors, setResponseErrors] = useState("");
  const [bigImgSize, setBigImgSize] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState(
    itemToEdit
      ? "Product details updated successfully."
      : "Product info added & pending approval, once all the provided details are confirmed it will be approved."
  );

  const closeDialog = () => {
    setDialogOpen(false);
    setViewMode("data-grid");
    setPageHeader("Products");
  };

  useEffect(() => {
    if (itemToEdit) {
      if (itemToEdit.car_made_id) {
        axios
          .get(`/cartype/madeslist/${itemToEdit.cartype_id}`)
          .then((res) => {
            const _brands = res.data.data.map(({ id, car_made, name_en }) => ({
              id,
              car_made,
              name_en,
            })); // Customize
            setBrands(_brands);
          })
          .catch(() => {
            alert("Failed to Fetch Models List");
          });
        axios
          .get(`/car-modelslist/${itemToEdit.car_made_id}`)
          .then((res) => {
            const _carModels = res.data.data.map(
              ({ id, carmodel, name_en }) => ({
                id,
                carmodel,
                name_en,
              })
            ); // Customize
            setCarModels(_carModels);
          })
          .catch(() => {
            alert("Failed to Fetch Models List");
          });
      }

      axios
        .get(`/categorieslist/${itemToEdit.category?.maincategory_id}`)
        .then((res) => {
          const _categories = res.data.data.map(({ id, name, name_en }) => ({
            id,
            name,
            name_en,
          })); // Customize
          setCategories(_categories);
        })
        .catch(() => {
          alert("Failed to Fetch Categories List");
        });

      axios
        .get(`/part-categorieslist/${itemToEdit.category_id}`)
        .then((res) => {
          const _partCategories = res.data.data.map(
            ({ id, category_name, name_en }) => ({
              id,
              category_name,
              name_en,
            })
          ); // Customize
          setPartCategories(_partCategories);
        })
        .catch(() => {
          alert("Failed to Fetch Part Categories List");
        });

      if (itemToEdit.year_from) {
        const fromYear = carYears.find(
          (carYear) => carYear.id == itemToEdit.year_from?.id
        );
        setToYears(
          carYears.filter(
            (year) => parseInt(year.year) >= parseInt(fromYear.year)
          )
        );
      }
    }
    if (productTypes.length === 1 && productTypes.includes("wholesale")) {
      updateFormData({ ...formData, producttype_id: "2" });
    } else if (!itemToEdit) {
      updateFormData({ ...formData, producttype_id: "1" });
    }
  }, []);

  const toggleDiscount = () => {
    setEnableDiscount(!enableDiscount);
  };

  const handleSubmit = async () => {
    // if (
    //   formData.models.length === 0 &&
    //   formData.category_id &&
    //   formData.category_id != "43" &&
    //   formData.category_id != "81" &&
    //   formData.category_id != "82" &&
    //   formData.category_id != "83" &&
    //   formData.category_id != "84" &&
    //   formData.category_id != "85" &&
    //   formData.maincategory_id &&
    //   formData.maincategory_id != "5"
    // ) {
    //   setAutoSelectModelError(true);
    //   return;
    // }
    // if (formData.tags.length === 0) {
    //   setAutoSelectTagError(true);
    //   return;
    // }

    //   ? Yup.string().required()
    //   : Yup.string().nullable().notRequired(),
    setAutoSelectModelError(false);
    setAutoSelectTagError(false);

    // setIsSubmitting(true);
    let data = new FormData();

    if (
      (formData.photo.length === 0 && !itemToEdit) ||
      (productImages?.length === 0 && !formData.photo?.length)
    ) {
      setOpenAlert(true);
      setIsSubmitting(false);
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo") return;
        if (key === "quantity" && formData.producttype_id == 2) {
          data.append(key, 1);
        } else if (key === "tags" || key === "models") {
          data.append(key, JSON.stringify(value.map((val) => val.id)));
        } else if (
          (key === "discount" && !value) ||
          (key === "discount" && !enableDiscount)
        ) {
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

      console.log(formData.models);

      if (itemToEdit) {
        await axios
          .post(`/products/${itemToEdit.id}`, data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            if (imagesToDelete.length) {
              axios
                .post(`/products/remove/checked/media`, {
                  product_id: itemToEdit.id,
                  media_ids: JSON.stringify(imagesToDelete),
                })
                .then((res) => {
                  setOpenPopup(false);
                  setDialogOpen(true);
                  setIsSubmitting(false);
                })
                .catch((res) => {
                  setResponseErrors(res.response.data.errors);
                  setIsSubmitting(false);
                });
            } else {
              setOpenPopup(false);
              setIsSubmitting(false);
              setDialogOpen(true);
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
            setDialogOpen(true);
            setIsSubmitting(false);
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
    if (e.target.name === "quantity") console.log(e.target.value);
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

    console.log(e.target.files);

    setBigImgSize(false);
    //Loop on all files saved in the File Input, find if the image was already added to the state
    // & append only the new images to avoid duplication.
    Object.entries(e.target.files).forEach(([key, file]) => {
      if (!formData.photo.find((img) => img.name === file.name)) {
        if (file.size / 1000 > 1048) {
          setBigImgSize(true);
          return;
        }
        filesList.push(file);
      }
    });

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

  // const ToggleExistingImage = ({ id, file_name, deleted }) => {
  //   if (deleted) {
  //     setImagesToDelete(imagesToDelete.filter((img_id) => img_id !== id));
  //   } else {
  //     setImagesToDelete([...imagesToDelete, id]);
  //   }
  //   setProductImages(
  //     productImages.map((img) =>
  //       img.file_name === file_name ? { ...img, deleted: !img.deleted } : img
  //     )
  //   );
  //   setBigImgSize(false);
  // };

  const addToDeleteImages = ({ id, file_name, deleted }) => {
    setImagesToDelete([...imagesToDelete, id]);
    setProductImages(productImages.filter((img) => img.id !== id));
    setBigImgSize(false);
    setOpenDeleteDialog(false);
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

  // const vendorTypes = [
  //   { id: 2, title: "Wholesale" },
  //   { id: 1, title: "Retail" },
  //   { id: 3, title: "Both" },
  // ];
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
          setFieldValue,
          values,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={8}>
              <Grid item xs={6} md={4}>
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
                      if (e.target.value) {
                        axios
                          .get(`/categorieslist/${e.target.value}`)
                          .then((res) => {
                            const _categories = res.data.data.map(
                              ({ id, name, name_en }) => ({
                                id,
                                name,
                                name_en,
                              })
                            ); // Customize
                            setCategories(_categories);
                          })
                          .catch(() => {
                            alert("Failed to Fetch Categories List");
                          });
                      } else {
                        setCategories(null);
                      }
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

              <Grid item xs={6} md={4}>
                <div>
                  <TextField
                    variant="outlined"
                    disabled={!formData.maincategory_id}
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
                              ({ id, category_name, name_en }) => ({
                                id,
                                category_name,
                                name_en,
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
                    InputLabelProps={{ shrink: !!formData.category_id }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.category_id ||
                      Boolean(touched.category_id && errors.category_id)
                    }
                    helperText="Please select a Category"
                    fullWidth
                  >
                    <option aria-label="None" value="" />
                    {categories?.map((category) => (
                      <option value={category.id}>
                        {lang === "ar"
                          ? category.name || category.name_en
                          : category.name_en || category.name}
                      </option>
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

              <Grid item xs={6} md={4}>
                <div>
                  <TextField
                    variant="outlined"
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
                  >
                    <option aria-label="None" value="" />
                    {partCategories?.map((partCategory) => (
                      <option value={partCategory.id}>
                        {lang === "ar"
                          ? partCategory.category_name || partCategory.name_en
                          : partCategory.name_en || partCategory.category_name}
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

              <Grid item xs={6} sm={6}>
                <div>
                  <TextField
                    variant="outlined"
                    name="name"
                    required={lang === "ar"}
                    fullWidth
                    id="name"
                    label="Product Name (Arabic)"
                    value={values.name}
                    // autoFocus
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                      console.log(errors);
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

              <Grid item xs={6} sm={6}>
                <div>
                  <TextField
                    variant="outlined"
                    name="name_en"
                    required={lang === "en"}
                    fullWidth
                    id="name_en"
                    label="Product Name (English)"
                    value={values.name_en}
                    // autoFocus
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

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.name_en?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={6} md={6}>
                <div>
                  <TextField
                    variant="outlined"
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
                  >
                    <option aria-label="None" value="" />
                    {manufacturers?.map((manufacturer) => (
                      <option value={manufacturer.id}>
                        {lang === "ar"
                          ? manufacturer.manufacturer_name ||
                            manufacturer.name_en
                          : manufacturer.name_en ||
                            manufacturer.manufacturer_name}
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

              <Grid item xs={6} sm={6}>
                <div>
                  <TextField
                    variant="outlined"
                    name="serial_number"
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

              <Grid item xs={6} md={6}>
                <div>
                  <TextField
                    variant="outlined"
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
                  >
                    <option aria-label="None" value="" />
                    {originCountries?.map((country) => (
                      <option value={country.id}>
                        {lang === "ar"
                          ? country.country_name || country.name_en
                          : country.name_en || country.country_name}
                      </option>
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

              <Grid item xs={6} md={6}></Grid>

              <Grid item xs={6}>
                <div style={{ minWidth: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    name="description"
                    required={lang === "ar"}
                    label="Description (Arabic)"
                    multiline
                    rows={5}
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

              <Grid item xs={6}>
                <div style={{ minWidth: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    name="description_en"
                    required={lang === "en"}
                    label="Description (English)"
                    multiline
                    rows={5}
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

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.description_en?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12}>
                <Divider my={1} />
              </Grid>

              <Grid item xs={12}>
                {/* <div>
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
                </div> */}

                <b>
                  {" "}
                  <p className={classes.inputLabel}>Product Type</p>
                </b>
                <FormControl component="fieldset">
                  {/* <FormLabel component="legend">Gender</FormLabel> */}
                  <RadioGroup
                    aria-label="vendor-type"
                    name="producttype_id"
                    value={formData.producttype_id}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      updateFormData({
                        ...formData,
                        producttype_id: e.target.value,
                      });
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {productTypes?.map((type) => (
                        <FormControlLabel
                          key={`vendor-type-${type.id}`}
                          // style={{ marginLeft: "30px" }}
                          value={type.id}
                          control={
                            <Radio
                              style={{
                                alignSelf: "flex-start",
                                color: "#424242",
                              }}
                              checked={formData.producttype_id == type.id}
                            />
                          }
                          //   style={{ padding: 0 }}
                          label={
                            <span className={classes.radioLabel}>
                              {lang === "ar"
                                ? type.producttype || type.name_en
                                : type.name_en || type.producttype}
                            </span>
                          }
                        />
                      ))}
                    </div>
                  </RadioGroup>
                  {Boolean(touched.producttype_id && errors.producttype_id) ||
                  responseErrors?.producttype_id ? (
                    <FormHelperText className={classes.error}>
                      {(touched.producttype_id && errors.producttype_id) ||
                        responseErrors?.producttype_id}
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>

              {formData.producttype_id?.toString() === "2" ||
              formData.producttype_id?.toString() === "3" ? (
                <>
                  <Grid item xs={6} md={3}>
                    <div>
                      <NumberFormat
                        variant="outlined"
                        allowNegative={false}
                        customInput={TextField}
                        thousandSeparator={true}
                        fullWidth
                        name="holesale_price"
                        label="Wholesale Price"
                        value={formData.holesale_price}
                        onValueChange={({ floatValue }) => {
                          updateFormData({
                            ...formData,
                            holesale_price: Math.round(floatValue),
                          });
                          values.holesale_price = Math.round(floatValue);
                          if (!floatValue) {
                            errors.holesale_price = "This field is Required";
                          } else if (floatValue === 0) {
                            errors.holesale_price =
                              "Enter a value greater than 0";
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

                  <Grid item xs={6} md={3} lg={3}>
                    <div>
                      <NumberFormat
                        variant="outlined"
                        allowNegative={false}
                        customInput={TextField}
                        thousandSeparator={true}
                        name="no_of_orders"
                        fullWidth
                        label="Number of orders"
                        value={formData.no_of_orders}
                        onValueChange={({ floatValue }) => {
                          updateFormData({
                            ...formData,
                            no_of_orders: Math.round(floatValue),
                          });
                          values.no_of_orders = floatValue;
                          if (!floatValue) {
                            errors.no_of_orders = "This field is Required";
                          } else if (floatValue < 1) {
                            errors.no_of_orders = "Minimum value should be 1";
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

              {formData.producttype_id?.toString() === "3" ? (
                <Grid item xs={6}></Grid>
              ) : null}

              {formData.producttype_id?.toString() === "1" ||
              formData.producttype_id?.toString() === "3" ? (
                <>
                  <Grid item xs={6} md={4}>
                    <div>
                      <NumberFormat
                        variant="outlined"
                        allowNegative={false}
                        customInput={TextField}
                        thousandSeparator={true}
                        fullWidth
                        name="price"
                        label="Price"
                        value={formData.price}
                        onValueChange={({ floatValue }) => {
                          updateFormData({ ...formData, price: floatValue });
                          values.price = floatValue;
                          if (!floatValue) {
                            errors.price = "This field is Required";
                          } else if (floatValue < 1) {
                            errors.price = "Enter a value greater than 0";
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

                  <Grid
                    item
                    xs={4}
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        // justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="terms_services"
                        onChange={toggleDiscount}
                        checked={enableDiscount}
                      />

                      <span>Discount</span>
                    </div>
                  </Grid>

                  <Grid item xs={4} md={2}>
                    <div>
                      <NumberFormat
                        required={enableDiscount}
                        variant="outlined"
                        disabled={
                          !formData.price ||
                          (!enableDiscount && !itemToEdit?.discount)
                        }
                        allowNegative={false}
                        customInput={TextField}
                        name="discount"
                        fullWidth
                        label="Percentage %"
                        // prefix="%"
                        value={formData.discount || 0}
                        onChange={(e) => {
                          updateFormData({
                            ...formData,
                            discount: parseFloat(e.target.value),
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
                          "Min 1% & Max 80%"
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

                  <Grid item xs={4} md={2}>
                    <div>
                      <NumberFormat
                        variant="outlined"
                        disabled={
                          !formData.price ||
                          (!enableDiscount && !itemToEdit?.discount)
                        }
                        allowNegative={false}
                        customInput={TextField}
                        name="discount_value"
                        fullWidth
                        label="Value"
                        // prefix="%"
                        value={
                          formData.discount
                            ? (
                                (formData.discount / 100) *
                                parseFloat(formData.price)
                              ).toFixed(2)
                            : 0
                        }
                        onChange={(e) => {
                          updateFormData({
                            ...formData,
                            discount: e.target.value
                              ? parseFloat(
                                  (e.target.value /
                                    parseFloat(formData.price)) *
                                    100
                                ).toFixed(2)
                              : null,
                          });
                          values.discount = e.target.value;
                          if (!touched.discount) {
                            touched.discount = true;
                          }
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        error={
                          responseErrors?.discount ||
                          Boolean(
                            touched.discount_value && errors.discount_value
                          )
                        }
                        helperText={
                          (touched.discount_value && errors.discount_value) ||
                          "Min 1% & Max 80%"
                        }
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
                  <Grid item xs={2}></Grid>
                </>
              ) : null}

              {/* {formData.producttype_id.toString() === "1" ? (
                <Grid item xs={5}></Grid>
              ) : formData.producttype_id.toString() === "2" ? (
                <Grid item xs={3}></Grid>
              ) : null} */}

              {formData.producttype_id?.toString() !== "2" ? (
                <Grid item xs={4} md={3}>
                  <div>
                    <NumberFormat
                      variant="outlined"
                      allowNegative={false}
                      customInput={TextField}
                      thousandSeparator={true}
                      name="quantity"
                      fullWidth
                      label="Qunatity"
                      value={formData.quantity}
                      onValueChange={({ floatValue }) => {
                        updateFormData({
                          ...formData,
                          quantity: Math.round(floatValue),
                        });
                        values.quantity = Math.round(floatValue);
                        // if (!floatValue) {
                        //   errors.quantity = "This field is Required";
                        // }
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
              ) : null}
              {formData.producttype_id?.toString() !== "2" ? (
                <Grid item xs={4} md={3}>
                  <div>
                    <NumberFormat
                      variant="outlined"
                      allowNegative={false}
                      customInput={TextField}
                      thousandSeparator={true}
                      name="qty_reminder"
                      required={!formData.producttype_id?.toString() === "2"}
                      fullWidth
                      label="Reminder Quantity"
                      value={formData.qty_reminder}
                      onValueChange={({ floatValue }) => {
                        updateFormData({
                          ...formData,
                          qty_reminder: Math.round(floatValue),
                        });
                        values.qty_reminder = Math.round(floatValue);
                        // if (!floatValue) {
                        //   errors.qty_reminder = "This field is Required";
                        // } else if (floatValue < 5) {
                        //   errors.qty_reminder = "Minimum value should be 5";
                        // }
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
              ) : null}

              <Grid item xs={6} md={3}>
                <div>
                  <TextField
                    variant="outlined"
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
                  >
                    <option aria-label="None" value="" />
                    {stores?.map((store) => (
                      <option value={parseInt(store.id)}>{store.name}</option>
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

              {formData.producttype_id?.toString() === "2" ? (
                <Grid item xs={6}></Grid>
              ) : null}

              <Grid item xs={12}>
                <Divider my={1} />
              </Grid>

              {formData.category_id &&
              formData.category_id != "43" &&
              formData.category_id != "81" &&
              formData.category_id != "82" &&
              formData.category_id != "83" &&
              formData.category_id != "84" &&
              formData.category_id != "85" &&
              formData.maincategory_id &&
              formData.maincategory_id != "5" ? (
                <>
                  <Grid item xs={6} md={3}>
                    <div>
                      <TextField
                        variant="outlined"
                        select
                        label="Car Type"
                        value={formData.cartype_id}
                        name="cartype_id"
                        onChange={(e) => {
                          handleChange(e);
                          updateFormData({
                            ...formData,
                            cartype_id: e.target.value,
                            car_made_id: "",
                            models: [],
                          });
                          values.car_made_id = "";
                          values.models = [];
                          if (e.target.value) {
                            axios
                              .get(`/cartype/madeslist/${e.target.value}`)
                              .then((res) => {
                                const _brands = res.data.data.map(
                                  ({ id, car_made, name_en }) => ({
                                    id,
                                    car_made,
                                    name_en,
                                  })
                                ); // Customize
                                setBrands(_brands);
                              })
                              .catch(() => {
                                alert("Failed to Fetch Brands List");
                              });
                          } else {
                            setBrands(null);
                            setCarModels(null);
                            updateFormData({
                              ...formData,
                              cartype_id: "",
                              car_made_id: "",
                              models: [],
                            });
                          }
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
                      >
                        <option aria-label="None" value="" />
                        {carTypes?.map((carType) => (
                          <option value={carType.id}>
                            {lang === "ar"
                              ? carType.type_name || carType.name_en
                              : carType.name_en || carType.type_name}
                          </option>
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
                  <Grid item xs={6} md={3}>
                    <div>
                      <TextField
                        disabled={!brands?.length > 0}
                        variant="outlined"
                        select
                        label="Brand"
                        value={formData.car_made_id}
                        name="car_made_id"
                        onChange={(e) => {
                          handleChange(e);
                          updateFormData({
                            ...formData,
                            car_made_id: e.target.value,
                            models: [],
                          });
                          if (e.target.value) {
                            axios
                              .get(`/car-modelslist/${e.target.value}`)
                              .then((res) => {
                                const _carModels = res.data.data.map(
                                  ({ id, carmodel, name_en }) => ({
                                    id,
                                    carmodel,
                                    name_en,
                                  })
                                ); // Customize
                                setCarModels(_carModels);
                              })
                              .catch(() => {
                                alert("Failed to Fetch Models List");
                              });
                          } else {
                            setCarModels(null);
                            updateFormData({
                              ...formData,
                              car_made_id: "",
                              models: [],
                            });
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
                      >
                        <option aria-label="None" value="" />
                        {brands?.map((carMade) => (
                          <option value={carMade.id}>
                            {lang === "ar"
                              ? carMade.car_made || carMade.name_en
                              : carMade.name_en || carMade.car_made}
                          </option>
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
                  <Grid item xs={12} md={6}>
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
                        getOptionLabel={(option) =>
                          lang === "ar"
                            ? option.carmodel || option.name_en
                            : option.name_en || option.carmodel
                        }
                        renderOption={(option, { selected }) => (
                          <React.Fragment>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {lang === "ar"
                              ? option.carmodel || option.name_en
                              : option.name_en || option.carmodel}
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
                            error={
                              responseErrors?.models || autoSelectModelError
                            }
                            helperText="At least one model must be selected."
                          />
                        )}
                        // onBlur={() => {
                        //   if (formData.models.length === 0) {
                        //     setAutoSelectModelError(true);
                        //   }
                        // }}
                        onChange={(e, val) => {
                          updateAutoCompleteModels(e, val);
                          // if (val.length === 0) {
                          //   setAutoSelectModelError(true);
                          // } else {
                          //   setAutoSelectModelError(false);
                          // }
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
                        variant="outlined"
                        select
                        label="From Year"
                        value={formData.year_from}
                        name="year_from"
                        onChange={(e) => {
                          handleChange(e);
                          handleStateChange(e);
                          const fromYear = carYears.find(
                            (carYear) => carYear.id == e.target.value
                          );
                          setToYears(
                            carYears.filter(
                              (year) =>
                                parseInt(year.year) >= parseInt(fromYear.year)
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
                        variant="outlined"
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
                </>
              ) : null}

              {/****************************** ******************************/}

              {formData.category_id &&
              formData.category_id != "43" &&
              formData.category_id != "81" &&
              formData.category_id != "82" &&
              formData.category_id != "83" &&
              formData.category_id != "84" &&
              formData.category_id != "85" &&
              formData.maincategory_id &&
              formData.maincategory_id != "5" ? (
                <>
                  <Grid item xs={6} md={3}>
                    <div>
                      <TextField
                        variant="outlined"
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
                          Boolean(
                            touched.transmission_id && errors.transmission_id
                          )
                        }
                        helperText="Please select a Transmission"
                        fullWidth
                      >
                        <option aria-label="None" value="" />
                        {transmissionsList?.map((transmission) => (
                          <option
                            value={transmission.id}
                            style={{ textTransform: "capitalize" }}
                          >
                            {lang === "ar"
                              ? transmission.transmission_name ||
                                transmission.name_en
                              : transmission.name_en ||
                                transmission.transmission_name}
                          </option>
                        ))}
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
                </>
              ) : null}

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
                    // onBlur={() => {
                    //   if (formData.tags.length === 0) {
                    //     setAutoSelectTagError(true);
                    //   }
                    // }}
                    onChange={(e, val) => {
                      updateAutoCompleteTags(e, val);
                      // if (val.length === 0) {
                      //   setAutoSelectTagError(true);
                      // } else {
                      //   setAutoSelectTagError(false);
                      // }
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

              <Grid item xs={12} lg={12}>
                <input
                  ref={uploadRef}
                  // accept="image/*"
                  accept=".jpg, .jpeg, .png, .gif"
                  className={classes.uploadInput}
                  id="icon-button-file"
                  type="file"
                  onChange={handleUpload}
                  multiple
                />
                <label htmlFor="icon-button-file">
                  <Button
                    dir="ltr"
                    variant="contained"
                    color="default"
                    className={classes.uploadButton}
                    startIcon={<PhotoCamera className={classes.uploadIcon} />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </Grid>

              {productImages?.length || formData.photo?.length ? (
                <Grid item xs>
                  {productImages?.map((img, index) => {
                    // console.log(imagesToDelete);
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Chip
                          className={classes.chip}
                          // icon={<FaceIcon/>}
                          label={img.file_name}
                          onDelete={() => {
                            setImageToDelete(img);
                            setOpenDeleteDialog(true);
                          }}
                          variant="outlined"
                          color={img.deleted ? "secondary" : "primary"}
                        />
                        <img
                          src={img.image}
                          alt={`img-${index}`}
                          className={classes.productImages}
                        />
                      </div>
                    );
                  })}
                  {formData.photo?.map((img, index) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <Chip
                          className={clsx(
                            classes.chip,
                            responseErrors[`photo.${index}`] &&
                              classes.chipError
                          )}
                          // icon={<FaceIcon/>}
                          label={img.name}
                          onDelete={() => handleDeleteImage(img.name)}
                          variant="outlined"
                        />
                        <p className={classes.imageErrorMsg}>
                          {responseErrors[`photo.${index}`]}
                        </p>
                      </div>

                      <img
                        src={URL.createObjectURL(img)}
                        alt=""
                        alt={`img-${index}`}
                        className={classes.productImages}
                      />
                    </div>
                  ))}
                </Grid>
              ) : null}

              {bigImgSize ? (
                <Grid item xs={12}>
                  <p className={classes.errorMsg}>
                    Size has exceeded 1MB for one Image or more & have been
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
                className={classes.submitButton}
                onClick={() => console.log(errors)}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting} // Update on other components
              >
                Submit
              </Button>
              <Button
                className={classes.resetButton}
                variant="contained"
                startIcon={<RotateLeft />}
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
      <Dialog
        open={openDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Image"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ maxWidth: "20vw" }}
          >
            Are you sure you want to delete this image?
            <br />
            If you proceed the image will be removed from the view, however it
            won't be actually deleted until you submit the form.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              addToDeleteImages(imageToDelete);
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="secondary"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessPopup
        open={dialogOpen}
        setOpen={setDialogOpen}
        message={dialogText}
        handleClose={closeDialog}
      />
    </div>
  );
}

export default ProductsForm;
