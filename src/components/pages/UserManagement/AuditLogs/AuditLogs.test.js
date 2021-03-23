import { shallow } from "enzyme";
import { initialState } from "../../../../reducer";
import { StateProvider } from "../../../../StateProvider";
import AuditLogs from "./AuditLogs";

describe("", () => {
  it("Audit Logs renders without crashing", () => {
    shallow(
      <StateProvider initialState={initialState} reducer={jest.fn()}>
        <AuditLogs />
      </StateProvider>
    );
  });
});
