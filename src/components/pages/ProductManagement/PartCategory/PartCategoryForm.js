import React, { useRef, useState } from "react";
import {
  Button,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { PhotoCamera } from "@material-ui/icons";
import { CloseIcon } from "@material-ui/data-grid";
import { Alert } from "@material-ui/lab";

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

function PartCategoryForm({ setPage, setOpenPopup, itemToEdit }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  const formRef = useRef();
  const [formData, updateFormData] = useState({
    category_name: itemToEdit ? itemToEdit.category_name : "",
  });
  const [imgName, setImgName] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async (e) => {
    let data = new FormData();
    e.preventDefault();
    if (!formData.photo && !itemToEdit) {
      setOpenAlert(true);
    } else {
      data.append("category_name", formData.category_name);
      if (formData.photo) {
        data.append("photo", formData.photo, formData.photo.name);
      }

      // To be edited if an image will be added
      if (itemToEdit) {
        console.log(itemToEdit.id);
        await axios
          .put(`/part-categories/${itemToEdit.id}`, formData, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              // "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          })
          .then((res) => {
            setOpenPopup(false);
          })
          .catch((res) => {
            setResponseErrors(res.response.data.errors);
          });
      } else {
        await axios
          .post("/part-categories", data, {
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
      photo: e.target.files[0],
    });
    setOpenAlert(false);
  };

  const handleReset = () => {
    updateFormData({
      category_name: "",
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
              name="category_name"
              required
              fullWidth
              id="category_name"
              label="Part Category Name"
              value={formData.category_name}
              autoFocus
              onChange={handleChange}
              error={responseErrors?.category_name}
            />
          </Grid>

          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.category_name?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
              ))}
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <div style={{ display: "flex" }}>
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

          {responseErrors ? (
            <Grid item xs={12}>
              {responseErrors.photo?.map((msg) => (
                <span key={msg} className={classes.errorMsg}>
                  {msg}
                </span>
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
                  Please upload an Image.
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

export default PartCategoryForm;
