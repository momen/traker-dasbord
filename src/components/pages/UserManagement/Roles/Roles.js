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
import RolesForm from "./RolesForm";
import { Pagination } from "@material-ui/lab";
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
  permissionBadge: {
    background: "#00b3b3",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "5px",
    marginRight: "5px",
    userSelect: "none",
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

function Roles() {
  const classes = useStyles();
  const history = useHistory();
  const userPermissions = useSelector((state) => state.userPermissions);
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Permission");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [permissionsList, setPermissionsList] = useState("");
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const [pageHeader, setPageHeader] = useState("Roles");
  const [viewMode, setViewMode] = useState("data-grid");

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", width: 100 },
    {
      field: "permissions",
      headerName: "Permissions",
      width: 300,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.value.map((permission) => (
            <span key={permission.id} className={classes.permissionBadge}>
              {permission.title}
            </span>
          ))}
        </div>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 250,
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
            {/* {userPermissions.includes("role_show") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                onClick={() => history.push(`/user-mgt/roles/${params.row.id}`)}
              >
                View
              </Button>
            ) : null} */}
            {userPermissions.includes("role_edit") ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Edit />}
                style={{ marginRight: "5px" }}
                color="primary"
                variant="contained"
                onClick={() => {
                  setSelectedItem(params.row);
                  setViewMode("edit");
                  setPageHeader("Edit Role");
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("role_delete") ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Delete />}
                color="secondary"
                variant="contained"
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
  };

  const handlePageChange = ({ page }) => {
    setPage(page);
  };

  const handleSortModelChange = (params) => {
    if (params.sortModel !== sortModel) {
      setSortModel(params.sortModel);
    }
  };

  const openDeleteConfirmation = (id) => {
    setOpenDeleteDialog(true);
    setItemToDelete(id);
  };

  const DeleteItem = () => {
    axios
      .delete(`/roles/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios
          .get(
            `/roles?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
      .post(`/roles/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        axios
          .get(
            `/roles?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  useEffect(() => {
    axios
      .get("/permissionslist")
      .then((res) => {
        setPermissionsList(res.data.data);
      })
      .catch(({ response }) => {
        // alert(response.data?.errors);
      });
  }, []);

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    if (!openPopup) {
      setLoading(true);
      axios
        .get(
          `/roles?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
  }, [page, openPopup, sortModel, pageSize, viewMode]);

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
            <Toolbar>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                {userPermissions.includes("role_create") ? (
                  <Button
                    mb={3}
                    className={classes.button}
                    variant="contained"
                    onClick={() => {
                      setSelectedItem("");
                      setViewMode("add");
                      setPageHeader("New Role");
                    }}
                    startIcon={<Add />}
                  >
                    Add Role
                  </Button>
                ) : null}

                {userPermissions.includes("role_delete") ? (
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
                  userPermissions.includes("role_show")
                    ? ({ row }) => history.push(`/user-mgt/roles/${row.id}`)
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
              setPageHeader("Roles");
            }}
          >
            <ArrowBack className={classes.backIcon} />
            <span>Back</span>
          </div>
          <Divider my={3} />
          <RolesForm
            setPage={setPage}
            setOpenPopup={setOpenPopup}
            itemToEdit={selectedItem}
            permissionsList={permissionsList}
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
        <RolesForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
          permissionsList={permissionsList}
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
            Are you sure you want to delete this Role? <br />
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
            Are you sure you want to delete all the selected Roles? <br />
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

export default Roles;
