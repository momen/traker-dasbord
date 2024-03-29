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
  makeStyles,
  LinearProgress,
  Grid,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
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
import BrandsForm from "./BrandsForm";
import { Pagination } from "@material-ui/lab";
import { Search } from "react-feather";
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

function CarMade() {
  const classes = useStyles();
  const { userPermissions, lang } = useSelector((state) => state);
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Brand");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [carMade, setCarMade] = useState("");
  const [carTypes, setCarTypes] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const [pageHeader, setPageHeader] = useState("Brands List");
  const [viewMode, setViewMode] = useState("data-grid");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "car_made", headerName: "Brand Name", width: 200, flex: 1 },
    {
      field: "car_type",
      headerName: "Vehicle Type",
      width: 200,
      flex: 1,
      renderCell: (params) => params.value?.type_name,
    },
    // {
    //   field: "categoryid",
    //   headerName: "Category",
    //   width: 200,
    //   flex: 1,
    //   renderCell: (params) => params.getValue("id"),
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
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
            {/* {userPermissions.includes("car_made_show") ? (
            <Button
              style={{ marginRight: "5px" }}
              variant="contained"
              onClick={() =>
                history.push(`/product/car-made/${params.row.id}`)
              }
            >
              View
            </Button>
          ) : null} */}

            {userPermissions.includes("car_made_edit") ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Edit />}
                style={{ marginRight: "5px" }}
                color="primary"
                variant="contained"
                onClick={() => {
                  setCarMade(params.row);
                  setViewMode("edit");
                  setPageHeader("Edit Brand");
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("car_made_delete") ? (
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

  const DeleteCarMade = () => {
    axios
      .delete(`/car-mades/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios
          .get(
            `/car-mades?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
      .post(`/car-mades/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        axios
          .get(
            `/car-mades?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  /*-Get categories only on the initial render to pass it to the pop-up form 
    when adding or editing, to prevent repeating the request each time the
    pop-up is opened-*/
  useEffect(() => {
    axios
      .get("/cartypes/list")
      .then((res) => {
        const _carTypes = res.data.data.map(({ id, type_name, name_en }) => ({
          id,
          type_name,
          name_en,
        })); // Customize
        setCarTypes(_carTypes);
      })
      .catch(() => {
        alert("Failed to Fetch Car Types List");
      });
  }, [lang]);

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    if (openPopup) return;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/car-mades?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
          `/car-mades/search/name?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
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
                borderRadius: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                {userPermissions.includes("car_made_create") ? (
                  <Button
                    id="CarMade_Button"
                    className={classes.button}
                    variant="contained"
                    onClick={() => {
                      // setOpenPopup(true);
                      setViewMode("add");
                      setPageHeader("New Brand");
                    }}
                    startIcon={<Add />}
                  >
                    Add New Brand
                  </Button>
                ) : null}

                {userPermissions.includes("car_made_delete") ? (
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
                  userPermissions.includes("car_made_show")
                    ? ({ row }) => history.push(`/product/car-made/${row.id}`)
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
              setPageHeader("Brands List");
            }}
          >
            <ArrowBack className={classes.backIcon} />
            <span>Back</span>
          </div>

          <Divider my={3} />
          <BrandsForm
            setPage={setPage}
            setOpenPopup={setOpenPopup}
            itemToEdit={carMade}
            carTypes={carTypes}
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
        <BrandsForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={carMade}
          carTypes={carTypes}
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
            Are you sure you want to delete this Brand? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              DeleteCarMade();
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
            Are you sure you want to delete all the selected Brands? <br />
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

export default CarMade;
