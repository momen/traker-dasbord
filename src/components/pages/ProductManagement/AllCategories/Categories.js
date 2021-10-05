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
  makeStyles,
  LinearProgress,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Breadcrumbs,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";

import { spacing } from "@material-ui/system";
import {
  Add,
  ArrowBack,
  Delete,
  Edit,
  ExpandMore,
  NavigateBefore,
  NavigateNext,
  UnfoldLess,
} from "@material-ui/icons";
import Popup from "../../../Popup";
import axios from "../../../../axios";
import CategoriesForm from "./CategoriesForm";
import { Pagination } from "@material-ui/lab";
import { Search } from "react-feather";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  breadcrumbs: {
    fontSize: "25px",
    marginTop: "25px",
    marginLeft: "25px",
    textTransform: "capitalize",
  },
  breadcrumbsTab: {
    cursor: "pointer",
  },
  footer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    paddingRight: 25,
    paddingLeft: 40,
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
    marginLeft: 5,
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    borderRadius: "6px",
    marginLeft: 15,
  },
  actionBtn: {
    marginLeft: 5,
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
  const { t } = useTranslation();

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
        <MenuItem value={10}>{t("global.perPage_10")}</MenuItem>
        <MenuItem value={25}>{t("global.perPage_25")}</MenuItem>
        <MenuItem value={100}>{t("global.perPage_100")}</MenuItem>
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

function Categories() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userPermissions, lang } = useSelector((state) => state);
  const history = useHistory();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState(
    t("components.categories.newCategory")
  );
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

  const [mainCategories, setMainCategories] = useState([]);

  const [pageHeader, setPageHeader] = useState("Categories");
  const [viewMode, setViewMode] = useState("data-grid");

  const columns = [
    {
      field: "id",
      headerName: t("components.categories.gridColumns.id"),
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "photo",
      headerName: " ",
      width: 100,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value) {
          return (
            <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
              <img
                src={params.value.image}
                alt="ph"
                style={{ objectFit: "contain", height: 40 }}
              />
            </div>
          );
        }
      },
    },
    {
      field: lang === "ar" ? "name" : "name_en",
      headerName:
        currentLevel < 2
          ? t("components.categories.gridColumns.mainCategory")
          : t("components.categories.gridColumns.category"),
      width: 200,
      flex: 1,
      align: "start",
    },
    {
      field: "actions",
      headerName: " ",
      width: 220,
      sortable: false,
      disableClickEventBubbling: true,
      hide: currentLevel === 0 ? true : false,
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
            {/* {userPermissions.includes("product_category_show") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                size="small"
                onClick={() =>
                  history.push(`/product/categories/${params.row.id}`)
                }
              >
                View
              </Button>
            ) : null} */}
            {userPermissions.includes("product_category_edit") ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Edit />}
                color="primary"
                variant="contained"
                // size="small"
                onClick={() => {
                  setSelectedItem(params.row);
                  setOpenPopupTitle(t("components.categories.editCategory"));
                  setOpenPopup(true);
                }}
              >
                {t("global.editBtn")}
              </Button>
            ) : null}

            {userPermissions.includes("product_category_delete") ? (
              <Button
                className={classes.actionBtn}
                startIcon={<Delete />}
                color="secondary"
                variant="contained"
                // size="small"
                onClick={() => openDeleteConfirmation(params.row.id)}
              >
                {t("global.deleteBtn")}
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  const handleBreadcrumbsNavigation = (
    categoryId,
    levelToSet,
    breadcrumbIndex
  ) => {
    setSelectedCategory(categoryId);
    setCurrentLevel(levelToSet);
    setBreadcrumbs([...breadcrumbs.slice(0, breadcrumbIndex + 1)]);
  };

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

  const DeleteCategory = async () => {
    await axios
      .delete(`/allcategories/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
      })
      .catch(({ response }) => {
        alert(
          response.data?.errors ||
            response.data?.error ||
            response.data?.message
        );
      });

    const URI =
      currentLevel === 0
        ? `allcategories`
        : `allcategories/details/${selectedCategory}`;
    await axios
      .get(
        `/${URI}?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
  };

  const MassDelete = () => {
    axios
      .post(`/allcategories/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        setLoading(true);
        const URI =
          currentLevel === 0
            ? `allcategories`
            : `allcategories/details/${selectedCategory}`;
        axios
          .get(
            `/${URI}?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
      .get("/main/categories/list/all")
      .then((res) => {
        const _mainCategories = res.data.data.map(
          ({ id, main_category_name, name_en }) => ({
            id,
            main_category_name,
            name_en,
          })
        );
        setMainCategories(_mainCategories);
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
    const URI =
      currentLevel === 0
        ? `allcategories`
        : `allcategories/details/${selectedCategory}`;
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/${URI}?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
              response.data?.message
          );
        });
    } else {
      axios(
        `/allcategories/search/name?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}&search_index=${searchValue}`
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
              response.data?.message
          );
        });
    }
  }, [
    page,
    searchValue,
    currentLevel,
    openPopup,
    sortModel,
    pageSize,
    viewMode,
    lang,
  ]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        {t("components.categories.title")}
      </Typography>

      <Divider my={6} />

      {/* {viewMode === "data-grid" ? ( */}
      <Card mb={6}>
        <Paper mb={2}>
          <Breadcrumbs
            className={classes.breadcrumbs}
            separator={
              lang === "ar" ? (
                <NavigateBefore fontSize="small" />
              ) : (
                <NavigateNext fontSize="small" />
              )
            }
            aria-label="breadcrumb"
          >
            <span
              className={classes.breadcrumbsTab}
              onClick={() => handleBreadcrumbsNavigation(null, 0, -1)}
            >
              {t("components.categories.mainBreadcrumb")}
            </span>
            {breadcrumbs?.map((categoryLevel, index) => (
              <span
                className={classes.breadcrumbsTab}
                onClick={() =>
                  handleBreadcrumbsNavigation(
                    categoryLevel.id,
                    index + 1,
                    index
                  )
                }
              >
                {lang === "ar" ? categoryLevel.name : categoryLevel.name_en}
              </span>
            ))}
          </Breadcrumbs>
          <Toolbar className={classes.toolBar}>
            {currentLevel !== 0 ? (
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                {userPermissions.includes("product_category_create") ? (
                  <Button
                    className={classes.button}
                    variant="contained"
                    onClick={() => {
                      setOpenPopupTitle(t("components.categories.newCategory"));
                      setOpenPopup(true);
                      setSelectedItem("");
                    }}
                    startIcon={<Add />}
                  >
                    {t("components.categories.addNew")}
                  </Button>
                ) : null}

                {userPermissions.includes("product_category_delete") ? (
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
                    {t("global.deleteSelectedBtn")}
                  </Button>
                ) : null}
              </div>
            ) : (
              <div></div>
            )}

            <div>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <Search />
                </Grid>
                <Grid item>
                  <TextField
                    id="input-with-icon-grid"
                    label={t("global.search")}
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
              t={t}
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
                ({ row }) => {
                  if (row.id) {
                    setSelectedCategory(row.id);
                    setCurrentLevel(currentLevel + 1);
                    setBreadcrumbs([...breadcrumbs, row]);
                  }
                }
                // userPermissions.includes("product_category_show")
                //   ? ({ row }) => history.push(`/product/categories/${row.id}`)
                //   : null
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
      {/* ) : (
         <Card mb={6} style={{ padding: "50px 60px" }}>
          <div
            className={classes.backBtn}
            onClick={() => {
              setViewMode("data-grid");
              setPageHeader("Categories");
            }}
          >
            <ArrowBack className={classes.backIcon} />
            <span>Back</span>
          </div>

          <Divider my={3} />
          <CategoriesForm
            setPage={setPage}
            setOpenPopup={setOpenPopup}
            itemToEdit={selectedItem}
            mainCategories={mainCategories}
            setViewMode={setViewMode}
            setPageHeader={setPageHeader}
          />
        </Card>
      )} */}
      <Popup
        title={openPopupTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CategoriesForm
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
          mainCategories={mainCategories}
          selectedCategory={selectedCategory}
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
            Are you sure you want to delete this Category? <br />
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
            Are you sure you want to delete all the selected Categories? <br />
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

export default Categories;
