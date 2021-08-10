import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

function GeographyGuard({ children }) {
  const { user, userToken, userPermissions } = useSelector((state) => state);

  if (!userToken) {
    alert("Expired");
    return <Redirect to="/sign-in" />;
  }

  return userPermissions?.includes("countries_access") ? children : null;
}

export default GeographyGuard;
