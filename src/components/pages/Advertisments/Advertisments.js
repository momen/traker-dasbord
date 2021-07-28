import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  FormControlLabel,
  Grid as MuiGrid,
  makeStyles,
  Paper as MuiPaper,
  styled,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, Edit, ExpandMore, Search } from "@material-ui/icons";
import { spacing } from "@material-ui/system";
import axios from "../../../axios";
import Popup from "../../Popup";
import FAQ_Form from "./FAQ_Form";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Grid = styled(MuiGrid)(spacing);
const Divider = styled(MuiDivider)(spacing);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    wordBreak: "break-word",
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
}));

function Support() {
  const classes = useStyles();
  const userPermissions = useSelector((state) => state.userPermissions);
  const { t } = useTranslation();
  const [FAQs, setFAQs] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupTitle, setOpenPopupTitle] = useState(
    "New Frquently asked question"
  );
  const [searchValue, setSearchValue] = useState();
  const [userIsSearching, setuserIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [openMassDeleteDialog, setOpenMassDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);

  //For better UI/UX to have the first letter capitalised incase the First Word was entered in lowercase.
  const uppercaseFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

  const openDeleteConfirmation = (id) => {
    setOpenDeleteDialog(true);
    setItemToDelete(id);
  };

  const DeleteQuestion = () => {
    axios
      .delete(`/delete/question/${itemToDelete}`)
      .then((res) => {
        setOpenDeleteDialog(false);
        setRowsToDelete(rowsToDelete.filter((id) => id !== itemToDelete));
      })
      .catch(({ response }) => {
        alert(response.data?.errors);
      });
  };

  const MassDelete = () => {
    axios
      .post(`/questions/mass/delete`, {
        ids: JSON.stringify(rowsToDelete),
      })
      .then((res) => {
        setOpenMassDeleteDialog(false);
        setRowsToDelete([]);
        axios
          .get(`/FAQs`)
          .then(({ data }) => {
            setFAQs(data.data);
          })
          .catch(({ response }) => {
            alert(response.data?.errors);
          });
      })
      .catch(({ response }) => {
        alert(response.data?.errors);
      });
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

  const toggleCheckBox = (e, faq_id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setRowsToDelete([...rowsToDelete, faq_id]);
    } else {
      setRowsToDelete(rowsToDelete.filter((id) => id !== faq_id));
    }
  };

  useEffect(() => {
    if (openPopup || openDeleteDialog) return;

    if (!userIsSearching) {
      axios
        .get(`/FAQs`)
        .then(({ data }) => {
          setFAQs(data.data);
        })
        .catch((res) => {
          alert("Failed to Fetch data");
        });
    } else {
      axios
        .post(`/questions/search`, {
          search_index: searchValue,
        })
        .then(({ data }) => {
          setFAQs(data.data);
        })
        .catch(() => {
          alert("Failed to Fetch data");
        });
    }
  }, [searchValue, openPopup, openDeleteDialog]);

  return (
    <>
      <Typography variant="h3" gutterBottom display="inline">
        {t('headers.ads')}
      </Typography>

      <Divider my={6} />

      <Grid container flex mb={10} alignItems="flex-end">
        {/* <Grid item xs>
          {userPermissions.includes("help_center_create") ? (
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => {
                setOpenPopupTitle("New Frquently asked question");
                setOpenPopup(true);
                setSelectedItem("");
              }}
              startIcon={<Add />}
            >
              New Question
            </Button>
          ) : null}

          {userPermissions.includes("help_center_delete") ? (
            <Button
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
        </Grid> */}

        {/* <Grid item xs={3}>
          <Grid container spacing={1}>
            <div
              style={{ width: "100%", display: "flex", alignItems: "flex-end" }}
            >
              <Search />
              <TextField
                id="input-with-icon-grid"
                label="Search"
                onChange={handleSearchInput}
                //   size="small"
                fullWidth
              />
            </div>
          </Grid>
        </Grid> */}
      </Grid>

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
            Are you sure you want to delete this Question? <br />
            If this was by accident please press Back
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              DeleteQuestion();
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
            Are you sure you want to delete all the selected Questions? <br />
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
    </>
  );
}

export default Support;
