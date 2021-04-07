import React from "react";
import { Button, Dialog, DialogContent, DialogTitle, makeStyles, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    padding: theme.spacing(1),
    position: "absolute",
    top: theme.spacing(5),
  },
  dialogTitle: {
    padding: "6px",
  },
  dialogContent: {
    marginTop: theme.spacing(1),
  },
}));

function Popup({ title, children, openPopup, setOpenPopup }) {
    const classes = useStyles();
    
  return (
    <Dialog
      open={openPopup}
      maxWidth="md"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1}}>
            {title}
          </Typography>
          <Button
            className={classes.dialogTitle}
            // variant="contained"
            color="secondary"
            onClick={() => setOpenPopup(false)}
          >
            <Close />
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}

export default Popup;