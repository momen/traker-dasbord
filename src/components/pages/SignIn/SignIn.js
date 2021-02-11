import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
// import { signIn } from "../../redux/actions/authActions";
import axios from "../../../axios";

import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  TextField as MuiTextField,
  Typography,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { Alert as MuiAlert } from "@material-ui/lab";
import { useStateValue } from "../../../StateProvider";

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

function SignIn() {
  //   const dispatch = useDispatch();
  const history = useHistory();
  const [{ CSRF }, dispatch] = useStateValue();

  useEffect(() => {
    axios.get("/login").then(async (res) => {
      await document
        .getElementById("csrf-token")
        .setAttribute("content", res.data.token);
      console.log(res.data.token);
      dispatch({
        type: "GET_CSRF",
        CSRF: res.data.token,
      });
    });
  }, []);

  return (
    <Wrapper>
      <Helmet title="Sign In" />
      <BigAvatar alt="Lucy" src="/static/img/avatars/avatar-1.jpg" />

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Welcome back!
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Sign in to your account to continue
      </Typography>

      <Formik
        initialValues={{
          email: "",
          password: "",
          _token: "",
          //   submit: false,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string()
            .min(8)
            .max(255)
            .required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          values._token = CSRF;
          try {
            // await dispatch(
            //   signIn({ email: values.email, password: values.password })
            // );

            // console.log(`Form Data: ${values}`);
            console.log(values);
            axios
              .post("/login", values, {
                headers: {
                  // Accept: "application/json",
                  // "Content-Type": "application/json",
                  "X-CSRF-TOKEN": CSRF,
                },
              })
              .then((res) => {
                console.log(res);
              })
              .catch((res) => {
                console.log(`Error: ${res.errors}`);
              });

            // fetch("https://development.lacasacode.dev/api/v1/login", {
            //   method: "POST",
            //   headers: {
            //     Accept: "application/json",
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify(values),
            // })
            //   .then((res) => res.json())
            //   .then((data) => {
            //     console.log(data);
            //   });

            // history.push("/dashborad");
          } catch (error) {
            const message = error.message || "Something went wrong";

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
            {/* {errors.submit && (
              <Alert mt={2} mb={1} severity="warning">
                {errors.submit}
              </Alert>
            )} */}
            <TextField
              type="email"
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
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              value={values.password}
              error={Boolean(touched.password && errors.password)}
              fullWidth
              helperText={touched.password && errors.password}
              onBlur={handleBlur}
              onChange={handleChange}
              my={2}
              required
            />
            <input
              type="hidden"
              name="_token"
              value={CSRF}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Sign in
            </Button>
            <Button
              component={Link}
              to="/auth/reset-password"
              fullWidth
              color="primary"
            >
              Forgot password
            </Button>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default SignIn;
