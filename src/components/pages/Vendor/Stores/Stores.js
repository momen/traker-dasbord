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
import {
  Add,
  ArrowBack,
  Delete,
  Edit,
  ExpandMore,
  UnfoldLess,
} from "@material-ui/icons";
import Popup from "../../../Popup";
import axios from "../../../../axios";
import StoresForm from "./StoresForm";
import { Pagination } from "@material-ui/lab";
import { Search } from "react-feather";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  memberBadge: {
    background: "#98A9FF",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
  },
  billingAddress: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px",
    color: "#FFA920",
    border: "1px solid #FFA920",
    width: "100%",
    height: 30,
  },
  shippingAddress: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px",
    color: "#717171",
    border: "1px solid #717171",
    width: "100%",
    height: 30,
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

function Stores() {
  const classes = useStyles();
  const history = useHistory();
  const { user, userPermissions, lang } = useSelector((state) => state);
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Branch");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState(""); /****** Customize ******/
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [countries, setCountries] = useState([]);

  const [pageHeader, setPageHeader] = useState("Branches");
  const [viewMode, setViewMode] = useState("data-grid");

  const location = useLocation();

  const columnsAdmin = [
    {
      field: "id",
      headerName: "ID",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "company",
      headerName: "Company",
      width: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.row.vendor?.company_name,
    },
    {
      field: "name",
      headerName: "Branch",
      width: 100,
    },
    {
      field: "serial_id",
      headerName: "Serial",
      width: 80,
    },
    {
      field: "vendor_name",
      headerName: "Vendor",
      sortable: false,
      width: 100,
    },
    {
      field: "vendor_type",
      headerName: "Vendor Type",
      sortable: false,
      width: 120,
      renderCell: (params) =>
        params.row.vendor?.type == "1"
          ? "Retailer"
          : params.row.vendor?.type == "2"
          ? "Wholesaler"
          : "Retailer/Wholesaler",
    },
    {
      field: "head_center",
      headerName: "Address Type",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <div className={classes.billingAddress}>Billing</div>
        ) : (
          <span className={classes.shippingAddress}>Shipping</span>
        ),
    },
    { field: "address", headerName: "Address", width: 100 },

    {
      field: "members",
      headerName: "Members",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          {params.value?.map((member) => (
            <span key={member.id} className={classes.memberBadge}>
              {member.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
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
            {/* {userPermissions.includes("stores_show") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                size="small"
                onClick={() => {
                  history.push(`${location.pathname}/${params.row.id}`);
                  console.log(location);
                }}
              >
                View
              </Button>
            ) : null} */}
            {userPermissions.includes("stores_edit") ? (
              <Button
                style={{ marginRight: "5px" }}
                className={classes.actionBtn}
                startIcon={<Edit />}
                // color="primary"
                variant="contained"
                // size="small"
                onClick={() => {
                  setSelectedItem(params.row);
                  setViewMode("edit");
                  setPageHeader("Update Branch Details");
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("stores_delete") &&
            !params.row.head_center &&
            !params.row.members?.length ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Delete />}
                // color="secondary"
                variant="contained"
                // size="small"
                onClick={() => openDeleteConfirmation(params.row.id)}
              >
                Delete
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  const columnsVendor = [
    {
      field: "name",
      headerName: "Branch",
      width: 100,
    },
    {
      field: "serial_id",
      headerName: "Serial",
      width: 80,
      flex: 1,
    },
    {
      field: "head_center",
      headerName: "Address Type",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <div className={classes.billingAddress}>Billing</div>
        ) : (
          <span className={classes.shippingAddress}>Shipping</span>
        ),
    },
    { field: "address", headerName: "Address", width: 120, flex: 1 },

    {
      field: "members",
      headerName: "Members",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.value?.map((member) => (
            <span key={member.id} className={classes.memberBadge}>
              {member.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
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
            {/* {userPermissions.includes("stores_show") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                size="small"
                onClick={() => {
                  history.push(`${location.pathname}/${params.row.id}`);
                  console.log(location);
                }}
              >
                View
              </Button>
            ) : null} */}
            {userPermissions.includes("stores_edit") ? (
              <Button
                style={{ marginRight: "5px" }}
                className={classes.actionBtn}
                startIcon={<Edit />}
                // color="primary"
                variant="contained"
                // size="small"
                onClick={() => {
                  setSelectedItem(params.row);
                  setViewMode("edit");
                  setPageHeader("Update Branch Details");
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("stores_delete") &&
            !params.row.head_center ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Delete />}
                // color="secondary"
                variant="contained"
                // size="small"
                onClick={() => openDeleteConfirmation(params.row.id)}
              >
                Delete
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  const handlePageSize = ({ pageSize }) => {
    setPageSize(pageSize);
    setPage(1);
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

  const DeleteStore = () => {
    axios
      .delete(`/stores/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios
          .get(
            `/stores?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
            alert(
              response.data?.errors ||
                response.data?.error ||
                response.data?.message
            );
          });
      })
      .catch(({ response }) => {
        alert(
          response.data?.errors ||
            response.data?.error ||
            response.data?.message
        );
      });
  };

  const MassDelete = () => {
    axios
      .post(`/stores/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        axios
          .get(
            `/stores?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
            alert(
              response.data?.errors ||
                response.data?.error ||
                response.data?.message
            );
          });
      })
      .catch(({ response }) => {
        alert(
          response.data?.errors ||
            response.data?.error ||
            response.data?.message
        );
      });
  };

  useEffect(() => {
    axios
      .get("/countries/list/all")
      .then((res) => {
        const _countries = res.data.data.map(
          ({ id, country_name, phonecode }) => ({
            id,
            country_name,
            phonecode,
          })
        );
        setCountries(_countries);
      })
      .catch(({ response }) => {
        alert(
          response.data?.errors ||
            response.data?.error ||
            response.data?.message
        );
      });
  }, [lang]);

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    if (openPopup) return;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/stores?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
        )
        .then((res) => {
          setRowsCount(res.data.total);
          setRows(res.data.data);
          setLoading(false);
        })
        .catch(({ response }) => {
          alert(
            response.data?.errors ||
              response.data?.error ||
              response.data?.message ||
              response.data
          );
        });
    } else {
      axios
        .post(
          `/stores/search/name?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
          {
            search_index: searchValue,
          }
        )
        .then((res) => {
          setRowsCount(res.data.total);
          setRows(res.data.data);
          setLoading(false);
        })
        .catch(({ response }) => {
          alert(
            response.data?.errors ||
              response.data?.error ||
              response.data?.message ||
              response.data
          );
        });
    }
  }, [page, searchValue, openPopup, sortModel, pageSize, viewMode, lang]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        {pageHeader}
      </Typography>

      <Divider my={6} />

      {viewMode === "data-grid" ? (
        <Card mb={6}>
          <Paper mb={2}>
            <Toolbar
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                borderRadius: "3px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                {userPermissions.includes("stores_create") ? (
                  <Button
                    className={classes.button}
                    variant="contained"
                    onClick={() => {
                      setSelectedItem("");
                      setViewMode("add");
                      setPageHeader("New Branch");
                    }}
                    startIcon={<Add />}
                  >
                    Add Branch
                  </Button>
                ) : null}

                {userPermissions.includes("stores_delete") ? (
                  <Button
                    startIcon={<Delete />}
                    color="secondary"
                    variant="contained"
                    disabled={rowsToDelete.length < 2}
                    onClick={() => {
                      setOpenMassDeleteDialog(true);
                    }}
                    style={{ height: 40, borderRadius: 0 }}
                  >
                    Delete Selected
                  </Button>
                ) : null}
              </div>

              <div>
                <Grid container spacing={1} alignItems="flex-end">
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
            </Toolbar>
          </Paper>
          <Paper>
            <div style={{ width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={user.roles[0].id === 1 ? columnsAdmin : columnsVendor}
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
                // checkboxSelection
                disableColumnMenu
                autoHeight={true}
                onRowClick={
                  userPermissions.includes("stores_show")
                    ? ({ row }) =>
                        history.push(`${location.pathname}/${row.id}`)
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
      ) : (
        <Card mb={6} style={{ padding: "50px 60px" }}>
          <div
            className={classes.backBtn}
            onClick={() => {
              setViewMode("data-grid");
              setPageHeader("Branches");
            }}
          >
            <ArrowBack className={classes.backIcon} />
            <span>Back</span>
          </div>

          <Divider my={3} />
          <StoresForm
            setPage={setPage}
            setOpenPopup={setOpenPopup}
            itemToEdit={selectedItem}
            countries={countries}
            setViewMode={setViewMode}
            setPageHeader={setPageHeader}
          />
        </Card>
      )}
      <Popup
        title={openPopupTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <StoresForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
          countries={countries}
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
            Are you sure you want to delete this Branch? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              DeleteStore();
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
        open={openMassDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all the selected Branches? <br />
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

export default Stores;
