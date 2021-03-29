import React from "react";
import { useSelector } from "react-redux";

function PermissionGuard({ children, permission }) {
  const { user, userToken, userPermissions } = useSelector((state) => {
    return { user: state.user, userToken: state.userToken, userPermissions: state.userPermissions };
  });

  if (!user && userToken) {
    return null;
  }

  return userPermissions?.includes(permission) ? children : <h1>No Access</h1>;
}

export default PermissionGuard;
