import { combineReducers } from "redux";
import { THEMES } from "../constants";

const CSRFReducer = (csrf = null, action) => {
  if (action.type === "GET_CSRF") {
    return action.payload;
  }
  return csrf;
};

const langReducer = (lang = "ar", action) => {
  if (action.type === "SET_LANG") {
    return action.payload;
  }
  return lang;
};

const userInfoReducer = (user = null, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;

    case "LOGOUT":
      return null;

    case "TOKEN_AVAILABLE":
      return action.payload;

    case "TOKEN_EXPIRED":
      return null;

    default:
      return user;
  }
};

const userTokenReducer = (
  user = JSON.parse(window.localStorage.getItem("trkar-token")) || null,
  action
) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;

    case "LOGOUT":
      return null;

    case "TOKEN_EXPIRED":
      return null;

    default:
      return user;
  }
};

const userPermissionsReducer = (userPermissions = [], action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload.roles[0].permissions.map(
        (permission) => permission.title
      );

    case "LOGOUT":
      return [];

    case "TOKEN_AVAILABLE":
      return action.payload.roles[0].permissions.map(
        (permission) => permission.title
      );

    case "TOKEN_EXPIRED":
      return [];

    default:
      return userPermissions;
  }
};

const themeReducer = (
  theme = JSON.parse(window.localStorage.getItem("trkar-theme")) || "dark",
  action
) => {
  if (action.type === "CHANGE_THEME") {
    return action.payload;
  }
  return theme;
};

export default combineReducers({
  csrf: CSRFReducer,
  lang: langReducer,
  user: userInfoReducer,
  userToken: userTokenReducer,
  userPermissions: userPermissionsReducer,
  theme: themeReducer,
});
