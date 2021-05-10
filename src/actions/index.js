export const Login = (user) => {
  return {
    type: "LOGIN",
    payload: user,
  };
};

export const Logout = () => {
  return {
    type: "LOGOUT",
  };
};

export const isAuthenticated = (user) => {
  return {
    type: "TOKEN_AVAILABLE",
    payload: user,
  };
};

export const notAuthenticated = () => {
  return {
    type: "TOKEN_EXPIRED",
  };
};

export const toggleTheme = (theme) => {
  return {
    type: "CHANGE_THEME",
    payload: theme,
  };
};

export const setLanguage = (lang) => {
  return {
    type: "SET_LANG",
    payload: lang,
  };
};
