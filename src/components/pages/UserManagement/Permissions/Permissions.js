import React, { Fragment } from "react";
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
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

import { spacing } from "@material-ui/system";
import { UnfoldLess } from "@material-ui/icons";
import Popup from "../../../Popup";
import AddForm from "../../../AddForm";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Button = styled(MuiButton)(spacing);


const columns = [
  { field: "id", headerName: "ID", width: 150,  },
  { field: "title", headerName: "Title", width: 200, flex: 1,},
  { field: "actions", headerName: "Actions", width: 200 },
];

const rows = [
  { id: "1", lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: 25 },
  { id: 6, lastName: "Melisandre", firstName: "Harvey", age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

function DataGridDemo() {
  return (
    <Fragment>
      <Button mb={3} color="primary" variant="contained">
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
              <InputLabel id="demo-simple-select-outlined-label">
                Age
              </InputLabel>
              <Select IconComponent={UnfoldLess}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>25</MenuItem>
                <MenuItem value={30}>100</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </CardContent>
        <Paper>
          <div style={{ height: "600px", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              checkboxSelection
              autoPageSize
            />
          </div>
        </Paper>
      </Card>
    </Fragment>
  );
}

function Permissions() {
  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Permissions
      </Typography>

      {/* <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/">
          Dashboard
        </Link>
        <Link component={NavLink} exact to="/">
          Tables
        </Link>
        <Typography>Data Grid</Typography>
      </Breadcrumbs> */}

      <Divider my={6} />

      <DataGridDemo />
      <Popup
        // title={popUpTitle}
        openPopup={false}
        // setOpenPopup={setOpenPopup}
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
