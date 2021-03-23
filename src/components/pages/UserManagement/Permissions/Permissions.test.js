import { shallow } from "enzyme";
import { initialState } from "../../../../reducer";
import { StateProvider } from "../../../../StateProvider";
import Permissions from "./Permissions";

describe("", () => {
  it("Permissions renders without crashing", () => {
    shallow(
      <StateProvider initialState={initialState} reducer={jest.fn()}>
        <Permissions />
      </StateProvider>
    );
  });

  // it("Action buttons are showing correctly", () => {
  //   const wrapper = shallow(
  //     <StateProvider initialState={initialState} reducer={jest.fn()}>
  //       <Permissions />
  //     </StateProvider>
  //   );

  //   expect(wrapper.find("#view-permissions-btn")).to.have.lengthOf(1);
  // });
});
