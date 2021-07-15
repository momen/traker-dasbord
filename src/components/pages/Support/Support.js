import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";
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
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";

import { spacing } from "@material-ui/system";
import { ExpandMore, UnfoldLess } from "@material-ui/icons";
import axios from "../../../axios";
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
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
    },
  },
  toolBar: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    borderRadius: "6px",
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

function Support() {
  const classes = useStyles();
  const userPermissions = useSelector((state) => state.userPermissions);
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    { field: "ticket_no", headerName: "Ticket Number", width: 100, flex: 1 },
    { field: "title", headerName: "Title", width: 100, flex: 1 },
    { field: "priority", headerName: "Priority", width: 80 },
    { field: "case", headerName: "Status", width: 80 },
    {
      field: "category_name",
      headerName: "Category",
      width: 80,
      sortable: false,
    },
    { field: "vendor_name", headerName: "Vendor Name", width: 120 },
    { field: "order_number", headerName: "Order Number", width: 120 },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 220,
    //   sortable: false,
    //   disableClickEventBubbling: true,
    //   renderCell: (params) => {
    //     return (
    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "flex-start",
    //           width: "100%",
    //         }}
    //       >
    //         {/* {userPermissions.includes("specific_ticket_access") ? (
    //           <Button
    //             style={{ marginRight: "5px" }}
    //             variant="contained"
    //             size="small"
    //             onClick={() => history.push(`/support/ticket/${params.row.id}`)}
    //           >
    //             View
    //           </Button>
    //         ) : null} */}
    //       </div>
    //     );
    //   },
    // },
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

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    setLoading(true);
    if (!userIsSearching) {
      axios
        .get(
          `/all/tickets?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`
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
          `/search/tickets?page=${page}&per_page=${pageSize}&ordered_by=${sortModel[0].field}&sort_type=${sortModel[0].sort}`,
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
  }, [page, searchValue, sortModel, pageSize]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Tickets
      </Typography>

      <Divider my={6} />

      <Card mb={6}>
        <Paper mb={2}>
          <Toolbar className={classes.toolBar}>
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
              disableColumnMenu
              autoHeight={true}
              onRowClick={
                userPermissions.includes("specific_ticket_access")
                  ? ({ row }) => history.push(`/support/ticket/${row.id}`)
                  : null
              }
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSize}
              onSortModelChange={handleSortModelChange}
            />
          </div>
        </Paper>
      </Card>
    </React.Fragment>
  );
}

export default Support;
