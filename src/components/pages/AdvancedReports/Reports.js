import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Collapse,
  Divider as MuiDivider,
  FormControl,
  Grid as MuiGrid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper as MuiPaper,
  Select,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { spacing } from "@material-ui/system";
import axios from "../../../axios";
import Popup from "../../Popup";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import PropTypes from "prop-types";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import AdvancedFilterForm from "./AdvancedFilterForm";

const Grid = styled(MuiGrid)(spacing);
const Divider = styled(MuiDivider)(spacing);

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    // width: "100%",
    // wordBreak: "break-word",
    display: "flex",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanded: {
    "&$expanded": {
      margin: "4px 0",
    },
  },
  button: {
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
    },
    marginRight: "5px",
  },
}));

function Row({ row, index, page, pageSize }) {
  //   const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {index + 1 + (pageSize > 0 ? parseInt(page * pageSize) : 0)}
        </TableCell>
        <TableCell>{row.order_number}</TableCell>
        <TableCell>{row.order_total}</TableCell>
        <TableCell>{row.orderStatus}</TableCell>
        <TableCell>{row.created_at}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {/* <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography> */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Product Serial</TableCell>
                    <TableCell>Store</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>

                {row.orderDetails?.map((detail, index) => (
                  <TableRow
                    key={`Order-${row.id}-detail-${index}`}
                    className={classes.root}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{detail.product_name}</TableCell>
                    <TableCell>{detail.product_serial}</TableCell>
                    <TableCell>{detail.store_name}</TableCell>
                    <TableCell>{detail.vendor_name}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>{detail.price}</TableCell>
                    <TableCell>%{detail.discount}</TableCell>
                    <TableCell>{detail.total}</TableCell>
                  </TableRow>
                ))}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function Reports() {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [searchData, updateSearchData] = useState({
    order_number: "",
    order_total: "",
    status: "",
  });
  const [userIsSearching, setuserIsSearching] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [partCategories, setPartCategories] = useState([]);
  const [stores, setStores] = useState([]);

  const [filterData, updateFilterData] = useState({
    from: null,
    to: null,
    vendor: null,
    part_category: null,
    stock: null,
    product: null,
    sale_type: null,
  });

  /*-Get list to use in the filter only on the initial render to pass it to the pop-up form 
    when adding or editing, to prevent repeating the request each time the
    pop-up is opened-*/
  useEffect(() => {
    if (user?.roles[0].title === "Admin") {
      axios
        .get("/vendors-list")
        .then((res) => {
          const _vendors = res.data.data.map(({ id, vendor_name }) => ({
            id,
            vendor_name,
          }));
          setVendors(_vendors);
        })
        .catch(() => {
          alert("Failed to Fetch Vendors List");
        });
    }

    axios
      .get("/products-list")
      .then((res) => {
        const _products = res.data.data.map(({ id, name }) => ({ id, name }));
        setProducts(_products);
      })
      .catch(() => {
        alert("Failed to Fetch Products List");
      });

    axios
      .get("/storeslist")
      .then((res) => {
        const _stores = res.data.data.map(({ id, name }) => ({ id, name }));
        setStores(_stores);
      })
      .catch(() => {
        alert("Failed to Fetch Stores List");
      });

    axios
      .get("/part-categorieslist")
      .then((res) => {
        const _partCategories = res.data.data.map(({ id, category_name }) => ({
          id,
          category_name,
        })); // Customize
        setPartCategories(_partCategories);
      })
      .catch(() => {
        alert("Failed to Fetch Part Categories List");
      });
  }, []);

  useEffect(() => {
    if (!userIsSearching) {
      axios
        .post(`/fetch/advanced/report`, filterData)
        .then((res) => {
          setOrders(res.data.total_orders);
          setFilteredOrders(res.data.total_orders);
        })
        .catch((res) => {
          alert("Failed to Fetch data");
        });
    } else {
      let ordersAfterSearch =
        searchData.order_number ||
        searchData.order_number.toString().trim() !== ""
          ? orders.filter((order) =>
              order.order_number
                .toString()
                .startsWith(searchData.order_number.toString())
            )
          : orders;

      ordersAfterSearch =
        searchData.order_total ||
        searchData.order_total.toString().trim() !== ""
          ? ordersAfterSearch.filter(
              (order) => order.order_total <= parseFloat(searchData.order_total)
            )
          : ordersAfterSearch;

      ordersAfterSearch = searchData.status
        ? ordersAfterSearch.filter(
            (order) => order.orderStatus === searchData.status
          )
        : ordersAfterSearch;

      setFilteredOrders(ordersAfterSearch);
    }
  }, [filterData, searchData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    if (!userIsSearching) {
      setuserIsSearching(true);
    }
    updateSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Orders Summary
      </Typography>

      <h3>
        {filterData.from && filterData.to
          ? ` ${filterData.from} - ${filterData.to}`
          : " Last week (Default)"}
      </h3>

      <Divider my={6} />

      <Card mb={6}>
        <Paper>
          <div style={{ width: "100%" }}>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Search />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        name="order_number"
                        onChange={handleSearch}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        name="order_total"
                        onChange={handleSearch}
                      />
                    </TableCell>
                    <TableCell style={{ width: "15%" }}>
                      <FormControl
                        variant="outlined"
                        style={{ width: "100%" }}
                        size="small"
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          Status
                        </InputLabel>
                        <Select
                          autoWidth
                          labelId="demo-simple-select-outlined-label"
                          id="status"
                          name="status"
                          // value={age}
                          // onChange={handleChange}
                          label="Status"
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "center",
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "center",
                            },
                            getContentAnchorEl: () => null,
                          }}
                          onChange={handleSearch}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in progress">In Progress</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setOpenPopup(true)}
                      >
                        Advanced Filter
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell>#</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Order Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(pageSize > 0
                    ? filteredOrders?.slice(
                        page * pageSize,
                        page * pageSize + pageSize
                      )
                    : filteredOrders
                  )?.map((row, index) => (
                    <Row
                      key={row.name}
                      row={row}
                      index={index}
                      page={page}
                      pageSize={pageSize}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      // colSpan={3}
                      count={filteredOrders.length}
                      rowsPerPage={pageSize}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        </Paper>
      </Card>
      <Popup
        title="Filter Orders by period"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AdvancedFilterForm
          setOpenPopup={setOpenPopup}
          filterData={filterData}
          updateFilterData={updateFilterData}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          vendors={vendors}
          products={products}
          stores={stores}
          partCategories={partCategories}
          isAdmin={user?.roles[0].title === "Admin"}
          setuserIsSearching={setuserIsSearching}
        />
      </Popup>
    </React.Fragment>
  );
}

export default Reports;
