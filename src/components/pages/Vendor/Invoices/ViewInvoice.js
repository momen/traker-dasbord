import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { Button } from "@material-ui/core";
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
  rowContent: {
    // width: "100%",
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
});

function ViewInvoice({ match }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [invoices, setInvoices] = useState("");

  useEffect(() => {
    axios
      .get(`/show/invoices/${match.params.id}`)
      .then((res) => {
        setInvoices(res.data.data);
      })
      .catch(() => {
        alert("Failed to Fetch data");
      });
  }, []);

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/vendor/invoices")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={invoices.id}>
              <StyledTableCell
                component="th"
                scope="row"
                style={{ width: "20%" }}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{invoices.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`order-id${invoices.order_id}`}>
              <StyledTableCell component="th" scope="row">
                Order ID
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.order_id}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`order-number${invoices.order_number}`}>
              <StyledTableCell component="th" scope="row">
                Order Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.order_number}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`vendor-id${invoices.vendor_id}`}>
              <StyledTableCell component="th" scope="row">
                Vendor ID
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.vendor_id}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`vendor-name${invoices.vendor_name}`}>
              <StyledTableCell component="th" scope="row">
                Vendor Name
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.vendor_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`vendor-email${invoices.vendor_email}`}>
              <StyledTableCell component="th" scope="row">
                Vendor Email
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.vendor_email}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`invoice-number${invoices.invoice_number}`}>
              <StyledTableCell component="th" scope="row">
                Invoice Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.invoice_number}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`invoice-total${invoices.invoice_total}`}>
              <StyledTableCell component="th" scope="row">
                Invoice Total
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.invoice_total}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`status-${invoices.status}`}>
              <StyledTableCell component="th" scope="row">
                Status
              </StyledTableCell>
              <StyledTableCell align="left">
                {invoices.status}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewInvoice;
