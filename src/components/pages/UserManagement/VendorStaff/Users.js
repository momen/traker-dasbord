import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import {
  Link,
  Breadcrumbs as MuiBreadcrumbs,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TextField,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";

import { spacing } from "@material-ui/system";
import { Delete, Search, UnfoldLess } from "@material-ui/icons";
import Popup from "../../../Popup";
import axios from "../../../../axios";
import UsersForm from "./UsersForm";
import { Pagination } from "@material-ui/lab";
import { useSelector } from "react-redux";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);

const useStyles = makeStyles({
  root: {
    display: "flex",
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
  roleBadge: {
    background: "#FFBF00",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: "6px",
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
});

function CustomPagination(props) {
  const { state, api } = props;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      color="primary"
      page={state.pagination.page}
      count={state.pagination.pageCount}
      showFirstButton={true}
      showLastButton={true}
      onChange={(event, value) => api.current.setPage(value)}
    />
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

function Users() {
  const classes = useStyles();
  const userPermissions = useSelector((state) => state.userPermissions);
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New User");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [memberToApprove, setMemberToApprove] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [rolesList, setRolesList] = useState("");
  const [stores, setStores] = useState([]);
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 55 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "email", headerName: "Email", width: 180 },

    {
      field: "name",
      headerName: "Name",
      width: 120,
      sortable: false,
    },
    {
      field: "approved",
      headerName: "Status",
      width: 120,
      renderCell: (params) =>
        params.row.approved === 0 ? "Pending Approval" : "Approved",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              // padding: "5px"
            }}
          >
            {params.row.approved === 0 ? (
              <Button
                style={{ marginRight: "5px" }}
                className={classes.button}
                variant="contained"
                size="small"
                onClick={() => {
                  setMemberToApprove(params.row.id);
                  setOpenApprovalDialog(true);
                }}
              >
                Approve
              </Button>
            ) : null}
            {/* {userPermissions.includes("user_show_by_vendor") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                size="small"
                onClick={() =>
                  history.push(`/user-mgt/vendor-users/${params.row.id}`)
                }
              >
                View
              </Button>
            ) : null} */}

            {userPermissions.includes("user_delete_by_vendor") ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Delete />}
                // color="secondary"
                variant="contained"
                size="small"
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

  const handlePageSize = (event) => {
    setPageSize(event.target.value);
  };

  const handlePageChange = ({ page }) => {
    setPage(page);
  };

  const handleSortModelChange = (params) => {
    console.log(params);
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

  const approveUser = () => {
    axios
      .post(`vendor/approve/staff`, {
        staff_id: memberToApprove,
      })
      .then(() => {
        setOpenApprovalDialog(false);
        setLoading(true);
        axios
          .get(
            `/users?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  const DeleteItem = () => {
    axios
      .delete(`/users/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios
          .get(
            `/users?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
      .post(`/users/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        axios
          .get(
            `/users?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
    axios
      .get(`/roleslist`)
      .then((res) => {
        setRolesList(res.data.data);
      })
      .catch(({ response }) => {
        // alert(response.data?.errors);
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
  }, []);

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    if (openPopup) return;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/users?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
          `/users/search/name?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
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
        Staff
      </Typography>
      <Divider my={6} />
      <Card mb={6}>
        <Paper mb={2}>
          <Toolbar className={classes.toolBar}>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {userPermissions.includes("vendor_add_staff") ? (
                <Button
                  data-test="users-create-btn"
                  className={classes.button}
                  variant="contained"
                  onClick={() => {
                    setSelectedItem("");
                    setOpenPopup(true);
                    setOpenPopupTitle("New User");
                  }}
                >
                  Add User
                </Button>
              ) : null}

              {userPermissions.includes("user_delete_by_vendor") ? (
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
                userPermissions.includes("user_show_by_vendor")
                  ? ({ row }) => history.push(`/user-mgt/vendor-users/${row.id}`)
                  : null
              }
              onPageChange={handlePageChange}
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
        <UsersForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          rolesList={rolesList}
          stores={stores}
        />
      </Popup>
      <Dialog
        open={openApprovalDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Staff Approval"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to approve this Staff member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              approveUser();
            }}
            color="secondary"
          >
            Approve User
          </Button>
          <Button
            onClick={() => setOpenApprovalDialog(false)}
            color="primary"
            autoFocus
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

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
            Are you sure you want to delete this User? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              DeleteItem();
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
            Are you sure you want to delete all the selected Users? <br />
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

export default Users;
