import React from "react";
import { shallow, mount } from "enzyme";
import App from "./App";
import { StateProvider } from "./StateProvider";
import { initialState } from "./reducer";

describe("App test", () => {
  it('should render correctly in "debug" mode', () => {
    mount(
      <StateProvider initialState={initialState} reducer={jest.fn()}>
        <App />
      </StateProvider>
    );
  });
});
