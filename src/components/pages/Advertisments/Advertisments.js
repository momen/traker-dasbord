import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  FormControlLabel,
  Grid as MuiGrid,
  makeStyles,
  Paper as MuiPaper,
  styled,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Add,
  Delete,
  Edit,
  ExpandMore,
  GetApp,
  Search,
} from "@material-ui/icons";
import { spacing } from "@material-ui/system";
import axios from "../../../axios";
import Popup from "../../Popup";
import AdsForm from "./AdsForm";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Grid = styled(MuiGrid)(spacing);
const Divider = styled(MuiDivider)(spacing);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    wordBreak: "break-word",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanded: {
    "&$expanded": {
      margin: "4px 0",
    },
  },
  button: {
    minWidth: 150,
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    color: "#EF9300",
    background: "#ffffff",
    border: "1px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
  },
  icon: {
    marginLeft: theme.direction === "ltr" ? 10 : 0,
    marginRight: theme.direction === "rtl" ? 10 : 0,
  },
  carouselImg: {
    maxWidth: "100%",
    maxHeight: 100,
    objectFit: "contain",
  },
  btnIcon: {
    marginRight: theme.direction === "ltr" ? 5 : 0,
    marginLeft: theme.direction === "rtl" ? 5 : 0,
  },
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  actionBtn: {
    padding: 5,
    color: "#CCCCCC",
    backgroundColor: "transparent",
    borderRadius: 0,
    "&:hover": {
      color: "#7B7B7B",
      backgroundColor: "transparent",
      borderBottom: "1px solid #7B7B7B",
    },
  },
}));

function Support() {
  const classes = useStyles();
  const { userPermissions, lang } = useSelector((state) => state);
  const { t } = useTranslation();
  const [FAQs, setFAQs] = useState([]);
  const [carouselCarAds, setCarouselCarAds] = useState([]);
  const [carouselCommercialAds, setCarouselCommercialAds] = useState([]);
  const [carouselCarMobileAds, setCarouselCarMobileAds] = useState([]);
  const [carouselCommercialMobileAds, setCarouselCommercialMobileAds] =
    useState([]);
  const [middleCarAds, setMiddleCarAds] = useState([]);
  const [middleCommercialAds, setMiddleCommercialAds] = useState([]);
  // const [middleCarMobileAds, setMiddleCarMobileAds] = useState([]);
  // const [middleCommercialMobileAds, setMiddleCommercialMobileAds] = useState(
  //   []
  // );
  const [bottomCarAds, setBottomCarAds] = useState([]);
  const [bottomCommercialAds, setBottomCommercialAds] = useState([]);
  const [bottomCarMobileAds, setBottomCarMobileAds] = useState([]);
  const [bottomCommercialMobileAds, setBottomCommercialMobileAds] = useState(
    []
  );
  const [adsPositions, setAdsPositions] = useState(null);
  const [carouselId, setCarouselId] = useState(null);
  const [middleId, setMiddleId] = useState(null);
  const [bottomId, setBottomId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Ad");
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const [formInitials, setFormInitials] = useState({});

  //For better UI/UX to have the first letter capitalised incase the First Word was entered in lowercase.
  const uppercaseFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

  const openDeleteConfirmation = (id) => {
    setOpenDeleteDialog(true);
    setItemToDelete(id);
  };

  const DeleteAd = () => {
    axios
      .delete(`/delete/ads/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setRowsToDelete(rowsToDelete.filter((id) => id !== itemToDelete));
      })
      .catch(({ response }) => {
        alert(response.data?.errors);
      });
  };

  async function downloadImage(imageObject) {
    // alert(imageObject.url);
    const image = await fetch(imageObject.image);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = imageObject.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    axios("ads/positions/list")
      .then(({ data }) => {
        const { id: _carouselId } = data.data.find(
          (position) => position.position_name === "carousel"
        );
        const { id: _middleId } = data.data.find(
          (position) => position.position_name === "middle"
        );
        const { id: _bottomId } = data.data.find(
          (position) => position.position_name === "bottom"
        );
        setCarouselId(_carouselId);
        setMiddleId(_middleId);
        setBottomId(_bottomId);
        setAdsPositions(data.data);
      })
      .catch(() => {
        alert("Failed to Fetch Ads Positions List");
      });
  }, []);

  useEffect(() => {
    if (adsPositions) {
      // const { id: carouselId } = adsPositions.find(
      //   (position) => position.position_name === "carousel"
      // );
      // const { id: middleId } = adsPositions.find(
      //   (position) => position.position_name === "middle"
      // );
      // const { id: bottomId } = adsPositions.find(
      //   (position) => position.position_name === "bottom"
      // );

      axios(`show/ads/position/${carouselId}`).then(({ data }) => {
        setCarouselCarAds(
          data.data?.filter((ad) => ad.platform === "web" && ad.cartype_id == 1)
        );
        setCarouselCarMobileAds(
          data.data?.filter(
            (ad) => ad.platform === "mobile" && ad.cartype_id == 1
          )
        );

        setCarouselCommercialAds(
          data.data?.filter((ad) => ad.platform === "web" && ad.cartype_id != 1)
        );
        setCarouselCommercialMobileAds(
          data.data?.filter(
            (ad) => ad.platform === "mobile" && ad.cartype_id != 1
          )
        );
      });
      axios(`show/ads/position/${middleId}`).then(({ data }) => {
        console.log(data.data);
        setMiddleCarAds(data.data?.filter((ad) => ad.cartype_id == 1));

        setMiddleCommercialAds(data.data?.filter((ad) => ad.cartype_id != 1));
      });
      axios(`show/ads/position/${bottomId}`).then(({ data }) => {
        setBottomCarAds(
          data.data?.filter((ad) => ad.platform === "web" && ad.cartype_id == 1)
        );
        setBottomCarMobileAds(
          data.data?.filter(
            (ad) => ad.platform === "mobile" && ad.cartype_id == 1
          )
        );

        setBottomCommercialAds(
          data.data?.filter((ad) => ad.platform === "web" && ad.cartype_id != 1)
        );
        setBottomCommercialMobileAds(
          data.data?.filter(
            (ad) => ad.platform === "mobile" && ad.cartype_id != 1
          )
        );
      });
    }
  }, [searchValue, openPopup, openDeleteDialog, adsPositions, lang]);

  return (
    <>
      <Typography variant="h3" gutterBottom display="inline">
        {t("components.ads.mainHeader")}
      </Typography>

      <Divider my={6} />

      <div style={{ display: "flex", alignItems: "center" }}>
        <b>
          <span style={{ fontSize: "1.05rem" }}>
            {t("components.ads.top.title1")}
          </span>
        </b>
        <img src="/ads-carousel-header.svg" alt="" className={classes.icon} />
      </div>

      <p style={{ fontSize: "1.02rem" }}>
        <u> {t("components.ads.carTypesTitles.car")}</u>
      </p>

      <Grid
        container
        spacing={5}
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.pc_tablet_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {carouselCarAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div
                    className={classes.actionsContainer}
                    onClick={() => downloadImage(ad.photo)}
                  >
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete className={classes.btnIcon} />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit className={classes.btnIcon} />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {carouselCarAds?.length < 6 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: `carousel-car-${carouselCarAds?.length + 1}`,
                      ad_position: carouselId,
                      cartype_id: 1,
                      platform: "web",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.mobile_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {carouselCarMobileAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: 25,
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div
                    className={classes.actionsContainer}
                    onClick={() => downloadImage(ad.photo)}
                  >
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete className={classes.btnIcon} />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit className={classes.btnIcon} />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {carouselCarMobileAds?.length < 6 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: `carousel-car-mobile-${
                        carouselCarMobileAds?.length + 1
                      }`,
                      ad_position: carouselId,
                      cartype_id: 1,
                      platform: "mobile",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>

      <p style={{ fontSize: "1.02rem" }}>
        <u> {t("components.ads.carTypesTitles.commercial")}</u>
      </p>

      <Grid
        container
        spacing={5}
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.pc_tablet_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {carouselCommercialAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div
                    className={classes.actionsContainer}
                    onClick={() => downloadImage(ad.photo)}
                  >
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {carouselCommercialAds.length < 6 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: `carousel-commercial${
                        carouselCommercialAds?.length + 1
                      }`,
                      ad_position: carouselId,
                      cartype_id: 3,
                      platform: "web",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.mobile_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {carouselCommercialMobileAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: 25,
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div
                    className={classes.actionsContainer}
                    onClick={() => downloadImage(ad.photo)}
                  >
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete className={classes.btnIcon} />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit className={classes.btnIcon} />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {carouselCommercialMobileAds?.length < 6 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: `carousel-commercial-mobile${
                        carouselCommercialMobileAds?.length + 1
                      }`,
                      ad_position: carouselId,
                      cartype_id: 3,
                      platform: "mobile",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>

      <div style={{ display: "flex", alignItems: "center" }}>
        <b>
          <span style={{ fontSize: "1.05rem" }}>
            {t("components.ads.middle.title")}
          </span>
        </b>
        <img src="/ads-middle-header.svg" alt="" className={classes.icon} />
      </div>

      <p style={{ fontSize: "1.02rem" }}>
        <u> {t("components.ads.carTypesTitles.car")}</u>
      </p>

      <Grid
        container
        spacing={5}
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        <Grid
          item
          xs={12}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <span>{t("components.ads.middle.device_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={4}>
                {middleCarAds[0] ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={middleCarAds[0].photo?.image}
                      alt=""
                      className={classes.carouselImg}
                    />
                    <div
                      style={{
                        color: "#7B7B7B",
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <div className={classes.actionsContainer}>
                        <GetApp className={classes.btnIcon} />
                        {t("components.ads.downloadBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() =>
                          openDeleteConfirmation(middleCarAds[0].id)
                        }
                      >
                        <Delete />
                        {t("components.ads.deleteBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() => {
                          setSelectedItem(middleCarAds[0]);
                          setOpenPopup(true);
                          setOpenPopupTitle("Edit Ad");
                        }}
                      >
                        <Edit />
                        {t("components.ads.editBtnText")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #CCCCCC",
                      width: "100%",
                      height: "130px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("components.ads.uploadImageText")}
                  </div>
                )}
              </Grid>

              <Grid item xs={4}>
                {middleCarAds[1] ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={middleCarAds[1].photo?.image}
                      alt=""
                      className={classes.carouselImg}
                    />
                    <div
                      style={{
                        color: "#7B7B7B",
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <div className={classes.actionsContainer}>
                        <GetApp className={classes.btnIcon} />
                        {t("components.ads.downloadBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() =>
                          openDeleteConfirmation(middleCarAds[1].id)
                        }
                      >
                        <Delete className={classes.btnIcon} />
                        {t("components.ads.deleteBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() => {
                          setSelectedItem(middleCarAds[1]);
                          setOpenPopup(true);
                          setOpenPopupTitle("Edit Ad");
                        }}
                      >
                        <Edit className={classes.btnIcon} />
                        {t("components.ads.editBtnText")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #CCCCCC",
                      width: "100%",
                      height: "130px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("components.ads.uploadImageText")}
                  </div>
                )}
              </Grid>

              <Grid item xs={4}>
                {middleCarAds[2] ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={middleCarAds[2].photo?.image}
                      alt=""
                      className={classes.carouselImg}
                    />
                    <div
                      style={{
                        color: "#7B7B7B",
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <div className={classes.actionsContainer}>
                        <GetApp className={classes.btnIcon} />
                        {t("components.ads.downloadBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() =>
                          openDeleteConfirmation(middleCarAds[2].id)
                        }
                      >
                        <Delete className={classes.btnIcon} />
                        {t("components.ads.deleteBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() => {
                          setSelectedItem(middleCarAds[2]);
                          setOpenPopup(true);
                          setOpenPopupTitle("Edit Ad");
                        }}
                      >
                        <Edit className={classes.btnIcon} />
                        {t("components.ads.editBtnText")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #CCCCCC",
                      width: "100%",
                      height: "130px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("components.ads.uploadImageText")}
                  </div>
                )}
              </Grid>
            </Grid>
            {middleCarAds?.length < 3 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: `middle-car${middleCarAds?.length + 1}`,
                      ad_position: middleId,
                      cartype_id: 1,
                      platform: "web",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>

        <Grid item xs={12}>
          <p style={{ fontSize: "1.02rem" }}>
            <u> {t("components.ads.carTypesTitles.commercial")}</u>
          </p>
          <span>{t("components.ads.middle.device_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={4}>
                {middleCommercialAds[0] ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={middleCommercialAds[0].photo?.image}
                      alt=""
                      className={classes.carouselImg}
                    />
                    <div
                      style={{
                        color: "#7B7B7B",
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <div className={classes.actionsContainer}>
                        <GetApp className={classes.btnIcon} />
                        {t("components.ads.downloadBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() =>
                          openDeleteConfirmation(middleCommercialAds[0].id)
                        }
                      >
                        <Delete className={classes.btnIcon} />
                        {t("components.ads.deleteBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() => {
                          setSelectedItem(middleCommercialAds[0]);
                          setOpenPopup(true);
                          setOpenPopupTitle("Edit Ad");
                        }}
                      >
                        <Edit className={classes.btnIcon} />
                        {t("components.ads.editBtnText")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #CCCCCC",
                      width: "100%",
                      height: "130px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("components.ads.uploadImageText")}
                  </div>
                )}
              </Grid>

              <Grid item xs={4}>
                {middleCommercialAds[1] ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={middleCommercialAds[1].photo?.image}
                      alt=""
                      className={classes.carouselImg}
                    />
                    <div
                      style={{
                        color: "#7B7B7B",
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <div className={classes.actionsContainer}>
                        <GetApp className={classes.btnIcon} />
                        {t("components.ads.downloadBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() =>
                          openDeleteConfirmation(middleCommercialAds[1].id)
                        }
                      >
                        <Delete className={classes.btnIcon} />
                        {t("components.ads.deleteBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() => {
                          setSelectedItem(middleCommercialAds[1]);
                          setOpenPopup(true);
                          setOpenPopupTitle("Edit Ad");
                        }}
                      >
                        <Edit className={classes.btnIcon} />
                        {t("components.ads.editBtnText")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #CCCCCC",
                      width: "100%",
                      height: "130px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("components.ads.uploadImageText")}
                  </div>
                )}
              </Grid>

              <Grid item xs={4}>
                {middleCommercialAds[2] ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={middleCommercialAds[2].photo?.image}
                      alt=""
                      className={classes.carouselImg}
                    />
                    <div
                      style={{
                        color: "#7B7B7B",
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <div className={classes.actionsContainer}>
                        <GetApp className={classes.btnIcon} />
                        {t("components.ads.downloadBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() =>
                          openDeleteConfirmation(middleCommercialAds[2].id)
                        }
                      >
                        <Delete className={classes.btnIcon} />
                        {t("components.ads.deleteBtnText")}
                      </div>
                      <div
                        className={classes.actionsContainer}
                        onClick={() => {
                          setSelectedItem(middleCommercialAds[2]);
                          setOpenPopup(true);
                          setOpenPopupTitle("Edit Ad");
                        }}
                      >
                        <Edit className={classes.btnIcon} />
                        {t("components.ads.editBtnText")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #CCCCCC",
                      width: "100%",
                      height: "130px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("components.ads.uploadImageText")}
                  </div>
                )}
              </Grid>
            </Grid>
            {middleCommercialAds?.length < 3 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: `middle-car-commercial${
                        middleCommercialAds?.length + 1
                      }`,
                      ad_position: middleId,
                      cartype_id: 3,
                      platform: "web",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>

      <div style={{ display: "flex", alignItems: "center" }}>
        <b>
          <span style={{ fontSize: "1.05rem" }}>
            {t("components.ads.bottom.title")}
          </span>
        </b>
        <img src="/ads-bottom-header.svg" alt="" className={classes.icon} />
      </div>

      <p style={{ fontSize: "1.02rem" }}>
        <u> {t("components.ads.carTypesTitles.car")}</u>
      </p>

      <Grid
        container
        spacing={5}
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.pc_tablet_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {bottomCarAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div className={classes.actionsContainer}>
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete className={classes.btnIcon} />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit className={classes.btnIcon} />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {!bottomCarAds?.length ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: "bottom-car",
                      ad_position: bottomId,
                      cartype_id: 1,
                      platform: "web",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.mobile_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {bottomCarMobileAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: 25,
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div className={classes.actionsContainer}>
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete className={classes.btnIcon} />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit className={classes.btnIcon} />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {!bottomCarMobileAds?.length ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: "bottom-car-mobile",
                      ad_position: bottomId,
                      cartype_id: 1,
                      platform: "mobile",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>

      <p style={{ fontSize: "1.02rem" }}>
        <u> {t("components.ads.carTypesTitles.commercial")}</u>
      </p>

      <Grid
        container
        spacing={5}
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.pc_tablet_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {bottomCommercialAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div className={classes.actionsContainer}>
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete className={classes.btnIcon} />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit className={classes.btnIcon} />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {!bottomCommercialAds?.length ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: "bottom-commercial",
                      ad_position: bottomId,
                      cartype_id: 3,
                      platform: "web",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span>{t("components.ads.top.mobile_size_title")}</span>

          <div
            style={{
              border: "1px solid #CCCCCC",
              marginTop: 10,
              padding: "15px 35px",
              paddingBottom: "30px",
            }}
          >
            {bottomCommercialMobileAds?.map((ad) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: 25,
                }}
              >
                <img
                  src={ad.photo?.image}
                  alt=""
                  className={classes.carouselImg}
                />
                <div
                  style={{
                    color: "#7B7B7B",
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div className={classes.actionsContainer}>
                    <GetApp className={classes.btnIcon} />
                    {t("components.ads.downloadBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => openDeleteConfirmation(ad.id)}
                  >
                    <Delete className={classes.btnIcon} />
                    {t("components.ads.deleteBtnText")}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    onClick={() => {
                      setSelectedItem(ad);
                      setOpenPopup(true);
                      setOpenPopupTitle("Edit Ad");
                    }}
                  >
                    <Edit className={classes.btnIcon} />
                    {t("components.ads.editBtnText")}
                  </div>
                </div>
              </div>
            ))}
            {!bottomCommercialMobileAds?.length ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 35,
                }}
              >
                <Button
                  className={classes.button}
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenPopup(true);
                    setSelectedItem("");
                    setFormInitials({
                      ad_name: "bottom-commercial-mobile",
                      ad_position: bottomId,
                      cartype_id: 3,
                      platform: "mobile",
                    });
                  }}
                >
                  {t("components.ads.addBtnText")}
                </Button>
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>

      <Grid container flex mb={10} alignItems="flex-end">
        {/* <Grid item xs>
          {userPermissions.includes("help_center_create") ? (
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => {
                setOpenPopupTitle("New Frquently asked question");
                setOpenPopup(true);
                setSelectedItem("");
              }}
              startIcon={<Add />}
            >
              New Question
            </Button>
          ) : null}

          {userPermissions.includes("help_center_delete") ? (
            <Button
              color="secondary"
              variant="contained"
              disabled={rowsToDelete.length < 2}
              onClick={() => {
                setOpenMassDeleteDialog(true);
              }}
              style={{ height: 40, borderRadius: 0 }}
            >
              Delete Selected
            </Button>
          ) : null}
        </Grid> */}

        {/* <Grid item xs={3}>
          <Grid container spacing={1}>
            <div
              style={{ width: "100%", display: "flex", alignItems: "flex-end" }}
            >
              <Search />
              <TextField
                id="input-with-icon-grid"
                label="Search"
                onChange={handleSearchInput}
                //   size="small"
                fullWidth
              />
            </div>
          </Grid>
        </Grid> */}
      </Grid>

      <Popup
        title={openPopupTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AdsForm
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
          initialData={formInitials}
        />
      </Popup>

      <Dialog
        open={openDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Ad? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={DeleteAd} color="secondary">
            Yes, delete
          </Button>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            autoFocus
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog
        open={openMassDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all the selected Questions? <br />
            If you wish press Yes, otherwise press Back.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              MassDelete();
            }}
            color="secondary"
          >
            Yes, delete
          </Button>
          <Button
            onClick={() => setOpenMassDeleteDialog(false)}
            color="primary"
            autoFocus
          >
            Back
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}

export default Support;
