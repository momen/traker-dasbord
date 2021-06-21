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
import CurrencyFormat from "react-currency-format";

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
  attributeName: {
    width: "20%",
  },
  rowContent: {
    // display: "inline-block",
    width: "100%",
    // whiteSpace: "normal",
    wordBreak: "break-word",
  },

  media: {
    maxWidth: "24%",
    objectFit: "contain",
    marginRight: "5px",
  },
  categoriesBadge: {
    background: "#e5c08b",
    color: "#000000",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
  },
  tagsBadge: {
    background: "#e5c08b",
    color: "#000000",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
  },
});

function ViewCountry({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [area, setArea] = useState(""); //Customize

  //Customize
  useEffect(() => {
    axios
      .get(`/areas/${match.params.id}`)
      .then((res) => {
        setArea(res.data.data);
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
        onClick={() => history.push("/geography/areas")} //Customize
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={`area ${area.id}`}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{area.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={area.country_name}>
              <StyledTableCell component="th" scope="row">
                Area Name
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {area.area_name}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={area.country_name}>
              <StyledTableCell component="th" scope="row">
                Country Name
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {area.country_name}
                </span>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewCountry;
