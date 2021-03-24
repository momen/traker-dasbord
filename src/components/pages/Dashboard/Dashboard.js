import { Button } from "@material-ui/core";
import React from "react";
import { useStateValue } from "../../../StateProvider";

function Dashboard() {
    const [{userToken}] = useStateValue();
  return (
    <div>
      <h1>Dashboard</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          alert(userToken)
        }
      >
        Check Token
      </Button>
    </div>
  );
}

export default Dashboard;
