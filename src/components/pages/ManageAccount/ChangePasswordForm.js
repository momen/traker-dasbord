import * as Yup from "yup";
import styled from "styled-components/macro";
import { Formik } from "formik";
import axios from "../../../axios";

import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@material-ui/core";

import { Alert as MuiAlert } from "@material-ui/lab";

import { spacing } from "@material-ui/system";
import { useStateValue } from "../../../StateProvider";

const Divider = styled(MuiDivider)(spacing);

const Card = styled(MuiCard)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const timeOut = (time) => new Promise((res) => setTimeout(res, time));

const initialValues = {
  password: "",
  password_confirmation: "",
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .max(255)
    .required("Required"),
  password_confirmation: Yup.string().when("password", {
    is: (val) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref("password")],
      "Both password need to be the same"
    ),
  }),
});

export default function BasicForm() {
  const [{ user }] = useStateValue();

  const handleSubmit = async (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    axios
      .post("change/password", values)
      .then((response) => {
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
      })
      .catch(({response}) => {
        setStatus({ sent: false });
        setErrors({ submit: response.data.errors });
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        status,
      }) => (
        <Card mb={6}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider my={3} />

            {status && status.sent && (
              <Alert severity="success" my={3}>
                Your password has been changed successfully!
              </Alert>
            )}

            {isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  name="password"
                  label="Password"
                  value={values.password}
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  variant="outlined"
                  my={2}
                />

                <TextField
                  name="password_confirmation"
                  label="Confirm password"
                  value={values.confirmPassword}
                  error={Boolean(
                    touched.password_confirmation &&
                      errors.password_confirmation
                  )}
                  fullWidth
                  helperText={
                    touched.password_confirmation &&
                    errors.password_confirmation
                  }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  variant="outlined"
                  my={2}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Change Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </Formik>
  );
}
