import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { PhotoCamera } from "@material-ui/icons";
import { CloseIcon } from "@material-ui/data-grid";
import { Alert, Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import NumberFormat from "react-number-format";

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
  carModels,
  partCategories,
  carYears,
  productTags,
}) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    description: itemToEdit ? itemToEdit.description : "",
    car_made_id: itemToEdit ? itemToEdit.car_made_id : "",
    car_model_id: itemToEdit ? itemToEdit.car_model_id : "",
    year_id: itemToEdit ? itemToEdit.year_id : "",
    discount: itemToEdit ? itemToEdit.discount : "",
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
  const [imgName, setImgName] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [autoSelectCategoryError, setAutoSelectCategoryError] = useState(false);
  const [autoSelectTagError, setAutoSelectTagError] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  let data = new FormData();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      setAutoSelectCategoryError(true);
      return;
    }
    if (formData.tags.length === 0) {
      setAutoSelectTagError(true);
      return;
    }

    if (formData.photo.length === 0) {
      setOpenAlert(true);
      return;
    }

    setAutoSelectCategoryError(false);
    setAutoSelectTagError(false);

    if (!formData.photo && !itemToEdit) {
      setOpenAlert(true);
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo") return;
        if (key === "categories") {
          data.append(
            key,
            value.map((val) => val.id)
          );
        } else if (key === "tags") {
          data.append(
            key,
            value.map((val) => val.id)
          );
        } else {
          data.append(key, value);
        }
      });

      formData.photo.forEach((file) => {
        data.append("photo[]", file, file.name);
        console.log(file);
      });

      JSON.stringify(data);

      if (itemToEdit) {
        await axios
          .post(`/products/${itemToEdit.id}`, data, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setOpenPopup(false);
          })
          .catch((res) => {
            setResponseErrors(res.response.data.errors);
          });
      } else {
        await axios
          .post("/add/products", data, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setPage(1);
            setOpenPopup(false);
          })
          .catch((res) => {
            setResponseErrors(res.response.data.errors);
          });
      }
      console.log(formData);
    }
  };

  const handleChange = (e) => {
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
      categories: val,
    });
  };

  const updateAutoCompleteTags = (e, val) => {
    if (autoSelectTagError) {
      setAutoSelectTagError(false);
    }
    updateFormData({
      ...formData,
      tags: val,
    });
  };

  const handleUpload = (e) => {
    const name = e.target.value.replace(/.*[\/\\]/, "");
    setImgName(name);
    console.log(e.target.files);
    let filesList = [];
    Object.entries(e.target.files).forEach(([key, value]) => {
      filesList.push(value);
    });
    console.log(filesList);
    updateFormData({
      ...formData,
      photo: [...formData.photo, ...filesList],
    });
    setOpenAlert(false);
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
    setImgName("");
    setOpenAlert(false);
  };
  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Product Name"
                value={formData.name}
                autoFocus
                onChange={handleChange}
                error={responseErrors?.name}
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
                onChange={handleChange}
                error={responseErrors?.serial_number}
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
              <TextField
                name="quantity"
                type="number"
                InputProps={{ inputProps: { min: 5 } }}
                required
                fullWidth
                label="Qunatity"
                value={formData.quantity}
                onChange={handleChange}
                error={responseErrors?.quantity}
                // helperText="Min %5 ~ Max %80"
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
              <CurrencyTextField
                // name="price"
                // InputProps={{
                //   inputProps: { min: 5, max: 80 },
                // }}
                required
                fullWidth
                label="Price"
                value={formData.price}
                onChange={(event, value) =>
                  updateFormData({ ...formData, price: value })
                }
                error={responseErrors?.price}
                // helperText="Min %5 ~ Max %80"
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
                onChange={(e) =>
                  updateFormData({
                    ...formData,
                    discount: parseFloat(e.target.value),
                  })
                }
                error={responseErrors?.discount}
                helperText="Min %5 ~ Max %80"
                InputProps={{ inputProps: { min: 5 } }}
                // step={0.01}
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

          <Grid item xs={3}>
            <div>
              <TextField
                select
                label="Car Made"
                value={formData.car_made_id}
                name="car_made_id"
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select a Car Made"
                fullWidth
                required
                error={responseErrors?.car_made_id}
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

          <Grid item xs={3}>
            <div>
              <TextField
                select
                label="Car Model"
                value={formData.car_model_id}
                name="car_model_id"
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select a Car Model"
                fullWidth
                required
                error={responseErrors?.car_model_id}
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

          <Grid item xs={3}>
            <div>
              <TextField
                select
                label="Part Category"
                value={formData.part_category_id}
                name="part_category_id"
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select a Part Category"
                fullWidth
                required
                error={responseErrors?.part_category_id}
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
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select a Year"
                fullWidth
                required
                error={responseErrors?.year_id}
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
          <Grid item xs={8}>
            <div>
              <Autocomplete
                multiple
                // filterSelectedOptions
                options={categories ? categories : []}
                value={formData.categories}
                getOptionSelected={(option, value) => option.id === value.id}
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
                    variant="outlined"
                    label="Categories *"
                    placeholder="Select related Categories for this Product"
                    fullWidth
                    helperText="At least one category must be selected."
                    error={autoSelectCategoryError}
                  />
                )}
                onChange={updateAutoCompleteCategories}
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
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select a Store"
                fullWidth
                required
                error={responseErrors?.store_id}
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
                getOptionSelected={(option, value) => option.id === value.id}
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
                    helperText="At least one tag must be selected."
                    error={autoSelectTagError}
                  />
                )}
                onChange={updateAutoCompleteTags}
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
                onChange={handleChange}
                error={responseErrors?.description}
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

          <Grid item xs={12}>
            <div style={{ display: "flex" }}>
              <input
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
              <span
                style={{
                  alignSelf: "center",
                }}
              >
                {imgName}
              </span>
            </div>
          </Grid>

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
        <Grid container justify="center">
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Grid>
      </form>
    </div>
  );
}

export default ProductsForm;
