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
  rowContent: {
    // width: "100%",
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
});

function ViewLog({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [auditLogs, setAuditLogs] = useState("");

  useEffect(() => {
    axios
      .get(`/audit-logs/${match.params.id}`)
      .then((res) => {
        setAuditLogs(res.data.data);
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
        onClick={() => history.push("/user-mgt/logs")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={auditLogs.id}>
              <StyledTableCell
                component="th"
                scope="row"
                style={{ width: "20%" }}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{auditLogs.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={auditLogs.description}>
              <StyledTableCell component="th" scope="row">
                Description
              </StyledTableCell>
              <StyledTableCell align="left">
                {auditLogs.description}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={auditLogs.subject_id}>
              <StyledTableCell component="th" scope="row">
                Subject ID
              </StyledTableCell>
              <StyledTableCell align="left">
                {auditLogs.subject_id}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={auditLogs.subject_type}>
              <StyledTableCell component="th" scope="row">
                Subject Type
              </StyledTableCell>
              <StyledTableCell align="left">
                {auditLogs.subject_type}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={auditLogs.user_id}>
              <StyledTableCell component="th" scope="row">
                User ID
              </StyledTableCell>
              <StyledTableCell align="left">
                {auditLogs.user_id}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={auditLogs.properties}>
              <StyledTableCell component="th" scope="row">
                Properties
              </StyledTableCell>
              <StyledTableCell align="left">
                <pre className={classes.rowContent}>
                  {JSON.stringify(auditLogs.properties)}
                </pre>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={auditLogs.host}>
              <StyledTableCell component="th" scope="row">
                Host
              </StyledTableCell>
              <StyledTableCell align="left">{auditLogs.host}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={auditLogs.created_at}>
              <StyledTableCell component="th" scope="row">
                Created at
              </StyledTableCell>
              <StyledTableCell align="left">
                {auditLogs.created_at}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewLog;
