import React, { useRef, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";

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

function CarModelForm({ setPage, setOpenPopup, itemToEdit, carMades }) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    carmodel: itemToEdit ? itemToEdit.carmodel : "",
    carmade_id: itemToEdit ? itemToEdit.carmade_id : "",
  });

  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (itemToEdit) {
      axios
        .put(`/car-models/${itemToEdit.id}`, formData)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setResponseErrors(response.data.errors);
        });
    } else {
      axios
        .post("/car-models", formData)
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

  const handleReset = () => {
    updateFormData({
      carmodel: "",
      carmade_id: "",
    });
    setResponseErrors("");
  };
  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="carmodel"
              required
              fullWidth
              id="carmodel"
              label="Car Model Name"
              value={formData.carmodel}
              autoFocus
              onChange={handleChange}
              error={responseErrors?.carmodel}
            />
          </Grid>
          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.carmodel?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              {
                <TextField
                  id="standard-select-currency-native"
                  select
                  label="Select Car Made"
                  value={formData.carmade_id}
                  name="carmade_id"
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Please select a Category"
                  fullWidth
                  required
                  error={responseErrors?.carmade_id}
                >
                  <option aria-label="None" value="" />
                  {carMades?.map((carMade) => (
                    <option value={carMade.id}>{carMade.car_made}</option>
                  ))}
                </TextField>
              }
            </FormControl>
          </Grid>
          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.carmade_id?.map((msg) => (
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

export default CarModelForm;
