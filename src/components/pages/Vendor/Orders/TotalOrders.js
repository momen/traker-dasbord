import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
  Button as MuiButton,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
  LinearProgress,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";

import { spacing } from "@material-ui/system";
import { ExpandMore, UnfoldLess } from "@material-ui/icons";
import axios from "../../../../axios";
import { Pagination } from "@material-ui/lab";
import { Search } from "react-feather";
import { useSelector } from "react-redux";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  footer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    paddingRight: theme.direction === "rtl" ? 25 : 40,
    paddingLeft: theme.direction === "rtl" ? 40 : 25,
  },
  approveButton: {
    background: "#ffffff",
    color: "#90CA28",
    border: "1px solid #90CA28",
    borderRadius: 0,
    height: 30,
    "&:hover": {
      background: "#90CA28",
      color: "#ffffff",
    },
  },
  cancelButton: {
    background: "#ffffff",
    color: "#E10000",
    border: "1px solid #E10000",
    borderRadius: 0,
    height: 30,
    "&:hover": {
      background: "#E10000",
      color: "#ffffff",
    },
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: "6px",
  },
}));

function CustomPagination(props) {
  const { state, api } = props;
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <Pagination
        className={classes.root}
        color="primary"
        page={state.pagination.page}
        count={state.pagination.pageCount}
        showFirstButton={true}
        showLastButton={true}
        onChange={(event, value) => api.current.setPage(value)}
        variant="outlined"
        shape="rounded"
      />
      <Select
        style={{ height: 35 }}
        variant="outlined"
        value={state.pagination.pageSize}
        onChange={(e) => api.current.setPageSize(e.target.value)}
        displayEmpty
        IconComponent={ExpandMore}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          getContentAnchorEl: null,
        }}
      >
        <MenuItem value={10}>10 records / page</MenuItem>
        <MenuItem value={25}>25 records / page</MenuItem>
        <MenuItem value={100}>100 records / page</MenuItem>
      </Select>
    </div>
  );
}

CustomPagination.propTypes = {
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  /**
   * The GridState object containing the current grid state.
   */
  state: PropTypes.object.isRequired,
};

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

function PendingOrders() {
  const classes = useStyles();
  const userPermissions = useSelector((state) => state.userPermissions);
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [orderToApproveOrCancel, setOrderToApproveOrCancel] = useState();
  const [statusToFilterBy, setStatusToFilterBy] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    { field: "order_number", headerName: "Order Number", width: 150, flex: 1 },
    { field: "order_total", headerName: "Order Total", width: 200 },
    { field: "orderStatus", headerName: "Status", width: 150, sortable: false },
    { field: "paid", headerName: "Paid", width: 80, sortable: false },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            {/* {userPermissions.includes("show_specific_order") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                size="small"
                onClick={() => history.push(`/vendor/orders/${params.row.id}`)}
              >
                View
              </Button>
            ) : null} */}
            {userPermissions.includes("approve_orders") &&
            params.row.status === "pending" &&
            params.row.paid ? (
              <Button
                style={{ marginRight: "5px" }}
                className={classes.approveButton}
                variant="contained"
                size="small"
                onClick={() => {
                  setOpenApproveDialog(true);
                  setOrderToApproveOrCancel(params.row.id);
                }}
              >
                Approve Order
              </Button>
            ) : null}

            {userPermissions.includes("cancel_orders") &&
            params.row.status === "pending" ? (
              <Button
                style={{ marginRight: "5px" }}
                className={classes.cancelButton}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  setOpenCancelDialog(true);
                  setOrderToApproveOrCancel(params.row.id);
                }}
              >
                Cancel Order
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  const handlePageSize = ({ pageSize }) => {
    setPageSize(pageSize);
  };

  const handlePageChange = ({ page }) => {
    setPage(page);
  };

  const handleSortModelChange = (params) => {
    if (params.sortModel !== sortModel) {
      setSortModel(params.sortModel);
    }
  };

  const handleSearchInput = (e) => {
    let search = e.target.value;
    if (!search || search.trim() === "") {
      setuserIsSearching(false);
      setSearchValue(search);
    } else {
      if (!userIsSearching) {
        setuserIsSearching(true);
      }
      setSearchValue(search);
    }
  };

  const approveOrder = () => {
    axios
      .post(`/vendor/approve/orders`, {
        order_id: orderToApproveOrCancel,
        status: 1,
      })
      .then(() => {
        setOpenApproveDialog(false);
        setLoading(true);
        axios
          .post(
            `/show/orders?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
          )
          .then((res) => {
            if (Math.ceil(res.data.total / pageSize) < page) {
              setPage(page - 1);
            }
            setRowsCount(res.data.total);
            setRows(res.data.data);
            setLoading(false);
          })
          .catch(({ response }) => {
            alert(response.data?.errors);
          });
      })
      .catch(({ response }) => {
        alert(response.data?.errors);
      });
  };

  const cancelOrder = () => {
    axios
      .post(`/vendor/cancel/order`, {
        order_id: orderToApproveOrCancel,
      })
      .then(() => {
        setOpenCancelDialog(false);
        setLoading(true);
        axios
          .post(
            `/show/orders?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
          )
          .then((res) => {
            if (Math.ceil(res.data.total / pageSize) < page) {
              setPage(page - 1);
            }
            setRowsCount(res.data.total);
            setRows(res.data.data);
            setLoading(false);
          })
          .catch(({ response }) => {
            alert(response.data?.errors);
          });
      })
      .catch(({ response }) => {
        alert(response.data?.errors);
      });
  };

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    setLoading(true);
    if (!userIsSearching) {
      axios
        .post(
          `/show/orders?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
          {
            fetch: statusToFilterBy,
          }
        )
        .then((res) => {
          setRowsCount(res.data.total);
          setRows(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          alert("Failed to Fetch data");
        });
    } else {
      axios
        .post(
          `/orders/search/name?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
          {
            search_index: searchValue,
          }
        )
        .then((res) => {
          setRowsCount(res.data.total);
          setRows(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          alert("Failed to Fetch data");
        });
    }
  }, [page, searchValue, sortModel, pageSize, statusToFilterBy]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Orders
      </Typography>

      <Divider my={6} />

      <Card mb={6}>
        <Paper mb={2}>
          <Toolbar className={classes.toolBar}>
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <FormControl
                variant="outlined"
                size="small"
                style={{ width: "150px", marginRight: "15px" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Status
                </InputLabel>
                <Select
                  // autoWidth
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
                  onChange={(e) => setStatusToFilterBy(e.target.value)}
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

              <div>
                <Grid
                  container
                  spacing={1}
                  alignItems="flex-end"
                  style={{ display: "flex" }}
                >
                  <Grid item>
                    <Search />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="input-with-icon-grid"
                      label="Search"
                      onChange={handleSearchInput}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </Toolbar>
        </Paper>
        <Paper>
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              page={page}
              pageSize={pageSize}
              rowCount={rowsCount}
              sortingOrder={["desc", "asc"]}
              sortModel={sortModel}
              columnBuffer={pageSize}
              paginationMode="server"
              sortingMode="server"
              components={{
                Pagination: CustomPagination,
                LoadingOverlay: CustomLoadingOverlay,
              }}
              loading={loading}
              disableColumnMenu
              autoHeight={true}
              onRowClick={
                userPermissions.includes("show_specific_order")
                  ? ({ row }) => history.push(`/vendor/orders/${row.id}`)
                  : null
              }
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSize}
              onSortModelChange={handleSortModelChange}
            />
          </div>
        </Paper>
      </Card>

      <Dialog
        open={openApproveDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Order Approval"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Approve this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              approveOrder();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenApproveDialog(false)}
            color="secondary"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCancelDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Order"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Cancel this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              cancelOrder();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenCancelDialog(false)}
            color="secondary"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default PendingOrders;
