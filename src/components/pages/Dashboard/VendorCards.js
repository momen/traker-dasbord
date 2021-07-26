import React from "react";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Group, GroupWork, HelpOutline, HourglassEmpty, LocalShipping, MonetizationOn, Money, ShoppingBasket, Warning } from "@material-ui/icons";
import { ShoppingBag } from "react-feather";

const useStyles = makeStyles((theme) => ({
  cardInfo: {
    marginTop: 10,
    marginLeft: 30,
    fontSize: "1.02rem",
  },
}));

export default function VendorCards({ cards }) {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              mb={6}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#00A462",
              }}
            >
              <div style={{ width: 30 }}>
                <HourglassEmpty />
              </div>
              Pending Orders
            </Typography>
            <div className={classes.cardInfo}>
              <div style={{ color: "#7B7B7B" }}>{cards.pending_orders}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              mb={6}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#F3B918",
              }}
            >
              <div style={{ width: 30 }}>
                <ShoppingBasket />
              </div>
              Approved Orders
            </Typography>
            <div className={classes.cardInfo}>
              <div style={{ color: "#7B7B7B" }}>{cards.total_orders}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              mb={6}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#90CA28",
              }}
            >
              <div style={{ width: 30 }}>
                <Money />
              </div>
              Sales
            </Typography>
            <div className={classes.cardInfo}>
              <div style={{ color: "#7B7B7B" }}>{cards.total_sale}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              mb={6}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#AE884B",
              }}
            >
              <div style={{ width: 30 }}>
                <ShoppingBag />
              </div>
              Total Products
            </Typography>
            <div className={classes.cardInfo}>
              <div style={{ color: "#7B7B7B" }}>{cards.total_products}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              mb={6}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#4495CB",
              }}
            >
              <div style={{ width: 30 }}>
                <HelpOutline />
              </div>
              Product Questions
            </Typography>
            <div className={classes.cardInfo}>
              <div style={{ color: "#7B7B7B" }}>{cards.prod_questions}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              mb={6}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#DB5C5C",
              }}
            >
              <div style={{ width: 30 }}>
                <Warning />
              </div>
              Tickets
            </Typography>
            <div className={classes.cardInfo}>
              <div style={{ color: "#7B7B7B" }}>{cards.tickets}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
