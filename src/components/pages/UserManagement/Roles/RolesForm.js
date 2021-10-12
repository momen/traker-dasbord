import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import * as Yup from "yup";
import { Formik } from "formik";
import SuccessPopup from "../../../SuccessPopup";
import { RotateLeft } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  selectAllBtn: {
    marginRight: 5,
    color: "#ffffff",
    backgroundColor: "#EF9300",
    height: "35px",
    // width: "100%",
    borderRadius: "0",
    "&:hover": {
      backgroundColor: "#a46500",
    },
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
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const validationSchema = Yup.object().shape({
  title: Yup.string()
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
});

function RolesForm({
  setPage,
  setOpenPopup,
  itemToEdit,
  permissionsList,
  setViewMode,
  setPageHeader,
}) {
  const classes = useStyles();
  const { t } = useTranslation();

  const formRef = useRef();

  //Customize
  const [formData, updateFormData] = useState({
    title: itemToEdit ? itemToEdit.title : "",
    permissions: itemToEdit
      ? itemToEdit.permissions.map(({ id, title }) => ({ id, title }))
      : [],
  });

  const [permissionsError, setPermissionsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState(
    itemToEdit ? "Role updated successfully." : "Role added successfully."
  );

  const closeDialog = () => {
    setDialogOpen(false);
    setViewMode("data-grid");
    setPageHeader("Roles");
  };

  const handleSubmit = async () => {
    if (formData.permissions.length === 0) {
      setPermissionsError(true);
      return;
    }

    setIsSubmitting(true);
    setPermissionsError(false);

    const data = {
      title: formData.title,
      permissions: formData.permissions,
    };

    data.permissions = data.permissions.map((permission) => permission.id);
    data.permissions = JSON.stringify(data.permissions); //VI

    if (itemToEdit) {
      //Customize
      await axios
        .put(`/roles/${itemToEdit.id}`, data)
        .then((res) => {
          // setPage(1);
          setDialogOpen(true);
        })
        .catch(({ response }) => {
          setIsSubmitting(false);
          setResponseErrors(response.data.errors);
        });
    } else {
      //Customize
      await axios
        .post("/roles", data)
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
    setResponseErrors("");
  };

  const updateAutoComplete = (e, val) => {
    if (permissionsError) {
      setPermissionsError(false);
    }
    // console.log(val);
    updateFormData({
      ...formData,
      permissions: val,
    });
  };

  //Customize
  const handleReset = () => {
    updateFormData({
      title: "",
      permissions: [],
    });
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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={8}>
              <Grid item xs={4}>
                <TextField
                  name="title" //Customize
                  required
                  fullWidth
                  disabled={
                    formData.title === "Admin" ||
                    formData.title === "User" ||
                    formData.title === "Vendor"
                  }
                  id="title" //Customize
                  label="Title" //Customize
                  value={formData.title} //Customize
                  autoFocus
                  onChange={(e) => {
                    handleChange(e);
                    handleStateChange(e);
                  }}
                  onBlur={handleBlur}
                  error={
                    responseErrors?.title ||
                    Boolean(touched.title && errors.title)
                  }
                  helperText={touched.title && errors.title}
                />
              </Grid>

              <Grid item xs={8}></Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.title?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </Grid>
              ) : null}

              <Grid item xs={12} spacing={2}>
                <Button
                  className={classes.selectAllBtn}
                  variant="outlined"
                  color="primary"
                  // style={{ marginRight: "5px", borderRadius: 0 }}
                  onClick={() => {
                    updateFormData({
                      ...formData,
                      permissions: permissionsList,
                    });
                    setPermissionsError(false);
                  }}
                >
                  Select All
                </Button>
                <Button
                  className={classes.unselectAllBtn}
                  variant="contained"
                  color="secondary"
                  style={{ borderRadius: 0, height: 35 }}
                  onClick={() => {
                    updateFormData({ ...formData, permissions: [] });
                    setPermissionsError(true);
                  }}
                >
                  Unselect All
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  limitTags={10}
                  // filterSelectedOptions
                  id="autocomplete-permissions"
                  options={permissionsList ? permissionsList : []}
                  value={formData.permissions}
                  getOptionSelected={(option, value) => option.id === value.id}
                  // setSelectedItem={formData.permissions}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.title}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.title}
                    </React.Fragment>
                  )}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="permissions"
                      name="permissions"
                      variant="outlined"
                      label="Permissions *"
                      placeholder="Select permissions for this role"
                      fullWidth
                      error={responseErrors?.permissions || permissionsError}
                      helperText="At least one permission must be selected."
                    />
                  )}
                  onBlur={() => {
                    if (formData.permissions.length === 0) {
                      setPermissionsError(true);
                    }
                  }}
                  onChange={(e, val) => {
                    updateAutoComplete(e, val);
                    if (val.length === 0) {
                      setPermissionsError(true);
                    } else {
                      setPermissionsError(false);
                    }
                  }}
                />
              </Grid>

              {responseErrors ? (
                <Grid item xs={12}>
                  {responseErrors.permissions?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
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
                  errors.permissions = false;
                  touched.permissions = false;
                }}
                disabled={isSubmitting}
              >
                {t("global.resettBtn")}
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

export default RolesForm;
