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
  attributeName: {
    width: "15%",
  },
});

function ViewCarMade({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const [carMade, setCarMade] = useState(""); //Customize

  //Customize
  useEffect(() => {
    axios
      .get(`/car-mades/${match.params.id}`)
      .then((res) => {
        setCarMade(res.data.data);
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
        onClick={() => history.push("/product/brands")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={carMade.id}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{carMade.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={carMade.car_made}>
              <StyledTableCell component="th" scope="row">
                Brand Name
              </StyledTableCell>
              <StyledTableCell align="left">{carMade.car_made}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`carMade-${carMade.catName}`}>
              <StyledTableCell component="th" scope="row">
                Category
              </StyledTableCell>
              <StyledTableCell align="left">
                {carMade.categoryid?.name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`${carMade.id} ${carMade.created_at}`}>
              <StyledTableCell component="th" scope="row">
                Created At
              </StyledTableCell>
              <StyledTableCell align="left">
                {carMade.created_at}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewCarMade;
