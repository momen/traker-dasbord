import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import axios from "../../../../axios";
import Map from "../../../Map/Map";
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
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
  },
}));

function StoresForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    address: itemToEdit ? itemToEdit.address : "",
    moderator_name: itemToEdit ? itemToEdit.moderator_name : "",
    moderator_phone: itemToEdit ? itemToEdit.moderator_phone : "",
    moderator_alt_phone: itemToEdit ? itemToEdit.moderator_alt_phone : "",
    lat: itemToEdit ? itemToEdit.lat : "",
    long: itemToEdit ? itemToEdit.long : "",
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [imgName, setImgName] = useState("");
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itemToEdit) {
      await axios
        .post(`/update/stores/${itemToEdit.id}`, formData)
        .then((res) => {
          setOpenPopup(false);
        })
        .catch((res) => {
          setResponseErrors(res.response.data.errors);
        });
    } else {
      await axios
        .post("/add/stores", formData)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch((res) => {
          setResponseErrors(res.response.data.errors);
        });
    }
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //Customize
  const handleReset = () => {
    updateFormData({
      vendor_name: "",
      email: "",
      type: "",
      userid_id: "",
      images: "",
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
                label="Name"
                value={formData.name}
                onChange={handleChange}
                error={responseErrors?.name}
                autoFocus
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
                name="moderator_name"
                required
                fullWidth
                id="moderator_name"
                label="Moderator Name"
                value={formData.moderator_name}
                onChange={handleChange}
                error={responseErrors?.moderator_name}
              />

              {responseErrors ? (
                <div className={classes.inputMessage}>
                  {responseErrors.moderator_name?.map((msg) => (
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
              <NumberFormat
                name="moderator_phone"
                required
                fullWidth
                format="+966 ### ### ###"
                mask="_ "
                allowEmptyFormatting
                customInput={TextField}
                id="moderator_phone"
                label="Moderator Phone"
                value={formData.moderator_phone}
                onChange={handleChange}
                error={responseErrors?.moderator_phone}
              />

              {responseErrors ? (
                <div className={classes.inputMessage}>
                  {responseErrors.moderator_phone?.map((msg) => (
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
              <NumberFormat
                name="moderator_alt_phone"
                fullWidth
                format="+966 ### ### ###"
                mask="_ "
                allowEmptyFormatting
                customInput={TextField}
                id="moderator_alt_phone"
                label="Moderator Alternative Phone"
                value={formData.moderator_alt_phone}
                onChange={handleChange}
                error={responseErrors?.moderator_alt_phone}
              />

              {responseErrors ? (
                <div className={classes.inputMessage}>
                  {responseErrors.moderator_alt_phone?.map((msg) => (
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
              <TextField
                name="address"
                required
                fullWidth
                id="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                error={responseErrors?.address}
              />

              {responseErrors ? (
                <div className={classes.inputMessage}>
                  {responseErrors.address?.map((msg) => (
                    <span key={msg} className={classes.errorMsg}>
                      {msg}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Grid>

          <Grid item>
            <label htmlFor="stores-map" style={{ marginTop: "10px" }}>
              Select your store location
            </label>
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              height: "60vh",
              position: "relative",
              marginBottom: "10px",
            }}
          >
            <div style={{ height: "60vh" }}>
              <Map
                id="stores-map"
                lattitude={formData.lat ? parseFloat(formData.lat) : null}
                longitude={formData.long ? parseFloat(formData.long) : null}
                formData={formData}
                updateFormData={updateFormData}
              />
            </div>
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

export default StoresForm;
