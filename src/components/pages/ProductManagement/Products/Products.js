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
import { useStateValue } from "../../../../StateProvider";
import ProductsForm from "./ProductsForm";
import { Pagination } from "@material-ui/lab";
import { Search } from "react-feather";

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
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: "6px",
  },

  permissionBadge: {
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

function Products() {
  const classes = useStyles();
  const [{ user, userPermissions }] = useStateValue();
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState("New Product");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(""); // Customize
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [categories, setCategories] = useState([]);
  const [carMades, setCarMades] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [partCategories, setPartCategories] = useState([]);
  const [carYears, setCarYears] = useState([]);
  const [stores, setStores] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 45 },
    { field: "name", headerName: "Name", width: 80 },
    { field: "description", headerName: "Description", width: 80 },
    {
      field: "car_model",
      headerName: "Car Model",
      width: 80,
      renderCell: (params) => params.value?.carmodel,
    },
    {
      field: "year",
      headerName: "Year",
      width: 50,
      renderCell: (params) => params.value?.year,
    },
    { field: "price", headerName: "Price", width: 70 },
    {
      field: "discount",
      headerName: "Discount",
      width: 70,
      renderCell: (params) => `%${params.value}`,
      align: "center",
    },
    {
      field: "categories",
      headerName: "Categories",
      width: 100,
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.value?.map((category) => (
            <span key={category.id} className={classes.permissionBadge}>
              {category.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: "photo",
      headerName: "Photos",
      width: 60,
      renderCell: (params) => (
        <Fragment>
          {params.value?.map((img) => (
            <img
              src={img.image}
              alt="ph"
              style={{ objectFit: "contain", width: 50 }}
            />
          ))}
        </Fragment>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
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
            {userPermissions.includes("product_show") ? (
              <Button
                style={{
                  marginRight: "5px",
                  minWidth: "50px",
                  maxWidth: "50px",
                }}
                variant="contained"
                size="small"
                onClick={() => history.push(`/products/${params.row.id}`)}
              >
                View
              </Button>
            ) : null}
            {userPermissions.includes("product_edit") ? (
              <Button
                style={{
                  marginRight: "5px",
                  minWidth: "50px",
                  maxWidth: "50px",
                }}
                color="primary"
                variant="contained"
                size="small"
                onClick={() => {
                  setSelectedItem(params.row);
                  setOpenPopup(true);
                  setOpenPopupTitle("Edit Product"); /****** Customize ******/
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("product_delete") ? (
              <Button
                style={{ minWidth: "50px", maxWidth: "50px" }}
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
    {
      field: "car_made",
      headerName: "Car Made",
      width: 80,
      renderCell: (params) => params.value.car_made,
    },
    {
      field: "part_category",
      headerName: "Part Category",
      width: 80,
      renderCell: (params) => params.value?.category_name,
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

  const DeleteCategory = async () => {
    console.log(itemToDelete);
    await axios
      .delete(`/products/${itemToDelete}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setOpenDeleteDialog(false);
      });

    await axios
      .get(`/products?page=${page}`, {
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

  /*-Get car mades only on the initial render to pass it to the pop-up form 
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
        const _categories = res.data.data.map(({ id, name }) => ({ id, name }));
        setCategories(_categories);
      });

    axios
      .get("/car-madeslist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const _carMades = res.data.data.map(({ id, car_made }) => ({
          id,
          car_made,
        })); // Customize
        setCarMades(_carMades);
      });

    axios
      .get("/car-modelslist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const _carModels = res.data.data.map(({ id, carmodel }) => ({
          id,
          carmodel,
        })); // Customize
        setCarModels(_carModels);
      });

    axios
      .get("/car-yearslist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const _carYears = res.data.data.map(({ id, year }) => ({
          id,
          year,
        })); // Customize
        setCarYears(_carYears);
      });

    axios
      .get("/part-categorieslist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const _partCategories = res.data.data.map(({ id, category_name }) => ({
          id,
          category_name,
        })); // Customize
        setPartCategories(_partCategories);
      });
  }, []);

  // Request the page records either on the initial render, data changed (added/edited/deleted)
  // or whenever the page changes (Pagination)
  useEffect(() => {
    if (openPopup) return;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(`/products?page=${page}`, {
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
          "/products/search/name",
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
    // setItemAddedOrEdited(false);
  }, [page, searchValue, openPopup]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Products
      </Typography>

      <Divider my={6} />

      {userPermissions.includes("product_create") ? (
        <Button
          mb={3}
          className={classes.button}
          variant="contained"
          onClick={() => {
            setOpenPopupTitle("New Product");
            setOpenPopup(true);
            setSelectedItem("");
          }}
        >
          Add Product
        </Button>
      ) : null}

      <Card mb={6}>
        <Paper mb={2}>
          <Toolbar className={classes.toolBar}>
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
              columnBuffer={pageSize}
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
        <ProductsForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
          categories={categories}
          carMades={carMades}
          carModels={carModels}
          partCategories={partCategories}
          carYears={carYears}
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
            Are you sure you want to delete this Product? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              DeleteCategory();
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

export default Products;
