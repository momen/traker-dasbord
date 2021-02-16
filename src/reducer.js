import { THEMES } from "./constants";

//The initial Global State values
export const initialState = {
  CSRF: null,
  user: null,
  userPermissions: null,
  theme: THEMES.DEFAULT,
};

//The function that manipulates & returns state according to the action specified.
const reducer = (state, action) => {
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
        userPermissions: action.user.roles[0].permissions.map(permission => permission.title),
      };

    case "LOGOUT":
      return {
        ...state,
        CSRF: null,
        user: null,
      };

    default:
      return state;
  }
};

export default reducer;
