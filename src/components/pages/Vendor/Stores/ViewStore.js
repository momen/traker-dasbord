import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import { Button } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Fragment } from "react";
import Map from "../../../Map/Map";

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
  memberBadge: {
    background: "#98A9FF",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
  },
  media: {
    width: "25%",
    objectFit: "contain",
  },
});

function ViewStore({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [store, setStore] = useState("");

  useEffect(() => {
    axios
      .get(`/stores/${match.params.id}`)
      .then((res) => {
        setStore(res.data.data);
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
        onClick={() => history.push("/vendor/branches")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={store.id}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{store.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`store-${store.vendor?.company_name}`}>
              <StyledTableCell component="th" scope="row">
                Company Name
              </StyledTableCell>
              <StyledTableCell align="left">
                {store.vendor?.company_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={store.name}>
              <StyledTableCell component="th" scope="row">
                Branch Name
              </StyledTableCell>
              <StyledTableCell align="left">{store.name}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`members`}>
              <StyledTableCell component="th" scope="row">
                Staff Members
              </StyledTableCell>
              <StyledTableCell align="left">
                {store.members?.map((member) => (
                  <span key={member.id} className={classes.memberBadge}>
                    {member.name}
                  </span>
                ))}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={store.vendor_name}>
              <StyledTableCell component="th" scope="row">
                Owner (Vendor)
              </StyledTableCell>
              <StyledTableCell align="left">
                {store.vendor_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`vendor-type-${store.vendor_name}`}>
              <StyledTableCell component="th" scope="row">
                Vendor Type
              </StyledTableCell>
              <StyledTableCell align="left">
                {store.vendor?.type == "1"
                  ? "Retailer"
                  : store.vendor?.type == "2"
                  ? "Wholesaler"
                  : "Retailer/Wholesaler"}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={store.address}>
              <StyledTableCell component="th" scope="row">
                Address
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{store.address}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={store.serial_id}>
              <StyledTableCell component="th" scope="row">
                Serial
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{store.serial_id}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={store.moderator_phone}>
              <StyledTableCell component="th" scope="row">
                Moderator Phone
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {store.moderator_phone}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={store.moderator_alt_phone}>
              <StyledTableCell component="th" scope="row">
                Moderator Alternative Phone
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {store.moderator_alt_phone}
                </span>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {store.lat && store.long ? (
        <div style={{ height: "60vh", marginTop: "20px" }}>
          <Map
            lattitude={parseFloat(store.lat)}
            longitude={parseFloat(store.long)}
          />
        </div>
      ) : null}
    </Fragment>
  );
}

export default ViewStore;
