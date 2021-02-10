import { THEMES } from "./constants";

//The initial Global State values
export const initialState = {
  CSRF:null,
  user: "null",
  theme : THEMES.DEFAULT
};

//The function that manipulates & returns state according to the action specified.
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};

export default reducer;
