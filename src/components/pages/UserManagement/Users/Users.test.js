import { shallow } from "enzyme";
import { initialState } from "../../../../reducer";
import { StateProvider } from "../../../../StateProvider";
import Users from "./Users";

describe("", () => {
  it("Users renders without crashing", () => {
    shallow(
      <StateProvider initialState={initialState} reducer={jest.fn()}>
        <Users />
      </StateProvider>
    );
  });
});
