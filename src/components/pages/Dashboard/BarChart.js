import React from "react";
import styled, { withTheme } from "styled-components/macro";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  IconButton,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import "./roundedBarCharts";
import { Bar, defaults } from "react-chartjs-2";

import { MoreVertical } from "react-feather";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;

const ChartWrapper = styled.div`
  height: 237px;
  width: 100%;
`;

const BarChart = ({ theme, barChartLabels, sales, fromDate, toDate }) => {
  const firstDatasetColor = "#90CA28";
  const secondDatasetColor =
    theme.palette?.type === "dark"
      ? "rgba(255, 255, 255, 0.5)"
      : "rgba(0, 0, 0, 0.1)";

  const data = {
    labels: barChartLabels,
    datasets: [
      // {
      //   label: "Mobile",
      //   backgroundColor: firstDatasetColor,
      //   borderColor: firstDatasetColor,
      //   hoverBackgroundColor: firstDatasetColor,
      //   hoverBorderColor: firstDatasetColor,
      //   data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
      //   barPercentage: 1,
      //   categoryPercentage: 0.5,
      // },
      {
        label: "Sales",
        backgroundColor: firstDatasetColor,
        borderColor: firstDatasetColor,
        hoverBackgroundColor: secondDatasetColor,
        hoverBorderColor: secondDatasetColor,
        data: sales,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cornerRadius: 2,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
          },
          stacked: true,
          ticks: {
            // stepSize: 100,
            fontColor: theme.palette?.text.secondary,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
          gridLines: {
            color: "transparent",
          },
          ticks: {
            fontColor: theme.palette?.text.secondary,
          },
        },
      ],
    },
  };

  return (
    <Card mb={3}>
      <CardHeader
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertical />
        //   </IconButton>
        // }
        title="Sales"
      />
      <CardHeader
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertical />
        //   </IconButton>
        // }
        title={
          fromDate && toDate
            ? `Period: ${fromDate} ~ ${toDate}`
            : "Period: Last 30 days"
        }
      />
      <CardContent>
        <ChartWrapper>
          <Bar data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(BarChart);
