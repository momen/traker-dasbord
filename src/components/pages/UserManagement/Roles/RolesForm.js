import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

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

function RolesForm({ setPage, setOpenPopup, itemToEdit, permissionsList }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();

  //Customize
  const [formData, updateFormData] = useState({
    title: itemToEdit ? itemToEdit.title : "",
    permissions: itemToEdit
      ? itemToEdit.permissions.map(({ id, title }) => ({ id, title }))
      : [],
  });

  const [autoSelectError, setAutoSelectError] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.permissions.length === 0) {
      setAutoSelectError(true);
      return;
    }

    setAutoSelectError(false);

    const data = {
      title: formData.title,
      permissions: formData.permissions,
    };

    data.permissions = data.permissions.map((permission) => permission.id);
    data.permissions = JSON.stringify(data.permissions); //VI

    console.log(formData.permissions);

    if (itemToEdit) {
      //Customize
      await axios
        .put(`/roles/${itemToEdit.id}`, data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          // setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setResponseErrors(response.data.errors);
        });
    } else {
      console.log(formData);
      //Customize
      await axios
        .post("/roles", data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
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
    setResponseErrors("");
  };

  const updateAutoComplete = (e, val) => {
    if(autoSelectError){
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
      permissions: []
    });
  };
  return (
    <div className={classes.paper}>
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
              onChange={handleChange}
              error={responseErrors?.title}
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

          <Grid item xs={12}>
            <Autocomplete
              multiple
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
                  variant="outlined"
                  label="Permissions *"
                  placeholder="Select permissions for this role"
                  fullWidth
                  helperText="At least one permission must be selected."
                  error={autoSelectError}
                />
              )}
              onChange={updateAutoComplete}
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

export default RolesForm;
