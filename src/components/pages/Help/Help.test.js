import { shallow } from "enzyme";
import { initialState } from "../../../reducer";
import { StateProvider } from "../../../StateProvider";
import Help from "./Help";

it("FAQs renders without crashing", () => {
  shallow(
    <StateProvider initialState={initialState} reducer={jest.fn()}>
      <Help />
    </StateProvider>
  );
});
