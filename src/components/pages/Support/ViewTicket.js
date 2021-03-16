import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../axios";
import { useStateValue } from "../../../StateProvider";
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

function ViewTicket({ match }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [ticket, setTicket] = useState("");

  useEffect(() => {
    axios
      .get(`/show/ticket/${match.params.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTicket(res.data.data);
      });
  }, []);

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/support")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={ticket.id}>
              <StyledTableCell
                component="th"
                scope="row"
                style={{ width: "20%" }}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{ticket.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`ticket-no${ticket.ticket_no}`}>
              <StyledTableCell component="th" scope="row">
                Ticket Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.ticket_no}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`title${ticket.title}`}>
              <StyledTableCell component="th" scope="row">
                Title
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.title}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`priority${ticket.priority}`}>
              <StyledTableCell component="th" scope="row">
                Priority
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.priority}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`msg${ticket.id}`}>
              <StyledTableCell component="th" scope="row">
                Message
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.message}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`status${ticket.id}`}>
              <StyledTableCell component="th" scope="row">
                Status
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.status}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`category${ticket.category_id}`}>
              <StyledTableCell component="th" scope="row">
                Category Name
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.category_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`created${ticket.created_at}`}>
              <StyledTableCell component="th" scope="row">
                Created At
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.created_at}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`order-number-${ticket.order_number}`}>
              <StyledTableCell component="th" scope="row">
                Order Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.order_number}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`vendor-name-${ticket.vendor_name}`}>
              <StyledTableCell component="th" scope="row">
                Vendor Name
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.vendor_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`vendor-email-${ticket.vendor_email}`}>
              <StyledTableCell component="th" scope="row">
                Vendor Email
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.vendor_email}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`user-${ticket.user_id}`}>
              <StyledTableCell component="th" scope="row">
                Username
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.user_name}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewTicket;
