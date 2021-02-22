import React, { useRef, useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { PhotoCamera } from "@material-ui/icons";

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
}));

function CategoriesForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    description: itemToEdit ? itemToEdit.description : "",
    photo: "",
  });
  const [imgName, setImgName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append("name", formData.name);
    if (formData.description) {
      data.append("description", formData.description);
    }
    if (formData.photo) {
      data.append("photo", formData.photo, formData.photo.name);
    }

    console.log(itemToEdit.id);
    if (itemToEdit) {
      await axios
        .put(`/product-categories/${itemToEdit.id}`, data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((res) => {
          setOpenPopup(false);
        })
        .catch((res) => {
          console.log(res.response.data.errors);
        });
    } else {
      console.log("------------------------------");
      console.log(data);
      console.log("------------------------------");

      await axios
        .post("/product-categories", data, {
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

  const handleUpload = (e) => {
    const name = e.target.value.replace(/.*[\/\\]/, "");
    setImgName(name);
    console.log(e.target.files[0]);
    updateFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleReset = () => {
    updateFormData({
      name: "",
      description: "",
    });
  };
  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Category Name"
              value={formData.name}
              autoFocus
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="standard-multiline-flexible"
              name="description"
              label="Description"
              variant="outlined"
              multiline
              rowsMax={8}
              value={formData.description}
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <input
              accept="image/*"
              className={classes.uploadInput}
              id="icon-button-file"
              type="file"
              onChange={handleUpload}
            />
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
              <span>{imgName}</span>
            </label>
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

export default CategoriesForm;
