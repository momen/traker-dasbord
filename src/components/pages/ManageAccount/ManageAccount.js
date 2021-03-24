import React from "react";
import * as Yup from "yup";
import styled from "styled-components/macro";
import { Formik } from "formik";
import EmailForm from "./EmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  TextField as MuiTextField,
  Typography,
} from "@material-ui/core";

import { Alert as MuiAlert } from "@material-ui/lab";

import { spacing } from "@material-ui/system";

import { Helmet } from "react-helmet";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const timeOut = (time) => new Promise((res) => setTimeout(res, time));

const initialValues = {
  firstName: "Lucy",
  lastName: "Lavender",
  email: "lucylavender@gmail.com",
  password: "mypassword123",
  confirmPassword: "mypassword123",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  password: Yup.string()
    .min(12, "Must be at least 12 characters")
    .max(255)
    .required("Required"),
  confirmPassword: Yup.string().when("password", {
    is: (val) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref("password")],
      "Both password need to be the same"
    ),
  }),
});

function ChangePassword() {
  return (
    <React.Fragment>
      <Helmet title="User Profile" />
      <Typography variant="h3" gutterBottom display="inline">
        Manage Account
      </Typography>

      <Divider my={6} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <EmailForm />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ChangePasswordForm />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Delete Account
          </Typography>
          <Divider my={3} />
          <form action="">
            <Button type="submit" variant="contained" color="secondary" mt={3}>
              Delete Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default ChangePassword;
