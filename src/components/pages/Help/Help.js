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
import { ExpandMore, Search } from "@material-ui/icons";
import { spacing } from "@material-ui/system";
import axios from "../../../axios";
import { useStateValue } from "../../../StateProvider";
import Popup from "../../Popup";
import FAQ_Form from "./FAQ_Form";

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
    background: "#4caf50",
    color: "#ffffff",
    "&:hover": {
      background: "#388e3c",
    },
    marginRight: "5px",
  },
}));

function Support() {
  const classes = useStyles();
  const [{ userPermissions }] = useStateValue();
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
          alert("Y");
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
        FAQs
      </Typography>

      <Divider my={6} />

      <Grid container flex mb={10} alignItems="flex-end">
        <Grid item xs>
          {userPermissions.includes("help_center_create") ? (
            <Button
              mb={3}
              className={classes.button}
              variant="contained"
              onClick={() => {
                setOpenPopupTitle("New Frquently asked question");
                setOpenPopup(true);
                setSelectedItem("");
              }}
            >
              New Question
            </Button>
          ) : null}

          {userPermissions.includes("help_center_delete") ? (
            <Button
              mb={3}
              color="secondary"
              variant="contained"
              disabled={!rowsToDelete.length > 0}
              onClick={() => {
                setOpenMassDeleteDialog(true);
              }}
            >
              Delete Selected
            </Button>
          ) : null}
        </Grid>

        <Grid item xs={4}>
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
        </Grid>
      </Grid>

      <div className={classes.root}>
        {FAQs?.map((faq, index) => (
          <Accordion
            id={`acc-container-${faq.id}`}
            classes={{ expanded: classes.expanded }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`FAQs-content-${faq.id}`}
              id={`FAQs-header-${faq.id}`}
              classes={{ expanded: classes.expanded }}
            >
              {userPermissions.includes("help_center_delete") ? (
                <FormControlLabel
                  aria-label="Acknowledge"
                  onClick={(event) => {
                    toggleCheckBox(event, faq.id);
                  }}
                  control={
                    <Checkbox
                      id={`acc-checkbox-${faq.id}`}
                      checked={
                        rowsToDelete.filter((id) => id === faq.id).length > 0
                      }
                    />
                  }
                  // The condition above is to fix a bug when deleting a checked question, after its removed the below one
                  // is checked instead, which isn't the desired behavior, so it will check if this item is really in the
                  // to be deleted list, so it maintains it's status.
                  // Used length > 0, as evaluating an empty array will evaluate to true, although an empty array
                  // indicates the item wasn't found in the list.
                  label={uppercaseFirstLetter(faq.question)}
                  htmlFor={`FAQs-header-${index}`}
                />
              ) : (
                <Typography className={classes.heading}>
                  {index + 1}) {uppercaseFirstLetter(faq.question)}
                </Typography>
              )}
            </AccordionSummary>
            <AccordionDetails
              id={`acc-details-${faq.id}`}
              style={{ paddingLeft: "25px" }}
            >
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
            {/* <Divider /> */}
            <AccordionActions>
              {userPermissions.includes("help_center_update") ? (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setSelectedItem(faq);
                    setOpenPopup(true);
                    setOpenPopupTitle("Edit Question or Answer");
                  }}
                >
                  Edit
                </Button>
              ) : null}

              {userPermissions.includes("help_center_delete") ? (
                <Button
                  color="secondary"
                  variant="contained"
                  size="small"
                  onClick={() => openDeleteConfirmation(faq.id)}
                >
                  Delete
                </Button>
              ) : null}
            </AccordionActions>
          </Accordion>
        ))}
      </div>

      <Popup
        title={openPopupTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <FAQ_Form setOpenPopup={setOpenPopup} itemToEdit={selectedItem} />
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
