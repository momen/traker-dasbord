import React, { useRef, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
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
}));

function CreateCarMade({ setPage, setOpenPopup }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    car_made: "",
    category: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/car-mades", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setPage(1);
        setOpenPopup(false);
      })
      .catch((res) => {
        console.log(res.response.data.errors);
      });
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    formRef.current.reset();
  };
  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="car_made"
              variant="outlined"
              required
              fullWidth
              id="car_made"
              label="Car Made"
              autoFocus
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <TextField
                id="standard-select-currency-native"
                select
                label="Native select"
                value={formData.category}
                name="category"
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select a Category"
                fullWidth
              >
                <option aria-label="None" value="" />
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </TextField>
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

export default CreateCarMade;
