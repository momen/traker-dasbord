import React, { useRef, useState } from "react";
import {
  Button,
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
  uploadInput: {
    display: "none",
  },
}));

function UsersForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  //Customize
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    email: itemToEdit ? itemToEdit.email : "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (itemToEdit) {
      //Customize
      await axios
        .put(`/users/${itemToEdit.id}`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          // setPage(1);
          setOpenPopup(false);
        })
        .catch((res) => {
          console.log(res.response.data.errors);
        });
    } else {
      //Customize
      await axios
        .post("/users", formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setPage(1);
          setOpenPopup(false);
        })
        .catch((res) => {
          console.log(res.response.data.errors);
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
      title: "", //Customize
    });
  };
  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name" //Customize
              variant="outlined"
              required
              fullWidth
              id="name" //Customize
              label="Name" //Customize
              value={formData.name} //Customize
              autoFocus
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="email" //Customize
              variant="outlined"
              required
              fullWidth
              id="email" //Customize
              label="Email" //Customize
              value={formData.email} //Customize
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

export default UsersForm;
