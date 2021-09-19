import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Fragment } from "react";
import { RotateLeft, Visibility, VisibilityOff } from "@material-ui/icons";
import * as Yup from "yup";
import { Formik } from "formik";
import SuccessPopup from "../../../SuccessPopup";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    width: "40vw",
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
    width: "20%",
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
    width: "20%",
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

function UsersForm({
  setPage,
  setOpenPopup,
  itemToEdit,
  rolesList,
  stores,
  setViewMode,
  setPageHeader,
}) {
  const classes = useStyles();

  const validationSchema = Yup.object().shape({
    role: !itemToEdit ? Yup.string().required() : Yup.string().notRequired(),
    roles: itemToEdit ? Yup.string().required() : Yup.string().notRequired(),
    email: Yup.string()
      .required("This field is Required.")
      .email("Please enter a valid Email"),
    name: itemToEdit
      ? Yup.string().required("This field is Required.")
      : Yup.string().notRequired(),
  });

  const formRef = useRef();
  //Customize
  const [formData, updateFormData] = useState({
    email: itemToEdit?.email || "",
    name: itemToEdit?.name || "",
    role: "",
    roles: itemToEdit?.roles?.id || "",
    stores: itemToEdit?.stores || [],
  });
  const [autoSelectStoreError, setAutoSelectStoreError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState(
    itemToEdit
      ? "Staff Member details updated successfully."
      : "New Staff Member added successfully."
  );

  const closeDialog = () => {
    setDialogOpen(false);
    setViewMode("data-grid");
    setPageHeader("Staff");
  };

  const handleSubmit = async () => {
    // e.preventDefault();

    if (formData.stores.length === 0 && !itemToEdit) {
      setAutoSelectStoreError(true);
      return;
    }

    // let data = {
    //   email: formData.email,
    //   role: parseInt(formData.role),
    //   stores: JSON.stringify(formData.stores.map((val) => val.id)),
    // };

    let data = {};
    // if (!itemToEdit) {
    data.email = formData.email;
    data.stores = JSON.stringify(formData.stores.map((val) => val.id));
    // }

    setIsSubmitting(true);

    if (itemToEdit) {
      data.name = formData.name;
      data.roles = parseInt(formData.roles);
      axios
        .put(`/users/${itemToEdit.id}`, data)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setIsSubmitting(false);
          setResponseErrors(response.data.errors);
        });
    } else {
      data.role = parseInt(formData.role);
      axios
        .post("/vendor/add/staff", data)
        .then(({ data }) => {
          setPage(1);
          setOpenPopup(false);
          setDialogText(data.message);
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

  const updateAutoCompleteStores = (e, val) => {
    if (autoSelectStoreError) {
      setAutoSelectStoreError(false);
    }
    const stores = val.length > 0 ? val : [];
    updateFormData({
      ...formData,
      stores: stores,
    });
  };

  //Customize
  const handleReset = () => {
    updateFormData({
      email: "",
      role: "",
      stores: [],
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
          handleChange,
          handleSubmit,
          handleBlur,
          touched,
          values,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={8}>
              {itemToEdit ? (
                <Grid item xs={6}>
                  <TextField
                    name="name" //Customize
                    required
                    fullWidth
                    id="name" //Customize
                    label="Username" //Customize
                    value={formData.name} //Customize
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
                    helperText={
                      (touched.name && errors.name) || responseErrors?.name
                    }
                  />
                </Grid>
              ) : null}
              <Grid item xs={6}>
                <TextField
                  name="email" //Customize
                  required
                  fullWidth
                  id="email" //Customize
                  label="Email" //Customize
                  value={formData.email} //Customize
                  autoFocus
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.email ||
                    Boolean(touched.email && errors.email)
                  }
                  helperText={
                    (touched.email && errors.email) || responseErrors?.email
                  }
                />
              </Grid>
              {/* <Grid item xs={7}></Grid>{" "} */}
              {itemToEdit ? (
                <Grid item xs={6}>
                  <div>
                    <TextField
                      select
                      label="Role"
                      value={formData.roles}
                      name="roles"
                      onChange={(e) => {
                        handleChange(e);
                        handleStateChange(e);
                      }}
                      SelectProps={{
                        native: true,
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.roles ||
                        Boolean(touched.roles && errors.roles)
                      }
                      helperText={"Please select a Role"}
                      fullWidth
                      required
                    >
                      <option aria-label="None" value="" />
                      {rolesList?.map((role) => (
                        <option value={role.id}>{role.title}</option>
                      ))}
                    </TextField>
                  </div>
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <div>
                    <TextField
                      select
                      label="Role"
                      value={formData.role}
                      name="role"
                      onChange={(e) => {
                        handleChange(e);
                        handleStateChange(e);
                      }}
                      SelectProps={{
                        native: true,
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.role ||
                        Boolean(touched.role && errors.role)
                      }
                      helperText={"Please select a Role"}
                      fullWidth
                      required
                    >
                      <option aria-label="None" value="" />
                      {rolesList?.map((role) => (
                        <option value={role.id}>{role.title}</option>
                      ))}
                    </TextField>
                  </div>
                </Grid>
              )}
              {/* <Grid item xs={7}></Grid> */}

              <Grid item xs={12}>
                <div>
                  <Autocomplete
                    multiple
                    // filterSelectedOptions
                    options={stores ? stores : []}
                    value={formData.stores}
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
                        name="stores"
                        variant="outlined"
                        label="Stores *"
                        placeholder="Assign stores for this user"
                        fullWidth
                        error={responseErrors?.stores || autoSelectStoreError}
                        helperText="At least one Store must be selected."
                      />
                    )}
                    onBlur={() => {
                      if (formData.stores.length === 0) {
                        setAutoSelectStoreError(true);
                      }
                    }}
                    onChange={(e, val) => {
                      updateAutoCompleteStores(e, val);
                      if (val.length === 0) {
                        setAutoSelectStoreError(true);
                      } else {
                        setAutoSelectStoreError(false);
                      }
                    }}
                  />

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.stores?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
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
                    errors.roles = false;
                    touched.roles = false;
                  }}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </Grid>
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

export default UsersForm;
