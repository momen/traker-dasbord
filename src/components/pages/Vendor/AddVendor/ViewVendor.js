import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import {
  Button,
  Collapse,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Fragment } from "react";
import { ArrowBack } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SuccessPopup from "../../../SuccessPopup";
import Loader from "../../../Loader";

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

const useStyles = makeStyles((theme) => ({
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
  backBtn: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#424242",
    fontWeight: "bold",
    "&:hover": {
      color: "#7B7B7B",
    },
  },
  backIcon: {
    marginRight: theme.direction === "rtl" ? 0 : 5,
    marginLeft: theme.direction === "rtl" ? 5 : 0,
  },
  viewDocumentButton: {
    height: 30,
    fontFamily: `"Almarai", sans-serif`,
    // fontWeight: "500",
    color: "#EF9300",
    background: "#ffffff",
    border: "1px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
  },
  approveBtn: {
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
    marginRight: "15px",
  },
  rejectBtn: {
    height: 40,
    marginRight: "15px",
    fontFamily: `"Almarai", sans-serif`,
    color: "#F8CF00",
    background: "#ffffff",
    border: "1px solid #F8CF00",
    borderRadius: 0,
    "&:hover": {
      background: "#F8CF00",
      color: "#ffffff",
    },
  },
  declineBtn: {
    height: 40,
    marginRight: "15px",
    fontFamily: `"Almarai", sans-serif`,
    color: "#CA2828",
    background: "#ffffff",
    border: "1px solid #CA2828",
    borderRadius: 0,
    "&:hover": {
      background: "#CA2828",
      color: "#ffffff",
    },
  },
  submitBtn: {
    width: 150,
    height: 40,
    marginTop: 20,
    fontFamily: `"Almarai", sans-serif`,
    color: "#EF9300",
    background: "#ffffff",
    border: "1px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
  },
}));

const CustomCheckbox = withStyles({
  root: {
    color: "#EF9300",
    "&$checked": {
      color: "#EF9300",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function ViewVendor({ match }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { user, lang } = useSelector((state) => state);
  const [vendor, setVendor] = useState(null);
  const [vendorTypes, setVendorTypes] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [itemToReject, setItemToReject] = useState("");
  const [itemsToReject, setItemsToReject] = useState([]);
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState("");

  const rejectionList = [
    { id: 9, fieldEn: "Wholesale Document", fieldAr: "تصريح تاجر الجملة" },
    { id: 8, fieldEn: "Company Name", fieldAr: "إسم الشركة" },
    { id: 1, fieldEn: "Commercial No.", fieldAr: "رقم السجل التجاري" },
    { id: 2, fieldEn: "Commercial Document", fieldAr: "المستند التجاري" },
    { id: 3, fieldEn: "Tax Card No.", fieldAr: "رقم البطاقة الضريبية" },
    { id: 4, fieldEn: "Tax Document", fieldAr: "المستند الضريبي" },
    { id: 5, fieldEn: "Bank Account", fieldAr: "رقم الحساب البنكي" },
    { id: 6, fieldEn: "Bank Document", fieldAr: "المستند البنكي" },
  ];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState();

  const closeDialog = () => {
    setDialogOpen(false);
    window.scrollTo(0, 0);
  };

  const openRejectionConfirmation = (fieldId) => {
    setItemToReject(fieldId);
    setOpenDialog(true);
  };

  const selectRejection = (e) => {
    if (e.target.checked) {
      setItemsToReject([...itemsToReject, e.target.value]);
    } else {
      setItemsToReject(itemsToReject.filter((item) => item != e.target.value));
    }
  };

  const approveVendor = () => {
    setLoading(true);
    setLoadingBtn("approve");
    axios
      .post("admin/approve/vendor", {
        vendor_id: vendor.id,
      })
      .then(({ data }) => {
        setDialogText(data.message || data || "Vendor approved successfully.");
        setDialogOpen(true);
        axios.get(`/add-vendors/${match.params.id}`).then(({ data }) => {
          setVendor(data.data);
        });
      })
      .catch(({ response }) => alert(response.data.errors))
      .finally(() => {
        setLoading(false);
        setLoadingBtn("");
      });
  };

  const declineVendor = () => {
    setLoading(true);
    setLoadingBtn("decline");
    axios
      .post("admin/decline/vendor", {
        vendor_id: vendor.id,
      })
      .then(({ data }) => {
        alert(data?.message || data || "Vendor declined successfully.");
        history.goBack();
      })
      .catch(({ response }) => alert(response.data.errors))
      .finally(() => {
        setLoading(false);
        setLoadingBtn("");
      });
  };

  const rejectInfo = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingBtn("reject");
    axios
      .post("admin/reject/vendor", {
        vendor_id: vendor.id,
        reason,
        commented_field: JSON.stringify(itemsToReject),
      })
      .then(({ data }) => {
        setOpenDialog(false);
        setDialogText(
          data.message || data || "Vendor info rejected successfully."
        );
        setDialogOpen(true);
        setReason("");
        setItemsToReject([]);
        setIsRejecting(false);
        axios.get(`/add-vendors/${match.params.id}`).then((res) => {
          setVendor(res.data.data);
        });
      })
      .catch(({ response }) => alert(response.data.errors))
      .finally(() => {
        setLoading(false);
        setLoadingBtn("");
      });
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

  useEffect(() => {
    console.log(itemsToReject);
  }, [itemsToReject]);
  const uppercaseWords = (str) =>
    str?.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

  return vendor ? (
    <Fragment>
      {/* <Button variant="contained" color="primary" mb={3}>
        Back to list
      </Button> */}

      <div className={classes.backBtn} onClick={() => history.goBack()}>
        <ArrowBack className={classes.backIcon} />
        <span>Back</span>
      </div>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={vendor.commercial_no}>
              <StyledTableCell component="th" scope="row">
                Status
              </StyledTableCell>
              <StyledTableCell>
                {vendor.vendorStatus === "approved" ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      color: "#90CA28",
                      border: "1px solid #90CA28",
                      width: "fit-content",
                      height: 30,
                    }}
                  >
                    Approved
                  </span>
                ) : vendor.vendorStatus === "incomplete" ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                      color: "#FFA920",
                      border: "1px solid #FFA920",
                      width: "fit-content",
                      height: 30,
                    }}
                  >
                    Incomplete
                  </span>
                ) : vendor.vendorStatus === "invalid info" ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                      color: "#CA2828",
                      border: "1px solid #CA2828",
                      width: "fit-content",
                      height: 30,
                    }}
                  >
                    Invalid Info
                  </span>
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                      color: "#98A9FF",
                      border: "1px solid #98A9FF",
                      width: "fit-content",
                      height: 30,
                    }}
                  >
                    Pending
                  </span>
                )}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.id}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell>{vendor.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.serial}>
              <StyledTableCell component="th" scope="row">
                Serial
              </StyledTableCell>
              <StyledTableCell>{vendor.serial}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.vendor_name}>
              <StyledTableCell component="th" scope="row">
                Vendor
              </StyledTableCell>
              <StyledTableCell>
                <span className={classes.rowContent}>{vendor.vendor_name}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.company_name}>
              <StyledTableCell component="th" scope="row">
                Company Name
              </StyledTableCell>
              <StyledTableCell>
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
            <StyledTableRow key={vendor.email}>
              <StyledTableCell component="th" scope="row">
                Email
              </StyledTableCell>
              <StyledTableCell>
                <span className={classes.rowContent}>{vendor.email}</span>
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={user?.phone_no}>
              <StyledTableCell component="th" scope="row">
                Phone Number
              </StyledTableCell>
              <StyledTableCell>
                <span className={classes.rowContent}>{vendor?.phone}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={user?.gender}>
              <StyledTableCell component="th" scope="row">
                Gender
              </StyledTableCell>
              <StyledTableCell>
                <span
                  className={classes.rowContent}
                  style={{ textTransform: "capitalize" }}
                >
                  {vendor?.gender}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={user?.birthdate}>
              <StyledTableCell component="th" scope="row">
                Date of birth
              </StyledTableCell>
              <StyledTableCell>
                <span className={classes.rowContent}>
                  {vendor?.date_of_birth}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.type}>
              <StyledTableCell component="th" scope="row">
                Type
              </StyledTableCell>
              <StyledTableCell>
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
                Commercial Number
              </StyledTableCell>
              <StyledTableCell>
                {vendor.commercial_no ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {vendor.commercial_no}
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
              <StyledTableCell>
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
                        className={classes.viewDocumentButton}
                        variant="contained"
                        onClick={() =>
                          window.open(vendor.commercialDocs?.image)
                        }
                      >
                        View Document
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
              <StyledTableCell>
                {vendor.tax_card_no ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {vendor.tax_card_no}
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
              <StyledTableCell>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {vendor.taxCardDocs?.file_name}
                  {vendor.taxCardDocs?.image ? (
                    <div style={{ display: "flex" }}>
                      <Button
                        style={{
                          width: "fit-content",
                          margin: "5px 15px",
                          marginLeft: 0,
                        }}
                        className={classes.viewDocumentButton}
                        variant="contained"
                        onClick={() => window.open(vendor.taxCardDocs?.image)}
                      >
                        View Document
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

            {vendor.type != 1 ? (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Wholesale Document
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span> {vendor.wholesaleDocs?.file_name}</span>
                    {vendor.wholesaleDocs?.image ? (
                      <div style={{ display: "flex" }}>
                        <Button
                          style={{
                            width: "fit-content",
                            margin: "5px 15px",
                            marginLeft: 0,
                          }}
                          className={classes.viewDocumentButton}
                          variant="contained"
                          onClick={() =>
                            window.open(vendor.wholesaleDocs?.image)
                          }
                        >
                          View Document
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
            ) : null}

            <StyledTableRow key={vendor.bank_account}>
              <StyledTableCell component="th" scope="row">
                Bank Account
              </StyledTableCell>
              <StyledTableCell>
                {vendor.bank_account ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {vendor.bank_account}
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
              <StyledTableCell>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {vendor.bankDocs?.file_name}
                  {vendor.bankDocs?.image ? (
                    <div style={{ display: "flex" }}>
                      <Button
                        style={{
                          width: "fit-content",
                          margin: "5px 15px",
                          marginLeft: 0,
                        }}
                        className={classes.viewDocumentButton}
                        variant="contained"
                        onClick={() => window.open(vendor.bankDocs?.image)}
                      >
                        View Document
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

            {/* <StyledTableRow key={`vendor-logo`}>
              <StyledTableCell component="th" scope="row">
                Logo
              </StyledTableCell>
              <StyledTableCell >
                <img
                  src={vendor.images?.image}
                  alt={vendor.images?.file_name}
                  className={classes.media}
                />
              </StyledTableCell>
            </StyledTableRow> */}

            {vendor.vendorStatus !== "incomplete" &&
            vendor.vendorStatus !== "invalid info" &&
            vendor.vendorStatus !== "approved" ? (
              <StyledTableRow key={`vendor-actions`}>
                <StyledTableCell component="th" scope="row">
                  Actions
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ textAlign: "center" }}>
                    <>
                      <Button
                        variant="contained"
                        className={classes.approveBtn}
                        onClick={approveVendor}
                        disabled={!vendor.vendorStatus === "pending" || loading}
                      >
                        {loading && loadingBtn === "approve" ? (
                          <CircularProgress
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "#90CA28",
                            }}
                          />
                        ) : lang === "en" ? (
                          "Approve Vendor"
                        ) : (
                          "قبول الطلب"
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.rejectBtn}
                        onClick={() => setIsRejecting(!isRejecting)}
                        disabled={!vendor.vendorStatus === "pending" || loading}
                      >
                        {lang === "en" ? "Reject Info" : "طلب استيفاء بيانات"}
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.declineBtn}
                        onClick={declineVendor}
                        disabled={
                          !vendor.vendorStatus === "approved" || loading
                        }
                      >
                        {loading && loadingBtn === "decline" ? (
                          <CircularProgress
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "#CA2828",
                            }}
                          />
                        ) : lang === "en" ? (
                          "Decline Request"
                        ) : (
                          "رفض الطلب"
                        )}
                      </Button>
                    </>
                  </div>

                  <Collapse timeout="auto" in={isRejecting}>
                    <p>
                      {lang === "en" ? "Rejection reasons" : "سبب الاستيفاء"}:
                    </p>

                    <Grid container>
                      {rejectionList?.map((currentItem, index) =>
                        vendor.type == 1 && index === 0 ? null : (
                          <Grid item xs={12} md={6}>
                            <FormControlLabel
                              control={
                                <CustomCheckbox
                                  value={currentItem.id}
                                  onChange={selectRejection}
                                />
                              }
                              label={
                                <Typography className={classes.checkboxLabel}>
                                  {lang === "en"
                                    ? currentItem.fieldEn
                                    : currentItem.fieldAr}
                                </Typography>
                              }
                            />
                          </Grid>
                        )
                      )}
                    </Grid>

                    <p> {lang === "en" ? "Comments" : "رسالة/ملاحظات"}:</p>

                    <TextField
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#CCCCCC",
                      }}
                    />

                    <Button
                      className={classes.submitBtn}
                      disabled={!itemsToReject.length || !reason}
                      onClick={rejectInfo}
                    >
                      {loading && loadingBtn === "reject" ? (
                        <CircularProgress
                          style={{
                            width: "20px",
                            height: "20px",
                            color: "#F8CF00",
                          }}
                        />
                      ) : (
                        t("global.submitBtn")
                      )}
                    </Button>
                  </Collapse>
                </StyledTableCell>
              </StyledTableRow>
            ) : null}
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
      <SuccessPopup
        open={dialogOpen}
        setOpen={setDialogOpen}
        message={dialogText}
        handleClose={closeDialog}
      />
    </Fragment>
  ) : (
    <div style={{ height: "100%" }}>
      <Loader />
    </div>
  );
}

export default ViewVendor;
