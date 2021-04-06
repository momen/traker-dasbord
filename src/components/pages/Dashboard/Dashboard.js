import { Button, Grid } from "@material-ui/core";
import React from "react";
import axios from "../../../axios";
import { useSelector } from "react-redux";
import { green, red } from "@material-ui/core/colors";
import Stats from "./Stats";
// import BarChart from "./BarChart";

function Dashboard() {
  const userToken = useSelector((state) => state.userToken);

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Total Orders"
                amount="24.532"
                chip="Today"
                percentageText="+14%"
                percentagecolor={green[500]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Total Invoices"
                amount="63.200"
                chip="Annual"
                percentageText="-12%"
                percentagecolor={red[500]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Total Products"
                amount="1.320"
                chip="Monthly"
                percentageText="-18%"
                percentagecolor={red[500]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Total Sales"
                amount="12.364"
                chip="Yearly"
                percentageText="+27%"
                percentagecolor={green[500]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7}>
          {/* <BarChart /> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
