import { THEMES } from "./constants";

//The initial Global State values
export const initialState = {
  CSRF: null,
  user: null,
  userPermissions: null,
  theme: THEMES.DARK,
};

//The function that manipulates & returns state according to the action specified.
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CSRF":
      return {
        ...state,
        CSRF: action.CSRF,
      };

    case "LOGIN":
      return {
        ...state,
        user: action.user,
        userPermissions: action.user.roles[0].permissions.map(
          (permission) => permission.title
        ),
      };

    case "CHANGE_THEME":
      return {
        ...state,
        theme: action.theme === "dark" ? THEMES.DARK : THEMES.DEFAULT,
      };

    case "LOGOUT":
      return {
        ...state,
        CSRF: null,
        user: null,
        userPermissions: null,
      };

    default:
      return state;
  }
};

export default reducer;
