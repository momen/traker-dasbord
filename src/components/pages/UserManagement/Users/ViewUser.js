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
  attributeName:{
    width:"15%",
  },
  roleBadge: {
    background: "#FFBF00",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    marginBottom: "5px",
    userSelect: "none",
    display: "inline-block",
  },
});

function ViewUser({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [singleUser, setSingleUser] = useState("");  //Customize

  //Customize
  useEffect(() => {
    axios
      .get(`/users/${match.params.id}`)
      .then((res) => {
        setSingleUser(res.data.data);
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
        onClick={() => history.push("/user-mgt/users")} //Customize
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={singleUser.id}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{singleUser.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={singleUser.name}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Username
              </StyledTableCell>
              <StyledTableCell align="left">{singleUser.name}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={singleUser.email}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Email
              </StyledTableCell>
              <StyledTableCell align="left">{singleUser.email}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={singleUser.email_verified_at}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Email Verified At
              </StyledTableCell>
              <StyledTableCell align="left">{singleUser.email_verified_at}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`${singleUser.id} ${singleUser.title}`}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Roles
              </StyledTableCell>
              <StyledTableCell align="left">
                {singleUser.roles?.map((role) => (
                  <span key={role.id} className={classes.roleBadge}>
                    {role.title}
                  </span>
                ))}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewUser;
