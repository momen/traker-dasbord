import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../../axios";
import { Breadcrumbs, Button } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Fragment } from "react";
import CurrencyFormat from "react-currency-format";
import { useSelector } from "react-redux";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

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
    width: "fit-content",
    background: "#e5c08b",
    color: "#000000",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "10px",
    marginRight: "5px",
    userSelect: "none",
  },
  modelsBadge: {
    background: "#C0D9D9",
    color: "#000000",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
  },
  breadcrumbs: {
    // fontSize: "25px",
    // marginTop: "25px",
    // marginLeft: "25px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});

function ViewProduct({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const { lang } = useSelector((state) => state);
  const [product, setProduct] = useState(""); //Customize
  const { t } = useTranslation();

  //Customize
  useEffect(() => {
    axios
      .get(`/products/${match.params.id}`)
      .then((res) => {
        setProduct(res.data.data);
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
            <StyledTableRow key={product.serial_number}>
              <StyledTableCell component="th" scope="row">
                Serial Number
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.serial_number}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={product.serial_coding}>
              <StyledTableCell component="th" scope="row">
                Serial Encoding
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.serial_coding}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={product.serial_id}>
              <StyledTableCell component="th" scope="row">
                Serial Coding
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent} dir="ltr">
                  {product.serial_id}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={product.name}>
              <StyledTableCell component="th" scope="row">
                Product Name
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {lang === "ar"
                    ? product.name || product.name_en
                    : product.name_en || product.name}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`vendor-${product.vendor?.id}`}>
              <StyledTableCell component="th" scope="row">
                Vendor
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.vendor?.vendor_name}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`store-${product.store_id}`}>
              <StyledTableCell component="th" scope="row">
                Store
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.store?.name}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={product.description}>
              <StyledTableCell component="th" scope="row">
                Description
              </StyledTableCell>
              <StyledTableCell align="left">
                <p className={classes.rowContent}>
                  {lang === "ar"
                    ? product.description || product.description_en
                    : product.description_en || product.description}
                </p>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`product-type-${product.producttype_id?.id}`}>
              <StyledTableCell component="th" scope="row">
                Product Type
              </StyledTableCell>
              <StyledTableCell align="left">
                <p
                  className={classes.rowContent}
                  style={{ textTransform: "capitalize" }}
                >
                  {product.producttype_id?.producttype}
                </p>
              </StyledTableCell>
            </StyledTableRow>
            {product.car_type ? (
              <StyledTableRow key={`vehicle-type-${product.car_type?.id}`}>
                <StyledTableCell component="th" scope="row">
                  Vehicle Type
                </StyledTableCell>
                <StyledTableCell align="left">
                  <p
                    className={classes.rowContent}
                    style={{ textTransform: "capitalize" }}
                  >
                    {product.car_type?.type_name}
                  </p>
                </StyledTableCell>
              </StyledTableRow>
            ) : null}
            {product?.price ? (
              <StyledTableRow key={`price-${product.price}`}>
                <StyledTableCell component="th" scope="row">
                  Price
                </StyledTableCell>
                <StyledTableCell align="left">
                  <CurrencyFormat
                    value={product.price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={t("global.currency")}
                    renderText={(value) => (
                      <span className={classes.rowContent}>&nbsp;{value}</span>
                    )}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ) : null}
            {product?.holesale_price ? (
              <StyledTableRow key={`wholesale-price-${product.holesale_price}`}>
                <StyledTableCell component="th" scope="row">
                  Wholesale Price
                </StyledTableCell>
                <StyledTableCell align="left">
                  <CurrencyFormat
                    value={product.holesale_price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={t("global.currency")}
                    renderText={(value) => (
                      <span className={classes.rowContent}>{value}</span>
                    )}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ) : null}
            {product?.no_of_orders ? (
              <StyledTableRow key={`wholesale-orders-${product.no_of_orders}`}>
                <StyledTableCell component="th" scope="row">
                  Number of Orders (Wholesale)
                </StyledTableCell>
                <StyledTableCell align="left">
                  <p className={classes.rowContent}>{product.no_of_orders}</p>
                </StyledTableCell>
              </StyledTableRow>
            ) : null}
            <StyledTableRow key={`product-${product.id}-Images`}>
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
            {product.producttype_id?.producttype === "normal" ? (
              <>
                <StyledTableRow key={`quantity-${product.quantity}`}>
                  <StyledTableCell component="th" scope="row">
                    Available Quantity
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span className={classes.rowContent}>
                      {product.quantity}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow
                  key={`reminderQuantity-${product.qty_reminder}`}
                >
                  <StyledTableCell component="th" scope="row">
                    Reminder Quantity
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span className={classes.rowContent}>
                      {product.qty_reminder}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
              </>
            ) : null}
            <StyledTableRow key={`discount-${product.discount}`}>
              <StyledTableCell component="th" scope="row">
                Discount
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.discount
                    ? `%${product.discount} - ${
                        (product.discount / 100) * product.price
                      } ${t("global.currency")}`
                    : "Not applied"}
                </span>
                &emsp;
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`serial-${product.serial_number}`}>
              <StyledTableCell component="th" scope="row">
                Serial Number
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.serial_number}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            {product.tags?.length ? (
              <StyledTableRow key={`product-tags-${product.id}`}>
                <StyledTableCell component="th" scope="row">
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
            ) : null}
            <StyledTableRow key={`manufacturer-${product.manufacturer?.id}`}>
              <StyledTableCell component="th" scope="row">
                Manufacturer
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.manufacturer?.manufacturer_name}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`origin-${product.origin_country?.id}`}>
              <StyledTableCell component="th" scope="row">
                Origin Country
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {lang === "ar"
                    ? product.origin_country?.country_name ||
                      product.origin_country?.name_en
                    : product.origin_country?.name_en ||
                      product.origin_country?.country_name}
                </span>
              </StyledTableCell>
            </StyledTableRow>
            {/* <StyledTableRow key={`model-${product.car_model_id}`}>
              <StyledTableCell component="th" scope="row">
                Car Model
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>
                  {product.car_model?.carmodel}
                </span>
              </StyledTableCell>
            </StyledTableRow> */}
            {/* <StyledTableRow key={`year-${product.year_id}`}>
              <StyledTableCell component="th" scope="row">
                Car Year
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={classes.rowContent}>{product.year?.year}</span>
              </StyledTableCell>
            </StyledTableRow> */}
            {product.car_made_id ? (
              <>
                <StyledTableRow key={`made-${product.car_made_id}`}>
                  <StyledTableCell component="th" scope="row">
                    Brand
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span className={classes.rowContent}>
                      {product.car_made?.car_made}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
                {product.car_model?.length ? (
                  <StyledTableRow key={`models-${product.id}`}>
                    <StyledTableCell component="th" scope="row">
                      Models
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <span className={classes.rowContent}>
                        {product.car_model?.map((model) => (
                          <span key={model.id} className={classes.modelsBadge}>
                            {model.carmodel}
                          </span>
                        ))}
                      </span>
                    </StyledTableCell>
                  </StyledTableRow>
                ) : null}
                <StyledTableRow key={`year-from-${product.year_from?.id}`}>
                  <StyledTableCell component="th" scope="row">
                    Year From
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span className={classes.rowContent}>
                      {product.year_from?.year}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow key={`year-to-${product.year_to?.id}`}>
                  <StyledTableCell component="th" scope="row">
                    Year To
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span className={classes.rowContent}>
                      {product.year_to?.year}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
              </>
            ) : null}
            <StyledTableRow key={`product-category-${product.category_id}`}>
              <StyledTableCell component="th" scope="row">
                Category
              </StyledTableCell>
              <StyledTableCell align="left">
                <Breadcrumbs
                  className={classes.breadcrumbs}
                  separator={
                    lang === "ar" ? (
                      <NavigateBefore fontSize="small" />
                    ) : (
                      <NavigateNext fontSize="small" />
                    )
                  }
                  aria-label="breadcrumb"
                >
                  {product.allcategory?.map((categoryLevel, index) => (
                    <span className={classes.breadcrumbsTab}>
                      {lang === "ar"
                        ? categoryLevel.name || categoryLevel.name_en
                        : categoryLevel.name_en || categoryLevel.name}
                    </span>
                  ))}
                </Breadcrumbs>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewProduct;
