import React, { useRef, useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "../../../axios";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
  uploadButton: {
    margin: theme.spacing(3, 2, 2),
  },
  errorsContainer: {
    marginBottom: theme.spacing(1),
  },
  errorMsg: {
    color: "#ff0000",
    fontWeight: "500",
  },
}));

const validationSchema = Yup.object().shape({
  from: Yup.date().required("Please select a starting date").nullable(),
  to: Yup.date()
    .min(Yup.ref("from"), "This date can't be eariler than the starting one")
    .required("Please select an ending date")
    .nullable(),
  stock: Yup.string(),
  part_category: Yup.string(),
});

function FAQ_Form({
  setOpenPopup,
  filterData,
  updateFilterData,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  vendors,
  products,
  stores,
  partCategories,
  isAdmin,
  setuserIsSearching,
}) {
  const classes = useStyles();

  const formRef = useRef();
  const [formData, updateFormData] = useState(filterData);
  const [newFromDate, setNewFromDate] = useState(fromDate);
  const [newToDate, setNewToDate] = useState(toDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseErrors, setResponseErrors] = useState("");

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    setFromDate(newFromDate);
    setToDate(newToDate);
    setuserIsSearching(false);
    updateFilterData({
      ...formData,
      from: newFromDate?.toISOString().slice(0, 10),
      to: newToDate?.toISOString().slice(0, 10),
    });
    setOpenPopup(false);
  };

  const handleStateChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    updateFormData({
      from: null,
      to: null,
      vendor: null,
      part_category: null,
      stock: null,
      product: null,
      sale_type: null,
    });
    setNewFromDate(null);
    setNewToDate(null);
    setResponseErrors("");
  };

  return (
    <div className={classes.paper}>
      <Formik
        initialValues={{
          from: fromDate,
          to: toDate,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          touched,
          values,
          status,
          resetForm,
        }) => (
          <form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12} sm={6}>
                  <div style={{ width: "100%" }}>
                    <KeyboardDatePicker
                      name="from"
                      fullWidth
                      disableToolbar
                      disableFuture
                      autoOk={true}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-from"
                      label="From *"
                      value={newFromDate}
                      onChange={(date) => {
                        setFieldValue("from", date);
                        setNewFromDate(date);
                        // updateFormData({
                        //   ...formData,
                        //   from: date.toISOString().slice(0, 10),
                        // });
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.from ||
                        Boolean(touched.from && errors.from)
                      }
                      helperText={touched.from && errors.from}
                      KeyboardButtonProps={{
                        "aria-label": "from date",
                      }}
                      InputProps={{ readOnly: true }}
                    />
                    {responseErrors ? (
                      <div className={classes.inputMessage}>
                        {responseErrors.from?.map((msg) => (
                          <span key={msg} className={classes.errorMsg}>
                            {msg}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <div style={{ width: "100%" }}>
                    <KeyboardDatePicker
                      name="to"
                      fullWidth
                      disableToolbar
                      disableFuture
                      autoOk={true}
                      minDate={newFromDate}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-to"
                      label="To *"
                      value={newToDate}
                      onChange={(date) => {
                        setFieldValue("to", date);
                        setNewToDate(date);
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.to || Boolean(touched.to && errors.to)
                      }
                      helperText={touched.to && errors.to}
                      KeyboardButtonProps={{
                        "aria-label": "to date",
                      }}
                      InputProps={{ readOnly: true }}
                    />
                    {responseErrors ? (
                      <div className={classes.inputMessage}>
                        {responseErrors.to?.map((msg) => (
                          <span key={msg} className={classes.errorMsg}>
                            {msg}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Grid>
              </MuiPickersUtilsProvider>
              {isAdmin ? (
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <TextField
                      select
                      label="Vendor"
                      value={formData.vendor}
                      name="vendor"
                      onChange={(e) => {
                        handleChange(e);
                        handleStateChange(e);
                      }}
                      SelectProps={{
                        native: true,
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.vendor ||
                        Boolean(touched.vendor && errors.vendor)
                      }
                      helperText="Please select a Vendor"
                      fullWidth
                    >
                      <option aria-label="None" value="" />
                      {vendors?.map((vendor) => (
                        <option value={vendor.id}>{vendor.vendor_name}</option>
                      ))}
                    </TextField>

                    {responseErrors ? (
                      <div className={classes.inputMessage}>
                        {responseErrors.vendor?.map((msg) => (
                          <span key={msg} className={classes.errorMsg}>
                            {msg}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Grid>
              ) : null}

              <Grid item xs={12} sm={6} md={4}>
                <div>
                  <TextField
                    select
                    label="Product"
                    value={formData.product}
                    name="product"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.product ||
                      Boolean(touched.product && errors.product)
                    }
                    helperText="Please select a Product"
                    fullWidth
                  >
                    <option aria-label="None" value="" />
                    {products?.map((product) => (
                      <option value={product.id}>{product.name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.product?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <div>
                  <TextField
                    select
                    label="Store"
                    value={formData.stock}
                    name="stock"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.stock ||
                      Boolean(touched.stock && errors.stock)
                    }
                    helperText="Please select a Store"
                    fullWidth
                  >
                    <option aria-label="None" value="" />
                    {stores?.map((store) => (
                      <option value={store.id}>{store.name}</option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.stock?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <div>
                  <TextField
                    select
                    label="Part Category"
                    value={formData.part_category}
                    name="part_category"
                    onChange={(e) => {
                      handleChange(e);
                      handleStateChange(e);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    onBlur={handleBlur}
                    error={
                      responseErrors?.part_category ||
                      Boolean(touched.part_category && errors.part_category)
                    }
                    helperText="Please select a Part Category"
                    fullWidth
                  >
                    <option aria-label="None" value="" />
                    {partCategories?.map((partCategory) => (
                      <option value={partCategory.id}>
                        {partCategory.category_name}
                      </option>
                    ))}
                  </TextField>

                  {responseErrors ? (
                    <div className={classes.inputMessage}>
                      {responseErrors.part_category?.map((msg) => (
                        <span key={msg} className={classes.errorMsg}>
                          {msg}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Grid>

              {isAdmin ? (
                <Grid item xs={12} sm={6} md={4}>
                  <div>
                    <TextField
                      select
                      label="Sale Type"
                      value={formData.sale_type}
                      name="sale_type"
                      onChange={(e) => {
                        handleChange(e);
                        handleStateChange(e);
                      }}
                      SelectProps={{
                        native: true,
                      }}
                      onBlur={handleBlur}
                      error={
                        responseErrors?.sale_type ||
                        Boolean(touched.sale_type && errors.sale_type)
                      }
                      helperText="Please select a Type"
                      fullWidth
                    >
                      <option aria-label="None" value="" />
                      <option aria-label="Vendor" label="Vendor" value="1" />
                      <option
                        aria-label="ًWholesale"
                        label="Wholesale"
                        value="2"
                      />
                    </TextField>

                    {responseErrors ? (
                      <div className={classes.inputMessage}>
                        {responseErrors.sale_type?.map((msg) => (
                          <span key={msg} className={classes.errorMsg}>
                            {msg}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Grid>
              ) : null}
            </Grid>

            {typeof responseErrors === "string" ? (
              <Grid item xs={12}>
                <span key={`faluire-msg`} className={classes.errorMsg}>
                  {responseErrors}
                </span>
              </Grid>
            ) : null}
            <Grid container justify="center">
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Submit
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                onClick={() => {
                  handleReset();
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default FAQ_Form;
