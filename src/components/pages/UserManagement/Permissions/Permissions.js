import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

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
          <Button color="warning" variant="contained">
            View
          </Button>
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
  button: {
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
    },
  },
});

function Permissions() {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const [rows, setRows] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  const [rowsCount, setRowsCount] = useState(10);

  const handleRowsCountChange = (event) => {
    setRowsCount(event.target.value);
  };

  useEffect(() => {
    axios
      .get("/permissions", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setRows(res.data.data);
      });
  }, []);
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
                value={rowsCount}
                onChange={handleRowsCountChange}
                // displayEmpty
                // style={{ width: 150 }}
                autoWidth
                IconComponent={UnfoldLess}
                MenuProps={{ getContentAnchorEl: () => null, }}
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
          <div style={{width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={rowsCount}
              checkboxSelection
              autoHeight={true}
            />
          </div>
        </Paper>
      </Card>
      <Popup
        title="New Permission"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AddForm
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
