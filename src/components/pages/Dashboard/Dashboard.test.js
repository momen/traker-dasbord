import { shallow } from "enzyme";
import Dashboard from "./Dashboard";

describe("", () => {
  it("Permissions renders without crashing", () => {
    const wrapper = shallow(<Dashboard />);
    expect(wrapper.find("h1")).toHaveLength(1);
  });

  // it("Action buttons are showing correctly", () => {
  //   const wrapper = shallow(
  //     <StateProvider initialState={initialState} reducer={jest.fn()}>
  //       <Permissions />
  //     </StateProvider>
  //   );

  // });
});
