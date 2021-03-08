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
import CurrencyFormat from 'react-currency-format';


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
    width: "24%",
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

function ViewProduct({ match }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [product, setProduct] = useState(""); //Customize

  //Customize
  useEffect(() => {
    axios
      .get(`/products/${match.params.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setProduct(res.data.data);
      });
  }, []);

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/product/products")} //Customize
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={`product ${product.id}`}>
              <StyledTableCell
                component="th"
                scope="row"
                className={classes.attributeName}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{product.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={product.name}>
              <StyledTableCell component="th" scope="row">
                Product Name
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.name}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`store-${product.store_id}`}>
              <StyledTableCell component="th" scope="row">
                Store
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.store?.name}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={product.description}>
              <StyledTableCell component="th" scope="row">
                Description
              </StyledTableCell>
              <StyledTableCell align="left">
                <p className={classes.rowContent}>{product.description}</p>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={user.userid_id}>
              <StyledTableCell component="th" scope="row">
                Images
              </StyledTableCell>
              <StyledTableCell align="left">
                {product.photo?.map((img) => (
                  <Fragment>
                  <img
                    className={classes.media}
                    src={img.image}
                    alt={img.file_name}
                  />
                  </Fragment>
                ))}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`quantity-${product.quantity}`}>
              <StyledTableCell component="th" scope="row">
                Quantity
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.quantity}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`price-${product.price}`}>
              <StyledTableCell component="th" scope="row">
                Price
              </StyledTableCell>
              <StyledTableCell align="left">
              <CurrencyFormat value={product.price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span className={classes.rowContent}>{value}</span>}/>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`discount-${product.discount}`}>
              <StyledTableCell component="th" scope="row">
                Discount
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.discount}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`serial-${product.serial_number}`}>
              <StyledTableCell component="th" scope="row">
                Serial Number
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.serial_number}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`product-cat-${product.id}`}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Categories
              </StyledTableCell>
              <StyledTableCell align="left">
                {product.categories?.map((category) => (
                  <span key={category.id} className={classes.categoriesBadge}>
                    {category.name}
                  </span>
                ))}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`product-tags-${product.id}`}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                Tags
              </StyledTableCell>
              <StyledTableCell align="left">
                {product.tags?.map((tag) => (
                  <span key={tag.id} className={classes.tagsBadge}>
                    {tag.name}
                  </span>
                ))}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow key={`model-${product.car_model_id}`}>
              <StyledTableCell component="th" scope="row">
                Car Model
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.car_model?.carmodel}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`year-${product.year_id}`}>
              <StyledTableCell component="th" scope="row">
                Car Year
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.year?.year}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`made-${product.car_made_id}`}>
              <StyledTableCell component="th" scope="row">
                Car Made
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.car_made?.car_made}</span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`part-${product.part_category_id}`}>
              <StyledTableCell component="th" scope="row">
                Part Category
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.part_category?.category_name}</span>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewProduct;