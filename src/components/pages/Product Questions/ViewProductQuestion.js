import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../axios";
import { Button, TextField } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Fragment } from "react";
import { useSelector } from "react-redux";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
  rowContent: {
    // width: "100%",
    whiteSpace: "normal",
    wordWrap: "break-word",
    wordBreak: "break-word",
  },
  editBtn: {
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
  submitButton: {
    width: 150,
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
  },
  resetButton: {
    width: 150,
    height: 40,
    fontFamily: `"Almarai", sans-serif`,
    fontWeight: "600",
    color: "#7B7B7B",
    background: "#ffffff",
    border: "2px solid #7B7B7B",
    borderRadius: 0,
    marginRight: 10,
  },
}));

function ViewProductQuestion({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useSelector((state) => state);
  const [question, setQuestion] = useState("");

  const [enableEditing, setEnableEditing] = useState(false);

  const [answer, updateAnswer] = useState("");

  useEffect(() => {
    axios
      .post(`/vendor/fetch/specific/question/${match.params.id}`)
      .then((res) => {
        setQuestion(res.data.data);
      })
      .catch(() => {
        alert("Failed to Fetch data");
      });
  }, []);

  const addReply = () => {
    axios
      .post("vendor/answer/question", {
        question_id: question.id,
        answer: answer,
      })
      .then(() => {
        alert("Reply added successfully");
        setEnableEditing(false);
        axios
          .post(`/vendor/fetch/specific/question/${match.params.id}`)
          .then((res) => {
            setQuestion(res.data.data);
          })
          .catch(() => {
            alert("Failed to Fetch data");
          });
      });
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/product/questions")}
        mb={3}
      >
        Back to list
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableBody>
            <StyledTableRow key={question.id}>
              <StyledTableCell
                component="th"
                scope="row"
                style={{ width: "20%" }}
              >
                ID
              </StyledTableCell>
              <StyledTableCell align="left">{question.id}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`ticket-no${question.body_question}`}>
              <StyledTableCell component="th" scope="row">
                Question
              </StyledTableCell>
              <StyledTableCell align="left">
                {question.body_question}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`user-${question.user_name}`}>
              <StyledTableCell component="th" scope="row">
                Username
              </StyledTableCell>
              <StyledTableCell align="left">
                {question.user_name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`answer-${question.id}`}>
              <StyledTableCell component="th" scope="row">
                <span className={classes.rowContent}>Answer</span>
              </StyledTableCell>
              <StyledTableCell align="left">
                {question.answer && !enableEditing ? (
                  <div>
                    <b>{question.answer}</b>
                    <Button
                      style={{
                        marginRight: "5px",
                      }}
                      className={classes.editBtn}
                      startIcon={<Edit />}
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        updateAnswer(question.answer);
                        setEnableEditing(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ) : (
                  <>
                    <p
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Add Reply:
                    </p>
                    <TextField
                      multiline
                      rows={5}
                      variant="outlined"
                      fullWidth
                      value={answer}
                      onChange={(e) => updateAnswer(e.target.value)}
                    />
                    <div className={classes.actionsContainer}>
                      <Button
                        className={classes.submitButton}
                        onClick={addReply}
                        disabled={!answer}
                      >
                        Submit
                      </Button>
                      {enableEditing ? (
                        <Button
                          className={classes.resetButton}
                          onClick={() => setEnableEditing(false)}
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </>
                )}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key={`product-name-${question.product?.name}`}>
              <StyledTableCell component="th" scope="row">
                Product Name
              </StyledTableCell>
              <StyledTableCell align="left">
                {question.product?.name}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow
              key={`serial-no-${question.product?.serial_number}`}
            >
              <StyledTableCell component="th" scope="row">
                Serial Number
              </StyledTableCell>
              <StyledTableCell align="left">
                {question.product?.serial_number}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow
              key={`serial-coding-${question.product?.serial_coding}`}
            >
              <StyledTableCell component="th" scope="row">
                Serial Coding
              </StyledTableCell>
              <StyledTableCell align="left">
                {question.product?.serial_coding}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow
              key={`product-description-${question.product?.description}`}
            >
              <StyledTableCell component="th" scope="row">
                Description
              </StyledTableCell>
              <StyledTableCell align="left">
                {question.product?.description}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default ViewProductQuestion;
