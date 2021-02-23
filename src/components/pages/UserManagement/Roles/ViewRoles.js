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
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
});

const vendorTypes = {
  1: "Vendor",
  2: "Hot Sale",
  3: "Both",
};

function ViewVendor({ match }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [vendor, setVendor] = useState("");
  const [vendorTypes, setVendorTypes] = useState("");

  useEffect(() => {
    axios
      .get(`/add-vendors/${match.params.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setVendor(res.data.data);
      });

    axios
      .get(`/add-vendors/get/types`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setVendorTypes(res.data.data);
      });
  }, []);

  const uppercaseWords = (str) =>
    str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/vendor/add")}
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
                style={{ width: "20%" }}
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
                {vendor.vendor_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.email}>
              <StyledTableCell component="th" scope="row">
                Email
              </StyledTableCell>
              <StyledTableCell align="left">{vendor.email}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.type}>
              <StyledTableCell component="th" scope="row">
                Type
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.type && vendorTypes
                  ? uppercaseWords(vendorTypes[vendor.type])
                  : null}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={vendor.userid?.name}>
              <StyledTableCell component="th" scope="row">
                Username
              </StyledTableCell>
              <StyledTableCell align="left">
                {vendor.userid?.name}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewVendor;
