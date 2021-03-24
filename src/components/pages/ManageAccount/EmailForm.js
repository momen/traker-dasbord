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
  Grid,
  Divider as MuiDivider,
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

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
});

export default function BasicForm() {
  const [{ user }] = useStateValue();

  const initialValues = {
    name: user.name,
    email: user.email,
  };

  const handleSubmit = async (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    axios
      .post("edit/profile", values)
      .then((response) => {
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
      })
      .catch(({ response }) => {
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
              My Profile
            </Typography>
            <Divider my={3} />

            {status && status.sent && (
              <Alert severity="success" my={3}>
                Your profile has been updated successfully!
              </Alert>
            )}

            {isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <form md={6} onSubmit={handleSubmit}>
                <TextField
                  name="name"
                  label="Username"
                  value={values.name}
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  variant="outlined"
                  my={2}
                />

                <TextField
                  name="email"
                  label="Email"
                  value={values.email}
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  variant="outlined"
                  my={2}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Update Profile
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </Formik>
  );
}
