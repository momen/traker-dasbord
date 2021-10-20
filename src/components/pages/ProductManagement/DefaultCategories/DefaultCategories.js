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
import SuccessPopup from "../../../SuccessPopup";
import { RotateLeft } from "@material-ui/icons";

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
  categoryWrapper: {
    border: "1px solid #CCCCCC",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  const [currentNavBarCategories, setCurrentNavBarCategories] = useState({
    car: [],
    commercial: [],
  });
  const [carCategories, setCarCategories] = useState([]);
  const [selectedCarCategories, setSelectedCarCategories] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [commercialCategories, setCommercialCategories] = useState([]);
  const [selectedCommercialCategories, setSelectedCommercialCategories] =
    useState([null, null, null, null, null]);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [mode, setMode] = useState("view");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const closeDialog = () => {
    setInitialFetchDone(false);
    setMode("view");
    setDialogOpen(false);
  };

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    // First get all the available categories for the first level (Level 0)
    if (mode === "view") {
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
            let _carCategories = [...selectedCarCategories];
            car_categories.data.data
              .filter((category) => category.navbar && category.car_navbar)
              .forEach(
                (category, index) =>
                  // Sequence starts from 1 so you have to subtract 1 as the array starts from index 0
                  (_carCategories[category.sequence - 1] = parseInt(
                    category.id
                  ))
              );
            setSelectedCarCategories([..._carCategories]);

            setCommercialCategories(commercial_categories.data.data);
            let _commercialCategories = [...selectedCommercialCategories];
            commercial_categories.data.data
              .filter(
                (category) => category.navbar && category.commercial_navbar
              )
              .forEach(
                (category, index) =>
                  // Sequence starts from 1 so you have to subtract 1 as the array starts from index 0
                  (_commercialCategories[category.sequence - 1] = parseInt(
                    category.id
                  ))
              );
            setSelectedCommercialCategories([..._commercialCategories]);

            setCurrentNavBarCategories({
              car: car_categories.data.data
                .filter((category) => category.navbar && category.car_navbar)
                .sort((current, next) => current.sequence - next.sequence),
              // Filter the selected categories only & sort them according to
              // the sequence key.
              commercial: commercial_categories.data.data
                .filter(
                  (category) => category.navbar && category.commercial_navbar
                )
                .sort((current, next) => current.sequence - next.sequence),
              // Filter the selected categories only & sort them according to
              // the sequence key.
            });
            setInitialFetchDone(true);
          });
        })
        .catch(() => {
          alert("Failed to Fetch data");
        });
    }
  }, [lang, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedCarCategories);
    console.log(selectedCommercialCategories);
    return;
    setIsSubmitting(true);
    Promise.all([
      axios.post("allcategories/mark/navbar", {
        id: 1,
        navbars: JSON.stringify(selectedCarCategories),
      }),
      axios.post("allcategories/mark/navbar", {
        id: 3,
        navbars: JSON.stringify(selectedCommercialCategories),
      }),
    ])
      .then(([carMessage, commercialMessage]) => {
        setDialogText(`${carMessage.data.data}.
        ${commercialMessage.data.data}.`);
        setDialogOpen(true);
        setIsSubmitting(false);
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

        {mode === "view" ? (
          <Grid container spacing={2}>
            <Grid item xs={11} md={9}>
              <Grid container justify="center" spacing={2}>
                {Array(5)
                  .fill(null)
                  .map((dummy, index) => (
                    <Grid item xs={12} sm={6} md={4}>
                      <div className={classes.categoryWrapper}>
                        {lang === "ar"
                          ? currentNavBarCategories.car[index]?.name ||
                            currentNavBarCategories.car[index]?.name_en
                          : currentNavBarCategories.car[index]?.name_en ||
                            currentNavBarCategories.car[index]?.name}
                      </div>
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
                {Array(5)
                  .fill(null)
                  .map((dummy, index) => (
                    <Grid item xs={12} sm={6} md={4}>
                      <div className={classes.categoryWrapper}>
                        {lang === "ar"
                          ? currentNavBarCategories.commercial[index]?.name ||
                            currentNavBarCategories.commercial[index]?.name_en
                          : currentNavBarCategories.commercial[index]
                              ?.name_en ||
                            currentNavBarCategories.commercial[index]?.name}
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.submitButton}
                variant="contained"
                color="primary"
                onClick={() => setMode("edit")}
              >
                {t("global.editBtn")}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={11} md={9}>
                <Grid container justify="center" spacing={2}>
                  {Array(5)
                    .fill(null)
                    .map((id, currentIndex) => (
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          select
                          SelectProps={{
                            native: true,
                          }}
                          value={selectedCarCategories[currentIndex]}
                          onChange={(e) => {
                            let carList = [];
                            carList = selectedCarCategories.map(
                              (categoryId, categoryIndex) =>
                                categoryIndex === currentIndex
                                  ? parseInt(e.target.value) || ""
                                  : categoryId
                            );
                            setSelectedCarCategories([...carList]);
                          }}
                        >
                          <option aria-label="None" value="" />
                          {carCategories?.map((category) =>
                            !selectedCarCategories.includes(category.id) ? (
                              <option value={category.id}>
                                {lang === "ar"
                                  ? category.name || category.name_en
                                  : category.name_en || category.name}
                              </option>
                            ) : selectedCarCategories[currentIndex] ==
                              category.id ? (
                              <option value={category.id}>
                                {lang === "ar"
                                  ? category.name || category.name_en
                                  : category.name_en || category.name}
                              </option>
                            ) : null
                          )}
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
                  {Array(5)
                    .fill(null)
                    .map((id, currentIndex) => (
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          select
                          SelectProps={{
                            native: true,
                          }}
                          value={selectedCommercialCategories[currentIndex]}
                          onChange={(e) => {
                            let commercialList = [];
                            commercialList = selectedCommercialCategories.map(
                              (categoryId, categoryIndex) =>
                                categoryIndex === currentIndex
                                  ? parseInt(e.target.value) || ""
                                  : categoryId
                            );
                            setSelectedCommercialCategories([
                              ...commercialList,
                            ]);
                          }}
                        >
                          <option aria-label="None" value="" />
                          {commercialCategories?.map((category) =>
                            !selectedCommercialCategories.includes(
                              category.id
                            ) ? (
                              <option value={category.id}>
                                {lang === "ar"
                                  ? category.name || category.name_en
                                  : category.name_en || category.name}
                              </option>
                            ) : selectedCommercialCategories[currentIndex] ==
                              category.id ? (
                              <option value={category.id}>
                                {lang === "ar"
                                  ? category.name || category.name_en
                                  : category.name_en || category.name}
                              </option>
                            ) : null
                          )}
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
                    selectedCarCategories.filter((category) => category)
                      .length < 5 ||
                    selectedCommercialCategories.filter((category) => category)
                      .length < 5 ||
                    isSubmitting
                  } // Update on other components
                >
                  {t("global.submitBtn")}
                  {isSubmitting ? (
                    <CircularProgress
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "#EF9300",
                      }}
                    />
                  ) : null}
                </Button>

                <Button
                  className={classes.resetButton}
                  variant="contained"
                  startIcon={<RotateLeft />}
                >
                  {t("global.resetBtn")}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
      <SuccessPopup
        open={dialogOpen}
        setOpen={setDialogOpen}
        message={dialogText}
        handleClose={closeDialog}
      />
    </React.Fragment>
  ) : (
    <div style={{ height: "100%" }}>
      <Loader />
    </div>
  );
}
