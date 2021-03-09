import React from "react";
import { useStateValue } from "../StateProvider";

function ManageAccountGuard({ children }) {
  const [{ userPermissions }] = useStateValue();

  return userPermissions?.includes("profile_password_edit") ? children : <h1>Not Authorized</h1>
}

export default ManageAccountGuard;
