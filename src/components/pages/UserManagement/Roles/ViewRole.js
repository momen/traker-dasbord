import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
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

function ViewRole({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [role, setRole] = useState(""); //Customize

  //Customize
  useEffect(() => {
    axios
      .get(`/roles/${match.params.id}`)
      .then((res) => {
        setRole(res.data.data);
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
        onClick={() => history.push("/user-mgt/roles")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={role.id}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{role.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={role.title}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Title
              </StyledTableCell>
              <StyledTableCell align="left">{role.title}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`addedBy-${role.added_by_name}`}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Created by
              </StyledTableCell>
              <StyledTableCell align="left">{role.added_by_name}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`${role.id} ${role.title}`}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Permissions
              </StyledTableCell>
              <StyledTableCell align="left">
                {role.permissions?.map((permission) => (
                  <span key={permission.id} className={classes.permissionBadge}>
                    {permission.title}
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

export default ViewRole;
