import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import { Button, Grid, Typography } from "@material-ui/core";
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
    maxWidth: 700,
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
  permissionBadge: {
    background: "#00b3b3",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    marginBottom: "5px",
    userSelect: "none",
    display: "inline-block",
  },
});


function ViewPermission({ match }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [permission, setPermission] = useState(""); //Customize

  //Customize
  useEffect(() => {
    axios
      .get(`/permissions/${match.params.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setPermission(res.data.data);
      });
  }, []);


  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/user-mgt/permissions")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={permission.id}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{permission.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={permission.title}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Permission Title
              </StyledTableCell>
              <StyledTableCell align="left">{permission.title}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`${permission.id}`}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Created At
              </StyledTableCell>
              <StyledTableCell align="left">
                {permission.created_at}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewPermission;
