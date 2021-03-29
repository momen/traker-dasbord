import React from "react";
import { shallow, mount } from "enzyme";
import App from "./App";

describe("App test", () => {
  it('should render correctly in "debug" mode', () => {
    mount(
      
        <App />
    );
  });
});
