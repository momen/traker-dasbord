import React from "react";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  Group,
  GroupWork,
  HelpOutline,
  HourglassEmpty,
  LocalShipping,
  MonetizationOn,
  Money,
  ShoppingBasket,
  Warning,
} from "@material-ui/icons";
import { ShoppingBag } from "react-feather";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  cardInfo: {
    marginTop: 10,
    marginLeft: 30,
    fontSize: "1.02rem",
  },
}));

export default function VendorCards({ cards }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state);

  return (
    // <Grid container spacing={2}>
    <>
      {user?.roles[0].title !== "Staff" ? (
        <>
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
                  {t(`components.dashboard.vendor.pendingOrders`)}
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
                  {t(`components.dashboard.vendor.approvedOrders`)}
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
                  {t(`components.dashboard.vendor.sales`)}
                </Typography>
                <div className={classes.cardInfo}>
                  <div style={{ color: "#7B7B7B" }}>
                    {new Intl.NumberFormat().format(cards.total_sale)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </>
      ) : null}

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
              {t(`components.dashboard.vendor.products`)}
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
              {t(`components.dashboard.vendor.questions`)}
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
              {t(`components.dashboard.vendor.tickets`)}
            </Typography>
            <div className={classes.cardInfo}>
              <div style={{ color: "#7B7B7B" }}>{cards.tickets}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </>
    // </Grid>
  );
}
