import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
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
  title: Yup.string().required("This field is Required"),
  permissions: Yup.array().min(1, "At least one tag must be selected."),
});

function RolesForm({ setPage, setOpenPopup, itemToEdit, permissionsList }) {
  const classes = useStyles();
  const formRef = useRef();

  //Customize
  const [formData, updateFormData] = useState({
    title: itemToEdit ? itemToEdit.title : "",
    permissions: itemToEdit
      ? itemToEdit.permissions.map(({ id, title }) => ({ id, title }))
      : [],
  });

  const [autoSelectError, setAutoSelectError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async () => {
    if (formData.permissions.length === 0) {
      setAutoSelectError(true);
      return;
    }

    setIsSubmitting(true);
    setAutoSelectError(false);

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
          setOpenPopup(false);
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
          setOpenPopup(false);
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
    if (autoSelectError) {
      setAutoSelectError(false);
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
          <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title" //Customize
                  required
                  fullWidth
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
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: "5px" }}
                  onClick={() =>
                    {updateFormData({
                      ...formData,
                      permissions: permissionsList,
                    });
                    errors.permissions = null;
                    values.permissions = permissionsList;
                  }
                  }
                >
                  Select All
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    updateFormData({ ...formData, permissions: [] });
                    errors.permissions = true;
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
                  id="checkboxes-tags-demo"
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
                      name="permissions"
                      variant="outlined"
                      label="Permissions *"
                      placeholder="Select permissions for this role"
                      fullWidth
                      error={
                        responseErrors?.permissions ||
                        autoSelectError ||
                        Boolean(touched.permissions && errors.permissions)
                      }
                      helperText="At least one permission must be selected."
                    />
                  )}
                  onBlur={handleBlur}
                  onChange={(e, val) => {
                    updateAutoComplete(e, val);
                    handleChange(e);
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

export default RolesForm;
