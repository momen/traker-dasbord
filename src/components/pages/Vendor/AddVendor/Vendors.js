import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
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
  makeStyles,
  LinearProgress,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";

import { spacing } from "@material-ui/system";
import { Add, Delete, Edit, ExpandMore, UnfoldLess } from "@material-ui/icons";
import Popup from "../../../Popup";
import axios from "../../../../axios";
import VendorsForm from "./VendorsForm";
import { Pagination } from "@material-ui/lab";
import { Search } from "react-feather";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
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
  button: {
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    color: "#EF9300",
    background: "#ffffff",
    border: "1px solid #EF9300",
    borderRadius: 0,
    "&:hover": {
      background: "#EF9300",
      color: "#ffffff",
    },
    marginRight: "5px",
  },
  backBtn: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#424242",
    fontWeight: "bold",
    "&:hover": {
      color: "#7B7B7B",
    },
  },
  backIcon: {
    marginRight: theme.direction === "rtl" ? 0 : 5,
    marginLeft: theme.direction === "rtl" ? 5 : 0,
  },
  actionBtn: {
    padding: 5,
    color: "#CCCCCC",
    backgroundColor: "transparent",
    borderRadius: 0,
    "&:hover": {
      color: "#7B7B7B",
      backgroundColor: "transparent",
      borderBottom: "1px solid #7B7B7B",
    },
  },
}));

function CustomPagination(props) {
  const { state, api, setPageSize } = props;
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
        <MenuItem value={10} className={classes.dropdownOption}>
          10 records / page
        </MenuItem>
        <MenuItem value={25} className={classes.dropdownOption}>
          25 records / page
        </MenuItem>
        <MenuItem value={100} className={classes.dropdownOption}>
          100 records / page
        </MenuItem>
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

function Vendors() {
  const classes = useStyles();
  const history = useHistory();
  const userPermissions = useSelector((state) => state.userPermissions);
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Vendor");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [vendor, setVendor] = useState(""); /****** Customize ******/
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [users, setUsers] = useState("");
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [vendorToApprove, setVendorToApprove] = useState();

  const [pageHeader, setPageHeader] = useState("Vendors");
  const [viewMode, setViewMode] = useState("data-grid");

  const columns = [
    { field: "id", headerName: "ID", width: 55 },
    { field: "serial", headerName: "Serial", width: 70 },
    { field: "vendor_name", headerName: "Vendor Name", width: 80 },
    { field: "email", headerName: "Email", width: 120 },
    {
      field: "userid_id",
      headerName: "Username",
      width: 100,
      renderCell: (params) => {
        return params.row.userid.name;
      },
    },
    {
      field: "approved",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return params.row.approved ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              color: "#90CA28",
              border: "1px solid #90CA28",
              height: 30,
            }}
          >
            Approved
          </span>
        ) : params.row.rejected ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              color: "#FFA920",
              border: "1px solid #FFA920",
              height: 30,
            }}
          >
            Invalid Info
          </span>
        ) : params.row.declined ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              color: "#CA2828",
              border: "1px solid #CA2828",
              height: 30,
            }}
          >
            Rejected
          </span>
        ) : (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              color: "#98A9FF",
              border: "1px solid #98A9FF",
              height: 30,
            }}
          >
            Pending
          </span>
        );
      },
    },
    {
      field: "images",
      headerName: "Logo",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        if (params.value) {
          return (
            <img
              src={params.value.image}
              alt="logo"
              style={{ objectFit: "contain", width: 50, borderRadius: "999px" }}
            />
          );
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 550,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        // let carMade = params.getValue("id");
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              // padding: "5px"
            }}
          >
            {/* {userPermissions.includes("add_vendor_show") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                size="small"
                onClick={() => history.push(`/vendor/vendors/${params.row.id}`)}
              >
                View
              </Button>
            ) : null} */}
            {userPermissions.includes("add_vendor_edit") ? (
              <Button
                style={{
                  marginRight: "5px",
                }}
                className={classes.actionBtn}
                startIcon={<Edit />}
                color="primary"
                variant="contained"
                // size="small"
                onClick={() => {
                  setVendor(params.row);
                  setOpenPopup(true);
                  setOpenPopupTitle(
                    "Update Vendor Details"
                  ); /****** Customize ******/
                }}
              >
                Edit
              </Button>
            ) : null}
            {userPermissions.includes("add_vendor_delete") ? (
              <Button
                style={{
                  marginRight: "5px",
                }}
                className={classes.actionBtn}
                startIcon={<Delete />}
                color="secondary"
                variant="contained"
                // size="small"
                onClick={() => openDeleteConfirmation(params.row.id)}
              >
                Delete
              </Button>
            ) : null}
            {userPermissions.includes("admin_access_vendor_orders") ? (
              <Button
                style={{ marginRight: "5px", marginLeft: "15px" }}
                // color="secondary"
                variant="contained"
                size="small"
                onClick={() =>
                  history.push(`/vendor/vendors/${params.row.id}/vendor-orders`)
                }
              >
                View Orders
              </Button>
            ) : null}
            {userPermissions.includes("admin_access_vendor_invoices") ? (
              <Button
                // color="secondary"
                variant="contained"
                size="small"
                onClick={() =>
                  history.push(
                    `/vendor/vendors/${params.row.id}/vendor-invoices`
                  )
                }
              >
                View Invoices
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

  const openDeleteConfirmation = (id) => {
    setOpenDeleteDialog(true);
    setItemToDelete(id);
  };

  const DeleteVendor = () => {
    axios
      .delete(`/add-vendors/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios
          .get(
            `/add-vendors?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  const MassDelete = () => {
    axios
      .post(`/add-vendors/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        axios
          .get(
            `/add-vendors?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  const approveVendor = () => {
    axios
      .post(`/admin/approve/vendor`, {
        vendor_id: vendorToApprove,
      })
      .then(() => {
        setOpenApproveDialog(false);
        setLoading(true);
        axios
          .get(
            `/add-vendors?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  /*-Get Users only on the initial render to pass it to the pop-up form 
    when adding or editing, to prevent repeating the request each time the
    pop-up is opened-*/
  useEffect(() => {
    axios
      .post("/add-vendors/get/userid_id", null)
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch(() => {
        alert("Failed to Fetch Users List");
      });

    console.log(rowsToDelete.length);
  }, []);

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    if (openPopup) return;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/add-vendors?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
          `/add-vendors/search/name?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
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
  }, [page, searchValue, openPopup, sortModel, pageSize]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        {pageHeader}
      </Typography>

      <Divider my={6} />

      <Card mb={6}>
        <Paper mb={2}>
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              borderRadius: "3px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {/* {userPermissions.includes("add_vendor_create") ? (
                <Button
                  className={classes.button}
                  variant="contained"
                  onClick={() => {
                    setOpenPopupTitle("New Vendor");
                    setOpenPopup(true);
                    setVendor("");
                  }}
                  startIcon={<Add />}
                >
                  Add Vendor
                </Button>
              ) : null} */}

              {userPermissions.includes("add_vendor_delete") ? (
                <Button
                  color="secondary"
                  variant="contained"
                  disabled={rowsToDelete.length < 2}
                  onClick={() => {
                    setOpenMassDeleteDialog(true);
                  }}
                  style={{
                    height: "40px",
                    alignSelf: "center",
                    borderRadius: 0,
                  }}
                  startIcon={<Delete />}
                >
                  Delete Selected
                </Button>
              ) : null}
            </div>

            <div>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item xs={2}>
                  <Search />
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    id="input-with-icon-grid"
                    label="Search"
                    onChange={handleSearchInput}
                  />
                </Grid>
              </Grid>
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
              checkboxSelection
              disableColumnMenu
              autoHeight={true}
              onRowClick={
                userPermissions.includes("add_vendor_show")
                  ? ({ row }) => history.push(`/vendor/vendors/${row.id}`)
                  : null
              }
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSize}
              onSortModelChange={handleSortModelChange}
              onSelectionChange={(newSelection) => {
                setRowsToDelete(newSelection.rowIds);
              }}
            />
          </div>
        </Paper>
      </Card>
      <Popup
        title={openPopupTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <VendorsForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={vendor}
          users={users}
        />
      </Popup>

      <Dialog
        open={openDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Vendor? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              DeleteVendor();
            }}
            color="secondary"
          >
            Yes, delete
          </Button>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            autoFocus
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openApproveDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Vendor Approval"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By approving this vendor they will be able to take actions, proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              approveVendor();
            }}
            color="secondary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenApproveDialog(false)}
            color="primary"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openMassDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all the selected Vendors? <br />
            If you wish press Yes, otherwise press Back.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              MassDelete();
            }}
            color="secondary"
          >
            Yes, delete
          </Button>
          <Button
            onClick={() => setOpenMassDeleteDialog(false)}
            color="primary"
            autoFocus
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Vendors;
