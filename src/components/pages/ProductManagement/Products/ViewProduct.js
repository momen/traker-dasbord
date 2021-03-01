import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
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
    width: "25%",
    objectFit: "contain",
  },
});

function ViewProduct({ match }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [category, setCategory] = useState(""); //Customize

  //Customize
  useEffect(() => {
    axios
      .get(`/product-categories/${match.params.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setCategory(res.data.data);
      });
  }, []);

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/product/categories")} //Customize
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={`cat ${category.id}`}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{category.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={category.name}>
              <StyledTableCell component="th" scope="row">
                Category Name
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{category.name}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={category.description}>
              <StyledTableCell component="th" scope="row">
                Description
              </StyledTableCell>
              <StyledTableCell align="left">
                <p className={classes.rowContent}>{category.description}</p>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={user.userid_id}>
              <StyledTableCell component="th" scope="row">
                Photo
              </StyledTableCell>
              <StyledTableCell align="left">
                <img
                  className={`${classes.media} ${classes.rowContent}`}
                  src={category.photo?.image}
                  alt={category.photo?.file_name}
                />
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewProduct;
