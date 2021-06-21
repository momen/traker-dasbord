import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";
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
import { UnfoldLess } from "@material-ui/icons";
import Popup from "../../../Popup";
import axios from "../../../../axios";
import AreaForm from "./AreaForm";
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
  button: {
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
    },
    marginRight: "5px",
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: "6px",
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
}));

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

function Countries() {
  const classes = useStyles();
  const { userPermissions, user } = useSelector((state) => state);
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Product");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [columnToFilter, setColumnToFilter] = useState("");
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(""); // Customize
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const [countries, setCountries] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "area_name", headerName: "Area", width: 200 },
    { field: "country_name", headerName: "Country", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      flex: 1,
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
            {userPermissions.includes("area_show") ? (
              <Button
                style={{
                  marginRight: "5px",
                  minWidth: "70px",
                }}
                variant="contained"
                size="small"
                onClick={() =>
                  history.push(`/geography/areas/${params.row.id}`)
                }
              >
                View
              </Button>
            ) : null}
            {userPermissions.includes("area_update") ? (
              <Button
                style={{
                  marginRight: "5px",
                  minWidth: "70px",
                }}
                color="primary"
                variant="contained"
                size="small"
                onClick={() => {
                  setSelectedItem(params.row);
                  setOpenPopup(true);
                  setOpenPopupTitle(
                    "Update Area Details"
                  ); /****** Customize ******/
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("area_delete") ? (
              <Button
                style={{ minWidth: "70px" }}
                color="secondary"
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

  const handleColumnToFilter = (event) => {
    setColumnToFilter(event.target.value);
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
      setSearchValue("");
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

  const DeleteRecord = () => {
    axios
      .delete(`/areas/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios
          .get(
            `/areas?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
      .post(`/areas/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        axios
          .get(
            `/areas?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  /*-Get Countries only on the initial render to pass it to the pop-up form 
    when adding or editing, to prevent repeating the request each time the
    pop-up is opened-*/
  useEffect(() => {
    axios
      .get("/countries/list/all")
      .then((res) => {
        let _countries = res.data.data.map(({ id, country_name }) => ({
          id,
          country_name,
        })); // Customize
        setCountries(_countries);
      })
      .catch(() => {
        alert("Failed to Fetch data");
      });
  }, []);

  // Request the page records either on the initial render, data changed (added/edited/deleted)
  // or whenever the page changes (Pagination)
  useEffect(() => {
    if (openPopup) return;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/areas?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
          `/areas/search/name?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
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
          alert("Failed to Search");
        });
    }
  }, [page, searchValue, openPopup, sortModel, pageSize]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Areas
      </Typography>

      <Divider my={6} />

      <Grid container flex>
        {userPermissions.includes("area_create") ? (
          <Button
            mb={3}
            className={classes.button}
            variant="contained"
            onClick={() => {
              setOpenPopupTitle("New Area");
              setOpenPopup(true);
              setSelectedItem("");
            }}
          >
            Add New Area
          </Button>
        ) : null}

        {userPermissions.includes("area_delete") ? (
          <Button
            mb={3}
            color="secondary"
            variant="contained"
            disabled={rowsToDelete.length < 2}
            onClick={() => {
              setOpenMassDeleteDialog(true);
            }}
          >
            Delete Selected
          </Button>
        ) : null}
      </Grid>

      <Card mb={6}>
        <Paper mb={2}>
          <Toolbar className={classes.toolBar}>
            <Grid
              container
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item>
                <FormControl variant="outlined">
                  <Select
                    value={pageSize}
                    onChange={handlePageSize}
                    autoWidth
                    IconComponent={UnfoldLess}
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
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <div style={{ display: "flex" }}>
                  <Grid
                    container
                    spacing={1}
                    alignItems="flex-end"
                    style={{ marginRight: "5px" }}
                  >
                    <Grid item>
                      <Search />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="input-with-icon-grid"
                        label="Find countries"
                        onChange={handleSearchInput}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
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
        <AreaForm
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
            Are you sure you want to delete this Area? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              DeleteRecord();
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
            Are you sure you want to delete all the selected Areas? <br />
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

export default Countries;
