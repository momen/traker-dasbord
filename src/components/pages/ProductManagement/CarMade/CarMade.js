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
import { AccountCircle, TextFields, UnfoldLess } from "@material-ui/icons";
import Popup from "../../../Popup";
import AddForm from "../../../AddForm";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import CreateCarMade from "./CreateCarMade";
import { Pagination } from "@material-ui/lab";
import { Search } from "react-feather";

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
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
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

function CarMade() {
  const classes = useStyles();
  const [{ user, userPermissions }] = useStateValue();
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Car Made");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [carMade, setCarMade] = useState("");
  const [categories, setCategories] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "car_made", headerName: "Car Made", width: 200, flex: 1 },
    { field: "catName", headerName: "Category", width: 200, flex: 1 },
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
            {userPermissions.includes("car_made_show") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                onClick={() =>
                  history.push(`/product/car-made/${params.row.id}`)
                }
              >
                View
              </Button>
            ) : null}

            {userPermissions.includes("car_made_edit") ? (
              <Button
                style={{ marginRight: "5px" }}
                color="primary"
                variant="contained"
                onClick={() => {
                  setCarMade(params.row);
                  setOpenPopup(true);
                  setOpenPopupTitle("Edit Car Made");
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("car_made_delete") ? (
              <Button
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

  const handlePageSize = (event) => {
    setPageSize(event.target.value);
  };

  const handlePageChange = ({ page }) => {
    setPage(page);
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

  const DeleteCarMade = async () => {
    await axios
      .delete(`/car-mades/${itemToDelete}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setOpenDeleteDialog(false);
      });

    await axios
      .get(`/car-mades?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (Math.ceil(res.data.total / pageSize) < page) {
          setPage(page - 1);
        }
        setRowsCount(res.data.total);
        setRows(res.data.data);
        setLoading(false);
      });
  };

  /*-Get categories only on the initial render to pass it to the pop-up form 
    when adding or editing, to prevent repeating the request each time the
    pop-up is opened-*/
  useEffect(() => {
    axios
      .get("/categorieslist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let _categories = res.data.data.map(({ id, name }) => ({ id, name }));
        setCategories(_categories);
      });
  }, []);

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    console.log("In Effect");
    if (openPopup) return;
    setLoading(true);
    console.log("Passed");
    if (!userIsSearching) {
      axios
        .get(`/car-mades?page=${page}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setRowsCount(res.data.total);
          setRows(res.data.data);
          setLoading(false);
        });
    } else {
      axios
        .post(
          "/car-mades/search/name",
          {
            search_index: searchValue,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          setRowsCount(res.data.total);
          setRows(res.data.data);
          setLoading(false);
        });
    }
  }, [page, searchValue, openPopup]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Car Made List
      </Typography>

      <Divider my={6} />

      {userPermissions.includes("car_made_create") ? (
        <Button
          mb={3}
          className={classes.button}
          variant="contained"
          onClick={() => {
            setOpenPopup(true);
            setCarMade("");
          }}
        >
          Add Car Made
        </Button>
      ) : null}

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
              paginationMode="server"
              components={{
                Pagination: CustomPagination,
                LoadingOverlay: CustomLoadingOverlay,
              }}
              loading={loading}
              checkboxSelection
              disableColumnMenu
              autoHeight={true}
              onPageChange={handlePageChange}
            />
          </div>
        </Paper>
      </Card>
      <Popup
        title={openPopupTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CreateCarMade
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={carMade}
          categories={categories}
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
            Are you sure you want to delete this Car Made? <br />
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
    </React.Fragment>
  );
}

export default CarMade;
