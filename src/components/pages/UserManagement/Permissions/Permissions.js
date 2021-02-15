import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from 'prop-types';

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
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

import { spacing } from "@material-ui/system";
import { UnfoldLess } from "@material-ui/icons";
import Popup from "../../../Popup";
import AddForm from "../../../AddForm";
import axios from "../../../../axios";
import { useStateValue } from "../../../../StateProvider";
import AddPermissions from "./AddPermissions";
import { Pagination } from "@material-ui/lab";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "title", headerName: "Title", width: 200, flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    width: 250,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Button variant="contained">View</Button>
          <Button color="primary" variant="contained">
            Edit
          </Button>
          <Button color="secondary" variant="contained">
            Delete
          </Button>
        </div>
      );
    },
  },
];

const useStyles = makeStyles({
  root: {
    display: 'flex',
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

function Permissions() {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);

  const handlePageSize = (event) => {
    setPageSize(event.target.value);
  };

  const handlePageChange = (params) => {
    setPage(params.page);
  }
  useEffect(() => {
    axios
      .get("/permissions", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        alert(res.data.total);
        setRowsCount(res.data.total);
        setRows(res.data.data);
      });
  }, []);

useEffect(() => {
  axios
      .get(`/permissions?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        alert(res.data.total);
        setRowsCount(res.data.total);
        setRows(res.data.data);
      });
},[page])

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Permissions
      </Typography>

      <Divider my={6} />

      <Button
        mb={3}
        className={classes.button}
        variant="contained"
        onClick={() => setOpenPopup(true)}
      >
        Add Permission
      </Button>
      <Card mb={6}>
        <CardContent pb={1}>
          {/* <Typography variant="h6" gutterBottom>
          Data Grid
        </Typography>
        <Typography variant="body2" gutterBottom>
          A fast and extendable data table and data grid for React, made by
          Material-UI.{" "}
          <Link
            href="https://material-ui.com/components/data-grid/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Official docs
          </Link>
          .
        </Typography> */}
          <Toolbar>
            <FormControl variant="outlined">
              <Select
                value={pageSize}
                onChange={handlePageSize}
                // displayEmpty
                // style={{ width: 150 }}
                autoWidth
                IconComponent={UnfoldLess}
                MenuProps={{ getContentAnchorEl: () => null }}
              >
                {/* <MenuItem value="" disabled>
                  Rows Count
                </MenuItem> */}
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </CardContent>
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
              }}
              checkboxSelection
              autoHeight={true}
              onPageChange={handlePageChange}
            />
          </div>
        </Paper>
      </Card>
      <Popup
        title="New Permission"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AddPermissions
        //   user={userToEdit}
        //   setUsers={setUsers}
        //   setUsersCount={setUsersCount}
        //   rowsPerPage={rowsPerPage}
        //   page={page}
        //   order={order}
        //   orderBy={orderBy}
        />
      </Popup>
    </React.Fragment>
  );
}

export default Permissions;
