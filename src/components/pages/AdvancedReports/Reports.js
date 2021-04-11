import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  FormControl,
  FormControlLabel,
  Grid as MuiGrid,
  IconButton,
  LinearProgress,
  makeStyles,
  MenuItem,
  Paper as MuiPaper,
  Select,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { spacing } from "@material-ui/system";
import axios from "../../../axios";
import Popup from "../../Popup";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import PropTypes from "prop-types";
import { Search } from "@material-ui/icons";

const Grid = styled(MuiGrid)(spacing);
const Divider = styled(MuiDivider)(spacing);

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    // width: "100%",
    // wordBreak: "break-word",
    display: "flex",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanded: {
    "&$expanded": {
      margin: "4px 0",
    },
  },
  button: {
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
    },
    marginRight: "5px",
  },
}));

function Row({ row, index }) {
  //   const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {index+1}
        </TableCell>
        <TableCell>{row.order_number}</TableCell>
        <TableCell>{row.order_total}</TableCell>
        <TableCell>{row.orderStatus}</TableCell>
        <TableCell>{row.created_at}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Reports() {
  const classes = useStyles();
  const userPermissions = useSelector((state) => state.userPermissions);
  const [orders, setOrders] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState(
    "New Frquently asked question"
  );
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");

  //   const columns = [
  //     {
  //       field: "order_number",
  //       headerName: "Order Number",
  //       headerAlign: "center",
  //       align: "center",
  //       width: 200,
  //       flex: 1,
  //     },
  //     {
  //       field: "order_total",
  //       headerName: "Order Total",
  //       headerAlign: "center",
  //       align: "center",
  //       width: 200,
  //       flex: 1,
  //     },
  //     {
  //       field: "orderStatus",
  //       headerName: "Status",
  //       headerAlign: "center",
  //       align: "center",
  //       width: 200,
  //       flex: 1,
  //     },
  //     {
  //       field: "search",
  //       headerName: "Search",
  //       width: 300,
  //       headerAlign: "center",
  //       sortable: false,
  //       disableClickEventBubbling: true,
  //       renderCell: (params) => {
  //         return (
  //           <TextField
  //             id="input-with-icon-grid"
  //             variant="outlined"
  //             fullWidth
  //             // onChange={handleSearchInput}
  //           />
  //         );
  //       },
  //     },

  //     {
  //       field: "actions",
  //       headerName: "Actions",
  //       width: 250,
  //       sortable: false,
  //       disableClickEventBubbling: true,
  //       renderCell: (params) => {
  //         return (
  //           <Button variant="contained" color="primary">
  //             Show details
  //           </Button>
  //         );
  //       },
  //     },
  //   ];

  useEffect(() => {
    axios
      .post(`/fetch/advanced/report`, {
        from: "2021-03-01",
        to: "2021-03-15",
      })
      .then(({ data }) => {
        setOrders(data.total_orders);
      })
      .catch((res) => {
        alert("Failed to Fetch data");
      });
  }, []);

  const handlePageSize = (event) => {
    setPageSize(event.target.value);
  };

  const handlePageChange = ({ page }) => {
    setPage(page);
  };

  return (
    <React.Fragment>
      <Helmet title="Data Grid" />
      <Typography variant="h3" gutterBottom display="inline">
        Orders
      </Typography>

      <Divider my={6} />

      <Card mb={6}>
        <Paper>
          <div style={{ width: "100%" }}>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Search />
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                      <TextField variant="outlined" size="small" />
                    </TableCell>
                    <TableCell>
                      <TextField variant="outlined" size="small" />
                    </TableCell>
                    <TableCell>
                      <TextField variant="outlined" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell>#</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Order Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.map((row, index) => (
                    <Row key={row.name} row={row} index={index} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Paper>
      </Card>
      {/* <Popup
        title={openPopupTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AddPermission
          setPage={setPage}
          setOpenPopup={setOpenPopup}
          itemToEdit={selectedItem}
        />
      </Popup> */}
    </React.Fragment>
  );
}

export default Reports;
