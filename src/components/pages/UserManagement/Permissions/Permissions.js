import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
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
import AddPermission from "./AddPermission";
import { Pagination } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

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

function Permissions() {
  const classes = useStyles();
  const [{ user, userPermissions }] = useStateValue();
  const history = useHistory();
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

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", width: 200, flex: 1 },
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
            {userPermissions.includes("permission_show") ? (
              <Button
                style={{ marginRight: "5px" }}
                variant="contained"
                onClick={() => history.push(`/user-mgt/permissions/${params.row.id}`)}
              >
                View
              </Button>
            ) : null}
            {/* {userPermissions.includes("permission_edit") ? (
              <Button
                style={{ marginRight: "5px" }}
                color="primary"
                variant="contained"
                onClick={() => {
                  setSelectedItem(params.row);
                  setOpenPopup(true);
                  setOpenPopupTitle("Edit Permission");
                }}
              >
                Edit
              </Button>
            ) : null} */}

            {/* {userPermissions.includes("permission_delete") ? (
              <Button
                color="secondary"
                variant="contained"
                onClick={() => openDeleteConfirmation(params.row.id)}
              >
                Delete
              </Button>
            ) : null} */}
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

  const openDeleteConfirmation = (id) => {
    setOpenDeleteDialog(true);
    setItemToDelete(id);
  };

  const DeleteItem = async () => {
    await axios
      .delete(`/permissions/${itemToDelete}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        // setCategories(res.data.data);
      });

    await axios
      .get(`/permissions?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if((Math.ceil(res.data.total/pageSize) < page)){
          setPage(page-1);
        }
        setRowsCount(res.data.total);
        setRows(res.data.data);
        setLoading(false);
      });
  };

  //Request the page records either on the initial render, or whenever the page changes
  useEffect(() => {
    console.log("In Effect");
    if (!openPopup) {
      setLoading(true);
      axios
        .get(`/permissions?page=${page}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          // alert(res.data.total);
          setRowsCount(res.data.total);
          setRows(res.data.data);
          setLoading(false);
        });
    }
  }, [page, openPopup]);

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Permissions
      </Typography>

      <Divider my={6} />

      
      <Card mb={6}>
        <Paper mb={2}>
          <Toolbar>
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
        <AddPermission
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
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
            Are you sure you want to delete this Permission? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
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
    </React.Fragment>
  );
}

export default Permissions;
