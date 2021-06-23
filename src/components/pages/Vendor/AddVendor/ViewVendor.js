import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
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
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
  attributeName: {
    width: "15%",
  },
  rowContent: {
    // display: "inline-block",
    width: "100%",
    // whiteSpace: "normal",
    wordBreak: "break-word",
  },
  media: {
    width: "25%",
    objectFit: "contain",
  },
  button: {
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
    },
    marginRight: "5px",
  },
});

function ViewVendor({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [vendor, setVendor] = useState("");
  const [vendorTypes, setVendorTypes] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [itemToReject, setItemToReject] = useState("");
  const [reason, setReason] = useState("");

  const openRejectionConfirmation = (fieldId) => {
    setItemToReject(fieldId);
    setOpenDialog(true);
  };

  const approveVendor = () => {
    axios
      .post("admin/approve/vendor", {
        vendor_id: vendor.id,
      })
      .then(() => {
        axios.get(`/add-vendors/${match.params.id}`).then((res) => {
          setVendor(res.data.data);
        });
      })
      .catch(({ response }) => alert(response.data.errors));
  };

  const declineVendor = () => {
    axios
      .post("admin/decline/vendor", {
        vendor_id: vendor.id,
      })
      .then(() => {
        axios.get(`/add-vendors/${match.params.id}`).then((res) => {
          setVendor(res.data.data);
        });
      })
      .catch(({ response }) => alert(response.data.errors));
  };

  const rejectInfo = (e) => {
    e.preventDefault();
    axios
      .post("admin/reject/vendor", {
        vendor_id: vendor.id,
        reason,
        commented_field: itemToReject,
      })
      .then(() => {
        setOpenDialog(false);
        alert("Field Rejected Successfully");
      })
      .catch(({ response }) => alert(response.data.errors));
  };

  useEffect(() => {
    axios.get(`/add-vendors/${match.params.id}`).then((res) => {
      setVendor(res.data.data);
    });

    axios
      .get(`/add-vendors/get/types`)
      .then((res) => {
        setVendorTypes(res.data.data);
      })
      .catch(() => {
        alert("Failed to Fetch data");
      });
  }, []);

  const uppercaseWords = (str) =>
    str?.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/vendor/vendors")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={vendor.id}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{vendor.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.serial}>
              <StyledTableCell component="th" scope="row">
                Serial
              </StyledTableCell>
              <StyledTableCell align="left">{vendor.serial}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.vendor_name}>
              <StyledTableCell component="th" scope="row">
                Vendor
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{vendor.vendor_name}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.email}>
              <StyledTableCell component="th" scope="row">
                Email
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{vendor.email}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.company_name}>
              <StyledTableCell component="th" scope="row">
                Company Name
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.company_name ? (
                  <span className={classes.rowContent}>
                    {vendor.company_name}
                  </span>
                ) : (
                  <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                    Not provided yet
                  </span>
                )}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.type}>
              <StyledTableCell component="th" scope="row">
                Type
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.type == 1
                  ? "Retailer"
                  : vendor.type == 2
                  ? "Wholesaler"
                  : vendor.type == 3
                  ? "Retailer & Wholesaler"
                  : "Unkown"}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.commercial_no}>
              <StyledTableCell component="th" scope="row">
                Status
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.complete &&
                !vendor.approved &&
                !vendor.declined &&
                !vendor.rejected
                  ? "Pending, checking the provided Information"
                  : !vendor.complete
                  ? "Missing Information or Documents"
                  : vendor.approved
                  ? "Approved"
                  : vendor.declined
                  ? "Request Declined"
                  : vendor.rejected
                  ? "Request Terminated"
                  : null}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.commercial_no}>
              <StyledTableCell component="th" scope="row">
                Commercial Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.commercial_no ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {vendor.commercial_no}
                    <Button
                      style={{
                        width: "fit-content",
                        margin: "5px 15px",
                        marginLeft: "0px",
                      }}
                      color="secondary"
                      variant="contained"
                      onClick={() => openRejectionConfirmation(1)}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                    Not provided yet
                  </span>
                )}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                Commercial Document
              </StyledTableCell>
              <StyledTableCell align="left">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {vendor.commercialDocs?.file_name}
                  {vendor.commercialDocs?.image ? (
                    <div style={{ display: "flex" }}>
                      <Button
                        style={{
                          width: "fit-content",
                          margin: "5px 15px",
                          marginLeft: "0px",
                        }}
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          window.open(vendor.commercialDocs?.image)
                        }
                      >
                        View Document
                      </Button>
                      <Button
                        style={{
                          width: "fit-content",
                          margin: "5px 15px",
                          marginLeft: "0px",
                        }}
                        color="secondary"
                        variant="contained"
                        onClick={() => openRejectionConfirmation(2)}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                      Not provided yet
                    </span>
                  )}
                </div>
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={vendor.tax_card_no}>
              <StyledTableCell component="th" scope="row">
                Tax Card Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.tax_card_no ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {vendor.tax_card_no}
                    <Button
                      style={{
                        width: "fit-content",
                        margin: "5px 15px",
                        marginLeft: "0px",
                      }}
                      color="secondary"
                      variant="contained"
                      onClick={() => openRejectionConfirmation(3)}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                    Not provided yet
                  </span>
                )}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                Tax Document
              </StyledTableCell>
              <StyledTableCell align="left">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {vendor.taxCardDocs?.file_name}
                  {vendor.taxCardDocs?.image ? (
                    <>
                      <Button
                        style={{ width: "fit-content", margin: "5px 0" }}
                        color="primary"
                        variant="contained"
                        onClick={() => window.open(vendor.taxCardDocs?.image)}
                      >
                        View Document
                      </Button>
                      <Button
                        style={{
                          width: "fit-content",
                          margin: "5px 15px",
                          marginLeft: "0px",
                        }}
                        color="secondary"
                        variant="contained"
                        onClick={() => openRejectionConfirmation(4)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                      Not provided yet
                    </span>
                  )}
                </div>
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                Wholesale Document
              </StyledTableCell>
              <StyledTableCell align="left">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span> {vendor.wholesaleDocs?.file_name}</span>
                  {vendor.wholesaleDocs?.image ? (
                    <>
                      <Button
                        style={{ width: "fit-content", margin: "5px 0" }}
                        color="primary"
                        variant="contained"
                        onClick={() => window.open(vendor.wholesaleDocs?.image)}
                      >
                        View Document
                      </Button>
                      <Button
                        style={{
                          width: "fit-content",
                          margin: "5px 15px",
                          marginLeft: "0px",
                        }}
                        color="secondary"
                        variant="contained"
                        onClick={() => openRejectionConfirmation(9)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                      Not provided yet
                    </span>
                  )}
                </div>
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={vendor.bank_account}>
              <StyledTableCell component="th" scope="row">
                Bank Account
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.bank_account ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {vendor.bank_account}
                    <Button
                      style={{
                        width: "fit-content",
                        margin: "5px 15px",
                        marginLeft: "0px",
                      }}
                      color="secondary"
                      variant="contained"
                      onClick={() => openRejectionConfirmation(5)}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                    Not provided yet
                  </span>
                )}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                Bank Document
              </StyledTableCell>
              <StyledTableCell align="left">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {vendor.bankDocs?.file_name}
                  {vendor.bankDocs?.image ? (
                    <>
                      <Button
                        style={{ width: "fit-content", margin: "5px 0" }}
                        color="primary"
                        variant="contained"
                        onClick={() => window.open(vendor.bankDocs?.image)}
                      >
                        View Document
                      </Button>
                      <Button
                        style={{
                          width: "fit-content",
                          margin: "5px 15px",
                          marginLeft: "0px",
                        }}
                        color="secondary"
                        variant="contained"
                        onClick={() => openRejectionConfirmation(6)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span style={{ color: "#ff6700", fontWeight: "bold" }}>
                      Not provided yet
                    </span>
                  )}
                </div>
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={`vendor-logo`}>
              <StyledTableCell component="th" scope="row">
                Logo
              </StyledTableCell>
              <StyledTableCell align="left">
                <img
                  src={vendor.images?.image}
                  alt={vendor.images?.file_name}
                  className={classes.media}
                />
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={`vendor-logo`}>
              <StyledTableCell component="th" scope="row">
                Actions
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.complete ? (
                  <>
                    {!vendor.approved ? (
                      <Button
                        variant="contained"
                        className={classes.button}
                        onClick={approveVendor}
                      >
                        Approve Vendor
                      </Button>
                    ) : null}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={declineVendor}
                    >
                      Decline Request
                    </Button>
                  </>
                ) : null}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Vendor Approval"}</DialogTitle>
        <form onSubmit={rejectInfo}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p style={{ maxWidth: " 20vw" }}>
                Are you sure you want to reject this field?, if so please
                provide a reason for that.
              </p>
              <TextField
                multiline
                fullWidth
                required
                onChange={(e) => setReason(e.target.value)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="secondary">
              Yes
            </Button>
            <Button
              onClick={() => setOpenDialog(false)}
              color="primary"
              autoFocus
            >
              No
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}

export default ViewVendor;
