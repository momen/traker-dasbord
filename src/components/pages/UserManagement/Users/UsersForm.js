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
import { Visibility, VisibilityOff } from "@material-ui/icons";
import * as Yup from "yup";
import { Formik } from "formik";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30vw",
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

function UsersForm({ setPage, setOpenPopup, itemToEdit, rolesList }) {
  const classes = useStyles();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is Required."),
    roles: Yup.string().required(),
    email: Yup.string()
      .required("This field is Required.")
      .email("Please enter a valid Email"),
    password: !itemToEdit
      ? Yup.string()
          .matches(
            /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!/@#\$%\^&\*])/,
            "Must have no Spaces, contain 8 Characters, One Uppercase, One Lowercase, One Number & One Special Character"
          )
          .required("This field is Required.")
      : Yup.string(),
    confirm_password: !itemToEdit
      ? Yup.string().when("password", {
          is: (val) => (val && val.length > 0 ? true : false),
          then: Yup.string()
            .oneOf(
              [Yup.ref("password")],
              "Both passwords must match to be confirmed."
            )
            .required("This field is Required."),
          otherwise: undefined,
        })
      : Yup.string(),
  });

  const formRef = useRef();
  //Customize
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    email: itemToEdit ? itemToEdit.email : "",
    roles: itemToEdit ? itemToEdit.roles.id : null,
  });
  const [rolesError, setRolesError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    // e.preventDefault();

    if (formData.roles.length === 0) {
      setRolesError(true);
      return;
    }

    setIsSubmitting(true);
    setRolesError(false);

    let data = {
      name: formData.name,
      email: formData.email,
      roles: formData.roles,
    };

    if (itemToEdit) {
      //Customize
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
      //Customize
      data = {
        ...data,
        password: formData.password,
      };
      axios
        .post("/users", data)
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
  };

  const updateAutoComplete = (e, val) => {
    setRolesError(false);

    updateFormData({
      ...formData,
      roles: val,
    });
  };

  //Customize
  const handleReset = () => {
    updateFormData({
      name: "",
      password: "",
      email: "",
      roles: [],
    });
    setResponseErrors("");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  name="name" //Customize
                  required
                  fullWidth
                  id="name" //Customize
                  label="First Name" //Customize
                  value={formData.name} //Customize
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
                    helperText="Please select a Role"
                    fullWidth
                    required
                  >
                    <option aria-label="None" value="" />
                    {rolesList?.map((role) => (
                      <option value={role.id}>{role.title}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.roles?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              {!itemToEdit ? (
                <Fragment>
                  <Grid item xs={12}>
                    <TextField
                      name="password" //Customize
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      fullWidth
                      id="password" //Customize
                      label="Password" //Customize
                      value={formData.password} //Customize
                      onChange={(e) => {
                        handleChange(e);
                        handleStateChange(e);
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.password ||
                        Boolean(touched.password && errors.password)
                      }
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  {responseErrors ? (
                    <Grid item xs={12}>
                      {responseErrors.password?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </Grid>
                  ) : null}

                  <Grid item xs={12}>
                    <TextField
                      name="confirm_password" //Customize
                      type="password"
                      autoComplete="new-password"
                      required
                      fullWidth
                      id="confirm_password" //Customize
                      label="Confirm Password" //Customize
                      value={values.confirm_password} //Customize
                      onChange={(e) => {
                        handleChange(e);
                        handleStateChange(e);
                      }}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.confirm_password && errors.confirm_password
                      )}
                      helperText={
                        touched.confirm_password && errors.confirm_password
                      }
                    />
                  </Grid>
                </Fragment>
              ) : null}

              <Grid item xs={12}>
                <TextField
                  name="email" //Customize
                  // type="email"
                  // autoComplete="new-password"
                  required
                  fullWidth
                  id="email" //Customize
                  label="Email" //Customize
                  value={formData.email} //Customize
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
                  errors.roles = false;
                  touched.roles = false;
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

export default UsersForm;
