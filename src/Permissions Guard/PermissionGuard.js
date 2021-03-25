import React from "react";
import { useStateValue } from "../StateProvider";

function PermissionGuard({ children, permission }) {
  const [{ user, userToken, userPermissions }] = useStateValue();

  if (!user && userToken) {
    return null;
  }

  return userPermissions?.includes(permission) ? children : <h1>No Access</h1>;
}

export default PermissionGuard;
