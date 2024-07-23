import { describe, expect, it, jest } from "bun:test";
import { IEventEmitter } from "../../src/event-emitter/event-emitter.base.ts";

describe("EventEmitter", () => {
  const eventName = "event";
  class DummyApplication extends IEventEmitter {}

  it("event should trigger", () => {
    const fn = jest.fn();
    const app = new DummyApplication();
    app.on(eventName, fn);
    app.emit(eventName);

    expect(fn).toBeCalledTimes(1);
  });

  it("listener should remove after trigger once", () => {
    const fn = jest.fn();
    const app = new DummyApplication();
    app.once(eventName, fn);
    expect(app["events"][eventName]).toBeArrayOfSize(1);
    app.emit(eventName);
    expect(app["events"][eventName]).toBeArrayOfSize(0);
  });
});
