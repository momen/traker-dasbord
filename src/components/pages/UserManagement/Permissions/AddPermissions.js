import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import { useStateValue } from "../../../../StateProvider";
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
}));

function AddPermissions({ setPage, setOpenPopup }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    title: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/permissions", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        alert("Permission Created");
        setPage(1);
        setOpenPopup(false)
      })
      .catch((res) => {
        console.log(res.response.data.errors);
      });
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.toLowerCase(),
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
              name="title"
              variant="outlined"
              required
              fullWidth
              id="title"
              label="Title"
              autoFocus
              onChange={handleChange}
            />
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

export default AddPermissions;
