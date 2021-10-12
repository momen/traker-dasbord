import React from "react";
import { Button, Dialog, makeStyles } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import successIndicator from "../assets/images/success.svg";

const useStyles = makeStyles(() => ({
  root: {
    width: 480,
    // height: 260,
    padding: "10px 20px 30px 20px",
    borderTop: "10px solid #EF9300",
    borderradius: 0,
  },
  closeIconWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
  closeIcon: {
    width: 24,
    height: 24,
    color: "#424242",
    cursor: "pointer",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15,
  },
  message: {
    fontSize: "2rem",
    fontFamily: `"Almarai", sans-serif`,
    color: "#111111",
    textAlign: "center",
  },
  button: {
    color: "#ffffff",
    backgroundColor: "#EF9300",
    width: 100,
    height: 48,
    fontSize: "1.4rem",
    fontWeight: "600",
    fontFamily: `"Almarai", sans-serif`,
    marginTop: 30,
    borderRadius: "0",
    "&:hover": {
      backgroundColor: "#a46500",
    },
  },
}));

export default function SuccessPopup({ open, setOpen, message, handleClose }) {
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className={classes.root}>
        <div className={classes.closeIconWrapper}>
          <Close className={classes.closeIcon} onClick={handleClose} />
        </div>

        <div className={classes.body}>
          <img src={successIndicator} alt="" />
          <p className={classes.message}>{message?.split("\n")}</p>

          <Button className={classes.button} onClick={handleClose}>
            OK
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
