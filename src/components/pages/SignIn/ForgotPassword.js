import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import axios from "../../../axios";

import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  TextField as MuiTextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { Alert as MuiAlert } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { Login } from "../../../actions";
import SuccessPopup from "../../SuccessPopup";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)}px;
  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

const BigAvatar = styled(Avatar)`
  width: 92px;
  height: 92px;
  text-align: center;
  margin: 0 auto ${(props) => props.theme.spacing(5)}px;
`;

export default function ForgotPassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const closeDialog = () => {
    setDialogOpen(false);
    history.push("/sign-in");
  };

  return (
    <Wrapper>
      <Helmet title="Reset Password" />
      {/* <BigAvatar alt="Lucy" src="/static/img/avatars/avatar-1.jpg" /> */}

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Forgot your password?
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Send a request to your email for a new one.
      </Typography>

      <Formik
        initialValues={{
          email: "",
          // _token: "",
          //   submit: false,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Please enter a valid Email.")
            .max(255)
            .required("Email is required."),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          // values._token = CSRF;
          try {
            axios
              .post("/user/forget/password", values, {
                headers: {
                  // Accept: "application/json",
                  // "Content-Type": "application/json",
                  // "X-CSRF-TOKEN": CSRF,
                },
              })
              .then(async ({ data }) => {
                setDialogText(
                  data.message ||
                    data.data ||
                    "Request made successfully, please follow the link on your email"
                );
                setDialogOpen(true);
              })
              .catch(({ response }) => {
                const message =
                  response.data?.errors ||
                  response.data?.error ||
                  response.data?.message ||
                  "Something went wrong";

                setStatus({ success: false });
                setErrors({ submit: message });
                setSubmitting(false);
              });
          } catch (error) {
            const message = "Couldn't reset password, this is a local error";

            setStatus({ success: false });
            setErrors({ submit: message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            {/* <Alert mt={3} mb={1} severity="info">
              Use <strong>demo@bootlab.io</strong> and{" "}
              <strong>unsafepassword</strong> to sign in
            </Alert> */}
            {errors.submit && (
              <Alert mt={2} mb={1} severity="error">
                {errors.submit}
              </Alert>
            )}
            <TextField
              id="signIn__email"
              name="email"
              label="Email Address"
              value={values.email}
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              onBlur={handleBlur}
              onChange={handleChange}
              my={2}
              required
              autoFocus
            />
            <Button
              style={{ marginTop: 20 }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Reset Password
            </Button>
            <Button component={Link} to="/sign-in" fullWidth color="primary">
              Login
            </Button>
          </form>
        )}
      </Formik>
      <SuccessPopup
        open={dialogOpen}
        setOpen={setDialogOpen}
        message={dialogText}
        handleClose={closeDialog}
      />
    </Wrapper>
  );
}
