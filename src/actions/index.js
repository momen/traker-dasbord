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
    payload: user
  };
};

export const notAuthenticated = () => {
    return {
      type: "TOKEN_EXPIRED",
    };
  };

export const toggleTheme = () => {
  return {
    type: "CHANGE_THEME",
  };
};
