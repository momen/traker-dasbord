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
  LocalShipping,
  Money,
  NotificationImportant,
  Warning,
} from "@material-ui/icons";
import { ShoppingBag } from "react-feather";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  multiInfoCard: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    fontSize: "1.02rem",
  },
  singleInfoCard: {
    marginTop: 10,
    marginLeft: 30,
    fontSize: "1.02rem",
  },
}));

export default function AdminCards({ cards }) {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#F67830",
              }}
            >
              <Typography
                variant="h6"
                mb={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: 30 }}>
                  <GroupWork />
                </div>
                {t(`components.dashboard.admin.vendors`)}
              </Typography>
              {parseInt(cards.pending_vendors) > 0 ? (
                <NotificationImportant
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push(`/vendor/pending-vendors`)}
                />
              ) : null}
            </div>
            <div className={classes.multiInfoCard}>
              <span style={{ color: "#7B7B7B" }}>
                <span style={{ color: "#F67830" }}>
                  {t(`components.dashboard.admin.total`)}&emsp;
                </span>
                {cards.actual_vendors}
              </span>

              <span style={{ color: "#7B7B7B" }}>
                <span style={{ color: "#F67830" }}>
                  {t(`components.dashboard.admin.pending`)}&emsp;
                </span>
                {cards.pending_vendors}
              </span>
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
                color: "#17DF4C",
              }}
            >
              <div style={{ width: 30 }}>
                <Group />
              </div>
              {t(`components.dashboard.admin.clients`)}
            </Typography>
            <div className={classes.singleInfoCard}>
              <div style={{ color: "#7B7B7B" }}>{cards.total_customers}</div>
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
                color: "#98A9FF",
              }}
            >
              <div style={{ width: 30 }}>
                <ShoppingBag />
              </div>
              {t(`components.dashboard.admin.products`)}
            </Typography>
            <div className={classes.singleInfoCard}>
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
                color: "#90CA28",
              }}
            >
              <div style={{ width: 30 }}>
                <Money />
              </div>
              {t(`components.dashboard.admin.sales`)}
            </Typography>
            <div className={classes.multiInfoCard}>
              <span style={{ color: "#7B7B7B" }}>
                <b style={{ color: "#90CA28" }}>
                  {t(`components.dashboard.admin.total`)}&nbsp;&nbsp;
                </b>
                {new Intl.NumberFormat().format(cards.total_sale)}
              </span>

              <span style={{ color: "#7B7B7B" }}>
                <b style={{ color: "#90CA28" }}>
                  {t(`components.dashboard.admin.wholesaleSales`)}&nbsp;&nbsp;
                </b>
                {new Intl.NumberFormat().format(cards.wholesale_total_sale)}
              </span>
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
                color: "#C5B152",
              }}
            >
              <div style={{ width: 30 }}>
                <LocalShipping />
                {/* <img src={deliveryIcon} alt="" /> */}
              </div>
              {t(`components.dashboard.admin.wholesaleOrders`)}
            </Typography>
            <div className={classes.multiInfoCard}>
              <span style={{ color: "#7B7B7B" }}>
                <span style={{ color: "#C5B152" }}>
                  {t(`components.dashboard.admin.total`)}&emsp;
                </span>
                {cards.wholesale_orders}
              </span>

              <span style={{ color: "#7B7B7B" }}>
                <span style={{ color: "#C5B152" }}>
                  {t(`components.dashboard.admin.pending`)}&emsp;
                </span>
                {cards.pending_wholesale_orders}
              </span>
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
              {t(`components.dashboard.admin.tickets`)}
            </Typography>
            <div className={classes.singleInfoCard}>
              <div style={{ color: "#7B7B7B" }}>{cards.tickets}</div>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
