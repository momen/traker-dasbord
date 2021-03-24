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
import { useStateValue } from "../../../../StateProvider";
import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Fragment } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";

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
  const [{ user }] = useStateValue();

  const formRef = useRef();
  //Customize
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    email: itemToEdit ? itemToEdit.email : "",
    roles: itemToEdit
      ? itemToEdit.roles.map(({ id, title }) => ({ id, title }))
      : [],
  });
  const [autoSelectError, setAutoSelectError] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.roles.length === 0) {
      setAutoSelectError(true);
      return;
    }

    setAutoSelectError(false);

    let data = {
      name: formData.name,
      email: formData.email,
      roles: formData.roles,
    };

    data.roles = data.roles.map((role) => role.id);
    data.roles = JSON.stringify(data.roles); //VI

    if (itemToEdit) {
      //Customize
      await axios
        .put(`/users/${itemToEdit.id}`, data)
        .then((res) => {
          // setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          alert(response.data?.errors)
          setResponseErrors(response.data.errors);
        });
    } else {
      //Customize
      data = {
        ...data,
        password: formData.password,
      };
      await axios
        .post("/users", data)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setResponseErrors(response.data.errors);
        });
    }
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateAutoComplete = (e, val) => {
    setAutoSelectError(false);

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
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name" //Customize
              required
              fullWidth
              id="name" //Customize
              label="Name" //Customize
              value={formData.name} //Customize
              autoFocus
              onChange={handleChange}
              error={responseErrors?.name}
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
                  onChange={handleChange}
                  error={responseErrors?.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
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
            </Fragment>
          ) : null}

          <Grid item xs={12}>
            <TextField
              name="email" //Customize
              type="email"
              // autoComplete="new-password"
              required
              fullWidth
              id="email" //Customize
              label="Email" //Customize
              value={formData.email} //Customize
              onChange={handleChange}
              error={responseErrors?.email}
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

          <Grid item xs={12} spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: "5px" }}
              onClick={() =>
                updateFormData({ ...formData, roles: rolesList })
              }
            >
              Select All
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => updateFormData({ ...formData, roles: [] })}
            >
              Unselect All
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              // filterSelectedOptions
              id="checkboxes-tags-demo"
              options={rolesList ? rolesList : []}
              value={formData.roles}
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
                  variant="outlined"
                  label="Roles *"
                  placeholder="Select roles for this user."
                  fullWidth
                  helperText="At least one role must be selected."
                  error={autoSelectError}
                />
              )}
              onChange={updateAutoComplete}
            />
          </Grid>
          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.roles?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}
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

export default UsersForm;
