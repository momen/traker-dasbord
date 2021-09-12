import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../axios";
import { Button, TextField, Chip, Grid } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Fragment } from "react";
import { useSelector } from "react-redux";

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

const useStyles = makeStyles((theme) => ({
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
    wordBreak: "break-word",
  },
  submitButton: {
    width: 150,
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    color: "#EF9300",
    background: "#ffffff",
    border: "1px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
    marginTop: 15,
  },
  solveBtn: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    color: "#90CA28",
    background: "#ffffff",
    border: "1px solid #90CA28",
    borderRadius: 0,
    "&:hover": {
      background: "#90CA28",
      color: "#ffffff",
    },
  },
  productsBadge: {
    minWidth: "fit-content",
    maxWidth: "fit-content",
    background: "#C0D9D9",
    color: "#000000",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
    marginBottom: "5px",
  },
}));

function ViewTicket({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useSelector((state) => state);
  const [ticket, setTicket] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [answer, updateAnswer] = useState("");

  useEffect(() => {
    axios
      .get(`/show/ticket/${match.params.id}`)
      .then((res) => {
        setTicket(res.data.data);
      })
      .catch(() => {
        alert("Failed to Fetch data");
      });
  }, []);

  const addReply = () => {
    setIsSubmitting(true);
    if (user.roles[0].title === "Vendor" || user.roles[0].title === "Manager") {
      axios
        .post("vendor/answer/ticket", {
          ticket_id: ticket.id,
          answer: answer,
        })
        .then(() => {
          axios
            .get(`/show/ticket/${match.params.id}`)
            .then((res) => {
              setTicket(res.data.data);
            })
            .catch(() => {
              alert("Failed to Fetch data");
            });
          alert("Reply added successfully");
        });
    } else if (user.roles[0].title === "Admin") {
      axios
        .post("admin/answer/ticket", {
          ticket_id: ticket.id,
          answer: answer,
        })
        .then(() => {
          axios
            .get(`/show/ticket/${match.params.id}`)
            .then((res) => {
              setTicket(res.data.data);
            })
            .catch(() => {
              alert("Failed to Fetch data");
            });
          alert("Reply added successfully");
        });
    }
  };

  const solveTicket = () => {
    axios
      .post("solved/ticket", {
        id: ticket.id,
      })
      .then(() => {
        alert("Ticket solved successfully");
        axios
          .get(`/show/ticket/${match.params.id}`)
          .then((res) => {
            setTicket(res.data.data);
          })
          .catch(() => {
            alert("Failed to Fetch data");
          });
      })
      .catch(({ response }) => alert(response.data.message));
  };

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
              <StyledTableCell align="left">{ticket.ticket_no}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`title${ticket.title}`}>
              <StyledTableCell component="th" scope="row">
                Title
              </StyledTableCell>
              <StyledTableCell align="left">{ticket.title}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`priority${ticket.priority}`}>
              <StyledTableCell component="th" scope="row">
                Priority
              </StyledTableCell>
              <StyledTableCell align="left">{ticket.priority}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`msg${ticket.id}`}>
              <StyledTableCell component="th" scope="row">
                <span className={classes.rowContent}>Message</span>
              </StyledTableCell>
              <StyledTableCell align="left">{ticket.message}</StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={`attachment${ticket.id}`}>
              <StyledTableCell component="th" scope="row">
                <span className={classes.rowContent}>Attachment</span>
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.attachment ? (
                  <Chip
                    className={classes.chip}
                    // icon={<FaceIcon/>}
                    label={ticket.attachment.file_name}
                    variant="outlined"
                    color="primary"
                    onClick={() => window.open(ticket.attachment.image)}
                  />
                ) : (
                  <b>لم يتم ارفاق صورة</b>
                )}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={`replies-${ticket.id}`}>
              <StyledTableCell component="th" scope="row">
                <span className={classes.rowContent}>Replies</span>
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.comments?.map((comment) => (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Role: {comment.user_role}
                    </span>

                    <span
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {comment.comment}
                    </span>
                  </div>
                ))}
                {((user?.roles[0].title === "Vendor" ||
                  user?.roles[0].title === "Manager") &&
                  ticket.comments?.length < 1 &&
                  ticket.case !== "solved" &&
                  ticket.case !== "to admin") ||
                (user?.roles[0].title === "Admin" &&
                  ticket.case === "to admin") ? (
                  <>
                    <p
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Add Reply:
                    </p>
                    <TextField
                      style={{ backgroundColor: "#ffffff" }}
                      multiline
                      rows={5}
                      variant="outlined"
                      fullWidth
                      value={answer}
                      onChange={(e) => updateAnswer(e.target.value)}
                    />

                    <Button
                      className={classes.submitButton}
                      onClick={addReply}
                      disabled={!answer || isSubmitting}
                    >
                      Submit
                    </Button>
                  </>
                ) : null}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={`status${ticket.id}`}>
              <StyledTableCell component="th" scope="row">
                Status
              </StyledTableCell>
              <StyledTableCell align="left">{ticket.case}</StyledTableCell>
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
            <StyledTableRow key={`order-products-${ticket.order_number}`}>
              <StyledTableCell component="th" scope="row">
                Products
              </StyledTableCell>
              <StyledTableCell
                align="left"
                style={{ display: "flex", overflowWrap: "break-word" }}
              >
                <Grid container spacing={1}>
                  {ticket.orderDetails?.map((order) => (
                    <div
                      key={`product-${order.id}`}
                      className={classes.productsBadge}
                    >
                      {order.product_name}
                    </div>
                  ))}
                </Grid>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`order-payment-${ticket.order_number}`}>
              <StyledTableCell component="th" scope="row">
                Payment Way
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.payment?.payment_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`address-${ticket.id}`}>
              <StyledTableCell component="th" scope="row">
                Shipping Address
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.shipping
                  ? `${ticket.shipping?.street} St. - ${ticket.shipping?.district}, ${ticket.shipping?.city?.city_name}, ${ticket.shipping?.state?.country_name}`
                  : "No Address provided"}
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
            <StyledTableRow key={`user-${ticket.user_id}`}>
              <StyledTableCell component="th" scope="row">
                Username
              </StyledTableCell>
              <StyledTableCell align="left">{ticket.user_name}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`userphone-${ticket.user_phone}`}>
              <StyledTableCell component="th" scope="row">
                User Phone Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {ticket.user_phone}
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
            {/* {user?.roles[0].title === "Admin" ? (
              <StyledTableRow key={`actions`}>
                <StyledTableCell component="th" scope="row">
                  Actions
                </StyledTableCell>
                <StyledTableCell align="left">
                  {ticket.case !== "solved" ? (
                    <Button
                      variant="contained"
                      className={classes.solveBtn}
                      onClick={solveTicket}
                    >
                      Mark as Solved
                    </Button>
                  ) : null}
                </StyledTableCell>
              </StyledTableRow>
            ) : null} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewTicket;
