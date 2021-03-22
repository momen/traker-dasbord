import { shallow } from "enzyme";
import Map from "./Map";

it("Map renders without crashing", () => {
  shallow(<Map />);
});
