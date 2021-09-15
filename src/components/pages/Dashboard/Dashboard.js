import {
  Box,
  Button,
  Card,
  CardContent,
  Divider as MuiDivider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import styled from "styled-components/macro";
import React, { useEffect, useState } from "react";
import axios from "../../../axios";
import { useSelector } from "react-redux";
import { green, red } from "@material-ui/core/colors";
import Stats from "./Stats";
import BarChart from "./BarChart";
import Popup from "../../Popup";
import FilterForm from "./FilterForm";
import { Group, GroupWork, LocalShipping, Warning } from "@material-ui/icons";
import deliveryIcon from "../../imgs/ic-ecommerce-delivery.svg";
import AdminCards from "./AdminCards";
import VendorCards from "./VendorCards";
import { useTranslation } from "react-i18next";
import { spacing } from "@material-ui/system";

const Divider = styled(MuiDivider)(spacing);

const useStyles = makeStyles((theme) => ({
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
  },
  productImg: {
    maxWidth: "95%",
    minHight: 30,
    maxHeight: 30,
  },
}));

function Dashboard() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user, lang } = useSelector((state) => state);
  const [barChartLabels, setBarChartLabels] = useState("");
  const [dashboardInfo, setDashboardInfo] = useState({});
  const [sales, setSales] = useState([]);

  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  const [filterData, updateFilterData] = React.useState({
    from: null,
    to: null,
  });

  useEffect(() => {
    if (user?.roles[0].title === "Vendor") {
      axios("vendor/about/rare/products").then(({ data }) => {
        setLowStockProducts(data.data);
      });
    }
  }, [user]);

  useEffect(() => {
    axios
      .post("/vendor/day/month/filter", filterData)
      .then(({ data }) => {
        setBarChartLabels(data.period_details?.map((detail) => detail.day));
        setDashboardInfo(data);
        setSales(
          data.period_details?.map((detail) => detail.reports.total_sale)
        );
      })
      .catch((res) => {
        alert("Failed to Fetch data");
      });
  }, [filterData, lang]);

  return (
    <>
      <Typography variant="h3" gutterBottom display="inline">
        {t("components.dashboard.title")}
      </Typography>
      <Divider my={6} />
      <Grid container spacing={5}>
        {/* <Grid item xs={12} lg={12}> */}
        {/* {Object.entries(dashboardInfo).map(([key, value]) => {
              if (key === "status_code" || key === "message") return;
              // This is done to reformat the key variable name in a better looking way to display as a title.
              // This should be done as we are using dynamic rendering.
              let title = key.replace("_", (c) => " ");
              title = title.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
              
              return key !== "period_details" ? (
                <Grid item xs={12} md={6} lg={4}>
                <Stats
                title={title}
                amount={value}
                chip="Today"
                percentageText="+14%"
                percentagecolor={green[500]}
                />
                </Grid>
                ) : null;
              })} */}
        {user?.roles[0].title === "Admin" ? (
          <AdminCards cards={dashboardInfo} />
        ) : (
          <VendorCards cards={dashboardInfo} />
        )}
        {/* </Grid> */}

        {/* <Grid item>
        </Grid> */}

        {user?.roles[0].title === "Admin" ? (
          <Grid item xs={12} lg={12}>
            <Button
              className={classes.submitButton}
              variant="outlined"
              onClick={() => setOpenPopup(true)}
            >
              {lang === "ar" ? "تحديد مدة" : "Filter by period"}
            </Button>
            <BarChart
              barChartLabels={barChartLabels}
              sales={sales}
              fromDate={filterData.from}
              toDate={filterData.to}
            />
          </Grid>
        ) : (
          <>
            {user?.roles[0].title !== "Staff" ? (
              <Grid item xs={12} lg={6}>
                <Button
                  className={classes.submitButton}
                  variant="outlined"
                  onClick={() => setOpenPopup(true)}
                >
                  {lang === "ar" ? "تحديد مدة" : "Filter by period"}
                </Button>
                <BarChart
                  barChartLabels={barChartLabels}
                  sales={sales}
                  fromDate={filterData.from}
                  toDate={filterData.to}
                />
              </Grid>
            ) : null}
            <Grid
              item
              xs={12}
              lg={user?.roles[0].title !== "Staff" ? 6 : 12}
              style={{ backgroundColor: "#ffffff" }}
            >
              <Grid container style={{ minHeight: "30px" }} spacing={1}>
                <Grid item xs={2}>
                  <div style={{ height: "30px", textAlign: "center" }}>
                    <img src="ic-shopping-box.svg" alt="" />
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <span>
                    {lang === "ar"
                      ? "مخزون على وشك النفاذ"
                      : "Almost\nout of stock"}
                  </span>
                </Grid>
                <Grid item xs={2}>
                  <div style={{ textAlign: "center" }}>
                    {lang === "ar" ? "متبقي" : "Quantity left"}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Divider />
                </Grid>
              </Grid>
              {lowStockProducts?.map((product, index) => (
                <>
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <div style={{ height: "30px", textAlign: "center" }}>
                        <img
                          className={classes.productImg}
                          src={product.photo[0]?.image}
                          alt={`img-${index + 1}`}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={8}>
                      {lang === "ar"
                        ? product.name || product.name_en
                        : product.name_en || product.name}
                    </Grid>
                    <Grid item xs={2}>
                      <div style={{ color: "#E10000", textAlign: "center" }}>
                        {product.quantity}
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <Divider />
                    </Grid>
                  </Grid>
                </>
              ))}
            </Grid>
          </>
        )}
      </Grid>

      <Popup
        title={t("components.dashboard.filterForm.title")}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <FilterForm
          setOpenPopup={setOpenPopup}
          filterData={filterData}
          updateFilterData={updateFilterData}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
      </Popup>
    </>
  );
}

export default Dashboard;
