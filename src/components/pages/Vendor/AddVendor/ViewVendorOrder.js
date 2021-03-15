import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Fragment } from "react";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
  detailsTable: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
  rowContent: {
    // width: "100%",
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
});

function ViewVendorOrder({ match }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [order, setOrder] = useState([]);

  useEffect(() => {
    console.log(match.params);
    axios
      .get(`/admin/show/vendor/orders/${match.params.id}/${match.params.orderId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setOrder(res.data.data);
      });
  }, []);

  return (
    <Fragment>
      <Container style={{ marginBottom: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push(`/vendor/vendors/${match.params.id}/vendor-orders`)}
        mb={3}
      >
        Back to Vendor Orders
      </Button>
      </Container>
      <Typography variant="h3" gutterBottom display="inline">
        General Information
      </Typography>
      <TableContainer
        component={Paper}
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={order.id}>
              <StyledTableCell
                component="th"
                scope="row"
                style={{ width: "20%" }}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{order.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`order-number${order.order_number}`}>
              <StyledTableCell component="th" scope="row">
                Order Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {order.order_number}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`order-total${order.order_total}`}>
              <StyledTableCell component="th" scope="row">
                Order Total
              </StyledTableCell>
              <StyledTableCell align="left">{order.order_total}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`status${order.orderStatus}`}>
              <StyledTableCell component="th" scope="row">
                Status
              </StyledTableCell>
              <StyledTableCell align="left">
                {order.orderStatus}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`paid`}>
              <StyledTableCell component="th" scope="row">
                Paid
              </StyledTableCell>
              <StyledTableCell align="left">
                {!order ? null : order.paid ? order.paid : "No"}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h3" gutterBottom display="inline">
        Order Details - Cart
      </Typography>
      <Grid container spacing={3}>
        {order.orderDetails?.map((detail) => (
          <Grid item xs={6}>
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table
                className={classes.detailsTable}
                aria-label="customized table"
                size="small"
              >
                <TableBody>
                  <StyledTableRow key={`detail-{detail.id}`}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      style={{ width: "40%" }}
                    >
                      Details ID
                    </StyledTableCell>
                    <StyledTableCell align="left">{detail.id}</StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`product-id-${detail.product_id}`}>
                    <StyledTableCell component="th" scope="row">
                      Product ID
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.product_id}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`product-name${detail.product_name}`}>
                    <StyledTableCell component="th" scope="row">
                      Product Name
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.product_name}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`detail-${detail.id}-quantity-${detail.quantity}`}>
                    <StyledTableCell component="th" scope="row">
                      Quantity
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.quantity}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`detail-${detail.id}-price-${detail.price}`}>
                    <StyledTableCell component="th" scope="row">
                      Price
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.price}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`detail-${detail.id}-discount-${detail.discount}`}>
                    <StyledTableCell component="th" scope="row">
                      Discount
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      %{detail.discount}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`detail-${detail.id}-total-${detail.total}`}>
                    <StyledTableCell component="th" scope="row">
                      Total
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.total}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`store-id${detail.store_id}`}>
                    <StyledTableCell component="th" scope="row">
                      Store ID
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.store_id}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`store-name${detail.store_name}`}>
                    <StyledTableCell component="th" scope="row">
                      Store Name
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.store_name}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`vendor-id${detail.vendor_id}`}>
                    <StyledTableCell component="th" scope="row">
                      Vendor ID
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.vendor_id}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key={`vendor-name${detail.vendor_name}`}>
                    <StyledTableCell component="th" scope="row">
                      Vendor Name
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {detail.vendor_name}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

export default ViewVendorOrder;
