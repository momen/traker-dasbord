import { Button } from "@material-ui/core";
import React from "react";
import { useStateValue } from "../../../StateProvider";
import axios from "../../../axios";

function Dashboard() {
  const userToken = useSelector((state) => state.userToken);

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>Buttons added for the sake of easier debugging</h1>
      <Button
        style={{ marginRight: "5px" }}
        variant="contained"
        color="primary"
        onClick={() => alert(userToken)}
      >
        Check Token
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          axios
            .post("/logout", null)
            .then(async (res) => {
              delete axios.defaults.headers.common["Authorization"];
              // localStorage.removeItem("trkar-token");
              alert("Logged Out Successfully");
            })
            .catch((err) => {
              alert("Failed to Logout, please try again.");
            });
        }}
      >
        Simulate Logout
      </Button>
    </div>
  );
}

export default Dashboard;
