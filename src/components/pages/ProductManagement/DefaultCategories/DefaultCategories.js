import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Loader from "../../../Loader";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
  Button as MuiButton,
  makeStyles,
  Grid,
  TextField,
  CircularProgress,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import axios from "../../../../axios";
import { useSelector } from "react-redux";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  headerText: {
    color: "#A8A8A8",
    fontWeight: 600,
    fontSize: "13px",
  },
  vehicleTypeTitle: {
    color: "#424242",
    fontWeight: 600,
    fontSize: "20px",
  },
  submitButton: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    fontWeight: "600",
    color: "#EF9300",
    background: "#ffffff",
    border: "2px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
    margin: theme.spacing(3, 2, 2),
    width: "15%",
  },
}));

export default function DefaultCategories() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userPermissions, lang } = useSelector((state) => state);
  const history = useHistory();
  const [carCategories, setCarCategories] = useState([]);
  const [carCategoriesForm, setCarCategoriesForm] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [commercialCategories, setCommercialCategories] = useState([]);
  const [commercialCategoriesForm, setCommercialCategoriesForm] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [mode, setMode] = useState("view");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    // First get all the available categories for the first level (Level 0)
    axios
      .get(`allcategories`)
      .then(({ data }) => {
        // Filter the categories to have the list of only main categories & exclude the common one.
        const categoriesToDisplay = data.data
          ?.filter((category) => category.top)
          .sort((current, next) => current.id - next.id);
        // Fetch the default categories under these vehicle types (categories)
        // to show in the navbar on the website.
        Promise.all([
          axios(`allcategories/navbarlist/${categoriesToDisplay[0].id}`),
          axios(`allcategories/navbarlist/${categoriesToDisplay[1].id}`),
        ]).then(([car_categories, commercial_categories]) => {
          setCarCategories(car_categories.data.data);
          setCommercialCategories(commercial_categories.data.data);
          setInitialFetchDone(true);
        });
      })
      .catch(() => {
        alert("Failed to Fetch data");
      });
  }, [lang]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    Promise.all([
      axios.post("allcategories/mark/navbar", {
        id: 1,
        navbars: JSON.stringify(carCategoriesForm),
      }),
      axios.post("allcategories/mark/navbar", {
        id: 3,
        navbars: JSON.stringify(commercialCategoriesForm),
      }),
    ])
      .then(([carMessage, commercialMessage]) => {
        setIsSubmitting(false);
        setMode("view");
      })
      .catch();
  };

  return initialFetchDone ? (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        {t("components.navbarCategories.title")}
      </Typography>

      <Divider my={6} />

      <Paper style={{ padding: "30px 50px" }}>
        <p className={classes.headerText}>
          {t("components.navbarCategories.headerText")}
        </p>
        <img src="/Image 33.png" alt="" />

        <p className={classes.vehicleTypeTitle}>
          {t("components.navbarCategories.carCategoriesTitle")}
        </p>

        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={11} md={9}>
              <Grid container justify="center" spacing={2}>
                {carCategoriesForm.map((dummy, index) => (
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      select
                      SelectProps={{
                        native: true,
                      }}
                      onChange={(e) => {
                        let categoriesList = [...carCategoriesForm];
                        console.log(categoriesList);

                        categoriesList[index] = e.target.value || null;
                        console.log(categoriesList);
                        setCarCategoriesForm([...categoriesList]);
                      }}
                    >
                      <option aria-label="None" value="" />
                      {carCategories?.map((category) => (
                        <option value={category.id}>
                          {lang === "ar"
                            ? category.name || category.name_en
                            : category.name_en || category.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={1} md={3}></Grid>

            <Grid item xs={12}>
              <p className={classes.vehicleTypeTitle}>
                {t("components.navbarCategories.commercialCategoriesTitle")}
              </p>
            </Grid>

            <Grid item xs={11} md={9}>
              <Grid container justify="center" spacing={2}>
                {commercialCategoriesForm.map((dummy, index) => (
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      select
                      SelectProps={{
                        native: true,
                      }}
                      value={commercialCategoriesForm[index]}
                      onChange={(e) => {
                        let categoriesList = [...commercialCategoriesForm];
                        categoriesList[index] = e.target.value || null;
                        setCommercialCategoriesForm([...categoriesList]);
                      }}
                    >
                      <option aria-label="None" value="" />
                      {commercialCategories?.map((category) => (
                        <option value={category.id}>
                          {lang === "ar"
                            ? category.name || category.name_en
                            : category.name_en || category.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid xs={12} style={{ marginTop: 20 }}>
              <Button
                className={classes.submitButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  mode === "edit" &&
                  (carCategoriesForm.includes(null) ||
                    commercialCategoriesForm.includes(null) ||
                    isSubmitting)
                } // Update on other components
              >
                {isSubmitting ? (
                  <CircularProgress
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "#EF9300",
                    }}
                  />
                ) : mode === "view" ? (
                  t("global.editBtn")
                ) : (
                  t("global.submitBtn")
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </React.Fragment>
  ) : (
    <div style={{ height: "100%" }}>
      <Loader />
    </div>
  );
}
