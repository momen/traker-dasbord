import React, { useRef, useState } from "react";
import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { PhotoCamera } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { CloseIcon } from "@material-ui/data-grid";

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
  uploadButton: {
    margin: theme.spacing(3, 2, 2),
  },
  uploadInput: {
    display: "none",
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
  },
}));

function VendorsForm({ setPage, setOpenPopup, itemToEdit, users }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    vendor_name: itemToEdit ? itemToEdit.vendor_name : "",
    email: itemToEdit ? itemToEdit.email : "",
    type: itemToEdit ? itemToEdit.type : "",
    userid_id: itemToEdit ? itemToEdit.userid_id : "",
    images: "",
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [imgName, setImgName] = useState("");
  const [responseErrors, setResponseErrors] = useState("");

  console.log(itemToEdit);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.images && !itemToEdit) {
      setOpenAlert(true);
    } else {
      let data = new FormData();
      data.append("vendor_name", formData.vendor_name);
      data.append("email", formData.email);
      data.append("type", formData.type);
      data.append("userid_id", formData.userid_id);

      
      data.append("images", formData.images);
      console.log(data);
      if (itemToEdit) {
        await axios
          .post(`/add-vendors/${itemToEdit.id}`, data, {
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
        console.log(formData.images);

        await axios
          .post("/add-vendors", data, {
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
    }
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = (e) => {
    const name = e.target.value.replace(/.*[\/\\]/, "");
    setImgName(name);
    console.log(e.target.files[0]);
    updateFormData({
      ...formData,
      images: e.target.files[0],
    });
    setOpenAlert(false);
  };

  //Customize
  const handleReset = () => {
    updateFormData({
      vendor_name: "",
      email: "",
      type:"",
      userid_id:"",
      images:"",
    });
    setResponseErrors("");
    setImgName("");
    setOpenAlert(false);
  };
  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="vendor_name"
              // variant="outlined"
              required
              fullWidth
              id="vendor_name"
              label="Vendor Name"
              value={formData.vendor_name}
              autoFocus
              onChange={handleChange}
              error={responseErrors?.vendor_name}
            />
          </Grid>

          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.vendor_name?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              // variant="outlined"
              type="email"
              required
              value={formData.email}
              fullWidth
              onChange={handleChange}
              error={responseErrors?.email}
            />
          </Grid>

          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.email?.map((msg) => (
                <div className={classes.errorsContainer}>
                  <span key={msg} className={classes.errorMsg}>
                    {msg}
                  </span>
                </div>
              ))}
            </Grid>
          ) : null}

          <Grid>
            <FormControl component="fieldset">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                aria-label="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Vendor"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Hot Sale"
                />
                <FormControlLabel value="3" control={<Radio />} label="Both" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.type?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <FormControl>
              {
                <TextField
                  id="standard-select-currency-native"
                  select
                  label="User"
                  value={formData.userid_id}
                  name="userid_id"
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Please select a User"
                  fullWidth
                  required
                  error={responseErrors?.userid_id}
                >
                  <option aria-label="None" value="" />

                  {Object.entries(users)?.map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </TextField>
              }
            </FormControl>
          </Grid>

          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.userid_id?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}

          <FormControl className={classes.formControl}>
            <Grid item xs={12}>
              <div style={{display:'flex'}}>
              <div>
                <input
                  accept="image/*"
                  className={classes.uploadInput}
                  id="icon-button-file"
                  type="file"
                  onChange={handleUpload}
                />
              </div>
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
                  // width: "350px",
                  // display: "block",
                  // overflow: "hidden",
                  // whiteSpace: "noWarp",
                  // lineHeight: 1,
                  // textOverflow: "ellipsis",
                  // textDecoration: "none",
                }}
              >
                {imgName}
              </span>
              </div>
            </Grid>
          </FormControl>

          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.images?.map((msg) => (
                <p key={msg} className={classes.errorMsg}>
                  {msg}
                </p>
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
                  At least 1 Image required!
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

export default VendorsForm;