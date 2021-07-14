import { Button, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "../../../axios";
import { useSelector } from "react-redux";
import { green, red } from "@material-ui/core/colors";
import Stats from "./Stats";
import BarChart from "./BarChart";
import Popup from "../../Popup";
import FilterForm from "./FilterForm";

function Dashboard() {
  // const userToken = useSelector((state) => state.userToken);
  const [barChartLabels, setBarChartLabels] = useState("");
  const [dashboardInfo, setDashboardInfo] = useState({});
  const [sales, setSales] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  const [filterData, updateFilterData] = React.useState({
    from: null,
    to: null,
  });

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
  }, [filterData]);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={2}>
            {Object.entries(dashboardInfo).map(([key, value]) => {
              if (key === "status_code" || key === "message") return;
              // This is done to reformat the key variable name in a better looking way to display as a title.
              // This should be done as we are using dynamic rendering.
              let title = key.replace("_", (c) => " ");
              title = title.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

              return key !== "period_details" ? (
                <Grid item xs={12} md={6} lg={3}>
                  <Stats
                    title={title}
                    amount={value}
                    chip="Today"
                    percentageText="+14%"
                    percentagecolor={green[500]}
                  />
                </Grid>
              ) : null;
            })}
          </Grid>
        </Grid>

        <Grid item>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setOpenPopup(true)}
          >
            Filter
          </Button>
        </Grid>

        <Grid item xs={12} lg={12}>
          <BarChart
            barChartLabels={barChartLabels}
            sales={sales}
            fromDate={filterData.from}
            toDate={filterData.to}
          />
        </Grid>
      </Grid>

      <Popup
        title="Filter Sales by period"
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
