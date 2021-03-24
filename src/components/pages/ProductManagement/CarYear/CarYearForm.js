import React, { useRef, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";

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

function CarYearForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    year: itemToEdit ? itemToEdit.year : "",
  });

  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (itemToEdit) {
      axios
        .put(`/car-years/${itemToEdit.id}`, formData)
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch(({ response }) => {
          setResponseErrors(response.data.errors);
        });
    } else {
      axios
        .post("/car-years", formData)
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
    let value = e.target.value;
    if((value < 0)){
      value = 1960;
    }

    if((value > new Date().getFullYear() + 1)){
      value = new Date().getFullYear() + 1; 
    }

    updateFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleReset = () => {
    updateFormData({
      year: "",
    });
    setResponseErrors("");
  };
  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="year"
              type="number"
              required
              fullWidth
              id="year"
              label="Car Year"
              value={formData.year}
              autoFocus
              onChange={handleChange}
              error={responseErrors?.year}
            />
          </Grid>
          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.year?.map((msg) => (
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

export default CarYearForm;
