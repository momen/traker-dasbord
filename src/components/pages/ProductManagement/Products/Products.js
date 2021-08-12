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
import ProductsForm from "./ProductsForm";
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

function Products() {
  const classes = useStyles();
  const { userPermissions, user, lang } = useSelector((state) => state);
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
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carMades, setCarMades] = useState([]);
  const [carYears, setCarYears] = useState([]);
  const [stores, setStores] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [originCountries, setOriginCountries] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [transmissionsList, setTransmissionsList] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [sortModel, setSortModel] = useState([{ field: "", sort: "asc" }]);
  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [productToApproveOrRejct, setProductToApproveOrRejct] = useState();

  const [pageHeader, setPageHeader] = useState("Products");
  const [viewMode, setViewMode] = useState("data-grid");

  const columns = [
    { field: "id", headerName: "ID", width: 45 },
    { field: "name", headerName: "Name", width: 80 },
    { field: "serial_number", headerName: "Serial Number", width: 100 },
    {
      field: "store_name",
      headerName: "Store",
      width: 100,
      renderCell: (params) => params.row.store?.name,
    },
    { field: "quantity", headerName: "Quantity", width: 70 },
    {
      field: "product_type",
      headerName: "Type",
      width: 65,
      sortable: false,
      renderCell: (params) => params.row.producttype_id?.producttype,
    },
    { field: "price", headerName: "Price", width: 80 },
    {
      field: "discount",
      headerName: "Discount",
      width: 60,
      renderCell: (params) =>
        params.value ? `%${parseFloat(params.value).toFixed(2)}` : "%0",
      align: "center",
    },
    { field: "holesale_price", headerName: "Wholesale Price", width: 80 },
    // { field: "no_of_orders", headerName: "No of orders", width: 60 },

    {
      field: "photo",
      headerName: "Photos",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          {params.value?.map((img, index) => (
            <img
              key={img.uuid}
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
            {/* {userPermissions.includes("product_show") ? (
              <Button
                style={{
                  marginRight: "5px",
                  minWidth: "50px",
                  maxWidth: "50px",
                }}
                variant="contained"
                size="small"
                onClick={() =>
                  history.push(`/product/products/${params.row.id}`)
                }
              >
                View
              </Button>
            ) : null} */}
            {userPermissions.includes("product_edit") && params.row.approved ? (
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
                  setSelectedItem(params.row);
                  // setOpenPopup(true);
                  // setOpenPopupTitle("Edit Product");
                  setViewMode("edit");
                  setPageHeader("Edit Product");
                }}
              >
                Edit
              </Button>
            ) : null}

            {userPermissions.includes("product_delete") &&
            params.row.approved ? (
              <Button
                className={classes.actionBtn}
                style={{
                  marginRight: "5px",
                }}
                startIcon={<Delete />}
                color="secondary"
                variant="contained"
                size="small"
                onClick={() => openDeleteConfirmation(params.row.id)}
              >
                Delete
              </Button>
            ) : null}

            {user.roles[0].id === 1 && !params.row.approved ? (
              <Button
                style={{ marginRight: "5px" }}
                className={classes.approveButton}
                variant="contained"
                size="small"
                onClick={() => {
                  setOpenApproveDialog(true);
                  setProductToApproveOrRejct(params.row.id);
                }}
              >
                Approve
              </Button>
            ) : null}

            {/* {user.roles[0].id === 1 && !params.row.approved ? (
              <Button
                style={{ marginRight: "5px" }}
                className={classes.cancelButton}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  setOpenRejectDialog(true);
                  setProductToApproveOrRejct(params.row.id);
                }}
              >
                Reject
              </Button>
            ) : null} */}
          </div>
        );
      },
    },
  ];

  const handlePageSize = ({ pageSize }) => {
    setPageSize(pageSize);
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

  const approveProduct = () => {
    axios
      .post(`/approve/products`, {
        product_id: productToApproveOrRejct,
      })
      .then(() => {
        setOpenApproveDialog(false);
        setLoading(true);
        axios
          .get(
            `/products?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  const cancelProduct = () => {
    axios
      .post(`/vendor/cancel/order`, {
        order_id: productToApproveOrRejct,
      })
      .then(() => {
        setOpenRejectDialog(false);
        setLoading(true);
        axios
          .get(
            `/products?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  const openDeleteConfirmation = (id) => {
    setOpenDeleteDialog(true);
    setItemToDelete(id);
  };

  const DeleteProduct = () => {
    axios
      .delete(`/products/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setLoading(true);
        axios
          .get(
            `/products?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
      .post(`/products/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        axios
          .get(
            `/products?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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

  /*-Get car mades only on the initial render to pass it to the pop-up form 
    when adding or editing, to prevent repeating the request each time the
    pop-up is opened-*/
  useEffect(() => {
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
      .get("/main/categories/list/all")
      .then((res) => {
        const _mainCategories = res.data.data.map(
          ({ id, main_category_name }) => ({
            id,
            main_category_name,
          })
        );
        setMainCategories(_mainCategories);
      })
      .catch(() => {
        alert("Failed to Fetch Categories List");
      });

    axios
      .get("/categorieslist")
      .then((res) => {
        const _categories = res.data.data.map(({ id, name }) => ({ id, name }));
        setCategories(_categories);
      })
      .catch(() => {
        alert("Failed to Fetch Categories List");
      });

    axios
      .get("/car-madeslist")
      .then((res) => {
        const _carMades = res.data.data.map(({ id, car_made }) => ({
          id,
          car_made,
        })); // Customize
        setCarMades(_carMades);
      })
      .catch(() => {
        alert("Failed to Fetch Car Made List");
      });

    axios
      .get("/car-yearslist")
      .then((res) => {
        const _carYears = res.data.data.map(({ id, year }) => ({
          id,
          year,
        })); // Customize
        setCarYears(_carYears);
      })
      .catch(() => {
        alert("Failed to Fetch Car Year List");
      });

    axios
      .get("/manufacturer/list")
      .then((res) => {
        const _manufacturers = res.data.data.map(
          ({ id, manufacturer_name }) => ({
            id,
            manufacturer_name,
          })
        ); // Customize
        setManufacturers(_manufacturers);
      })
      .catch(() => {
        alert("Failed to Fetch Manufacturers List");
      });

    axios
      .get("/prodcountries/list")
      .then((res) => {
        const _countries = res.data.data.map(({ id, country_name }) => ({
          id,
          country_name,
        })); // Customize
        setOriginCountries(_countries);
      })
      .catch(() => {
        alert("Failed to Fetch Origin Countries List");
      });

    axios
      .get("/cartypes/list")
      .then((res) => {
        const _carTypes = res.data.data.map(({ id, type_name }) => ({
          id,
          type_name,
        })); // Customize
        setCarTypes(_carTypes);
      })
      .catch(() => {
        alert("Failed to Fetch Car Types List");
      });

    axios
      .get("/transmissions-list")
      .then((res) => {
        const _transmissionsList = res.data.data.map(
          ({ id, transmission_name }) => ({
            id,
            transmission_name,
          })
        ); // Customize
        setTransmissionsList(_transmissionsList);
      })
      .catch(() => {
        alert("Failed to Fetch Transmissions List");
      });

    axios
      .get("/product-tagslist")
      .then((res) => {
        const _tags = res.data.data.map(({ id, name }) => ({
          id,
          name,
        })); // Customize
        setProductTags(_tags);
      })
      .catch(() => {
        alert("Failed to Fetch Product Tags List");
      });

    axios
      .get("product/types/list")
      .then((res) => {
        const _productTypes = res.data.data.map(({ id, producttype }) => ({
          id,
          producttype,
        })); // Customize
        setProductTypes(_productTypes);
      })
      .catch(() => {
        alert("Failed to Fetch Product Types List");
      });
  }, []);

  // Request the page records either on the initial render, data changed (added/edited/deleted)
  // or whenever the page changes (Pagination)
  useEffect(() => {
    if (openPopup) return;
    if (viewMode !== "data-grid") return;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/products?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
          `/products/search/dynamic?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
          {
            search_index: searchValue,
            column_name: columnToFilter,
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
            <Toolbar className={classes.toolBar}>
              <Grid
                container
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  {userPermissions.includes("product_create") ? (
                    <Button
                      className={classes.button}
                      variant="contained"
                      onClick={() => {
                        // setOpenPopupTitle("New Product");
                        // setOpenPopup(true);
                        setViewMode("add");
                        setPageHeader("Add Product");
                        setSelectedItem("");
                      }}
                      startIcon={<Add />}
                    >
                      Add Product
                    </Button>
                  ) : null}

                  {userPermissions.includes("product_delete") ? (
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
                          label="Search by column"
                          onChange={handleSearchInput}
                        />
                      </Grid>
                    </Grid>

                    <Grid style={{ alignSelf: "flex-end" }}>
                      <FormControl variant="outlined" size="small">
                        <Select
                          autoWidth
                          value={columnToFilter}
                          onChange={handleColumnToFilter}
                          displayEmpty
                          size="small"
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
                          {/* <MenuItem value="" disabled>
                          Select a column to filter by
                        </MenuItem> */}
                          <MenuItem value={""}>Generic Search</MenuItem>
                          <MenuItem value={"name"}>Product Name</MenuItem>
                          <MenuItem value={"quantity"}>Quantity</MenuItem>
                          <MenuItem value={"price"}>Price</MenuItem>
                          <MenuItem value={"car_made"}>Car Made</MenuItem>
                          <MenuItem value={"car_model"}>Car Model</MenuItem>
                          <MenuItem value={"year"}>Car Year</MenuItem>
                          <MenuItem value={"category_id"}>Category</MenuItem>
                          <MenuItem value={"part_category"}>
                            Part Category
                          </MenuItem>
                          {user?.roles[0].title === "Admin" ? (
                            <MenuItem value={"vendor_id"}>Vendor Name</MenuItem>
                          ) : null}
                          <MenuItem value={"store_id"}>Store Name</MenuItem>
                        </Select>
                      </FormControl>
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
                onRowClick={
                  userPermissions.includes("product_show")
                    ? ({ row }) => history.push(`/product/products/${row.id}`)
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
              setPageHeader("Products");
            }}
          >
            <ArrowBack className={classes.backIcon} />
            <span>Back</span>
          </div>

          <Divider my={3} />
          <ProductsForm
            setPage={setPage}
            setOpenPopup={setOpenPopup}
            itemToEdit={selectedItem}
            stores={stores}
            mainCategories={mainCategories}
            categories={categories}
            carMades={carMades}
            carYears={carYears}
            manufacturers={manufacturers}
            originCountries={originCountries}
            carTypes={carTypes}
            transmissionsList={transmissionsList}
            productTags={productTags}
            productTypes={productTypes}
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
        <ProductsForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
          stores={stores}
          mainCategories={mainCategories}
          categories={categories}
          carMades={carMades}
          carYears={carYears}
          manufacturers={manufacturers}
          originCountries={originCountries}
          carTypes={carTypes}
          productTags={productTags}
          productTypes={productTypes}
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
              DeleteProduct();
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
            Are you sure you want to delete all the selected Products? <br />
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

      <Dialog
        open={openApproveDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Order Approval"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Approve this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              approveProduct();
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
        open={openRejectDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Order"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Reject this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              cancelProduct();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenRejectDialog(false)}
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

export default Products;
