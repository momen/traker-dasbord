import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "../axios";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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

function AddForm({
  user,
  setUsers,
  setUsersCount,
  rowsPerPage,
  page,
  order,
  orderBy,
}) {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(
    user ? user.birth_date : new Date("1990-01-01T21:11:54")
  );
  const formRef = useRef();
  const [formData, updateFormData] = useState({
    first_name: user ? user.first_name : "",
    last_name: user ? user.last_name : "",
    email: user ? user.email : "",
    birth_date: selectedDate,
    birth_date_display: moment(selectedDate).format("L"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      await axios
        .post("/user/add", {
          ...formData,
          created_date_display: moment().format("MMM Do YYYY, h:mm:ss a"),
        })
        .then((res) => {
          alert(res.data);
        });
      await axios.get("/user/count").then((res) => {
        setUsersCount(parseInt(res.data));
      });
    } else {
      await axios
        .put(`/user/${user._id}/edit`, {
          params: {
            userData: formData,
          },
        })
        .then((res) => {
          alert(res.data);
        });
    }
    axios
      .get("user/paginate", {
        params: {
          recordsPerPage: rowsPerPage,
          pageNumber: page,
          order: order,
          orderBy: orderBy,
        },
      })
      .then((res) => {
        setUsers(res.data);
      });
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  const handleReset = () => {
    setSelectedDate(new Date("1990-01-01T21:11:54"));
    formRef.current.reset();
  };

  const handleDate = (date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format("L");
    updateFormData({
      ...formData,
      birth_date: date,
      birth_date_display: formattedDate,
    });
  };

  return (
    <div className={classes.paper}>
      <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="first_name"
              variant="outlined"
              required
              fullWidth
              id="first_name"
              label="First Name"
              defaultValue={user?.first_name}
              autoFocus
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              defaultValue={user?.last_name}
              autoComplete="lname"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="email"
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              defaultValue={user?.email}
              autoComplete="email"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                name="birth_date"
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                label="Date of Birth"
                value={selectedDate}
                onChange={handleDate}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Grid container justify="center">
          {!user ? (
            <Button
              className={classes.button}
              variant="contained"
              onClick={handleReset}
            >
              Reset
            </Button>
          ) : (
            <></>
          )}
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Grid>
      </form>
    </div>
  );
}

export default AddForm;
