import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

function issuePaths(res: ReturnType<typeof validateConfigObject>): string[] {
  if (res.ok) {
    return [];
  }
  return res.issues.map((issue) => issue.path);
}

describe("HYGH employee mode config", () => {
  it("accepts hardened Slack socket-mode employee config", () => {
    const res = validateConfigObject({
      hygh: { employeeMode: true },
      channels: {
        slack: {
          mode: "socket",
          botToken: "xoxb-test",
          appToken: "xapp-test",
        },
      },
      gateway: {
        bind: "loopback",
        controlUi: {
          enabled: false,
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("rejects when Slack config is missing", () => {
    const res = validateConfigObject({
      hygh: { employeeMode: true },
      gateway: {
        bind: "loopback",
        controlUi: { enabled: false },
      },
    });

    expect(res.ok).toBe(false);
    expect(issuePaths(res)).toContain("channels.slack");
  });

  it("rejects Slack HTTP mode", () => {
    const res = validateConfigObject({
      hygh: { employeeMode: true },
      channels: {
        slack: {
          mode: "http",
          signingSecret: "secret",
        },
      },
      gateway: {
        bind: "loopback",
        controlUi: { enabled: false },
      },
    });

    expect(res.ok).toBe(false);
    expect(issuePaths(res)).toContain("channels.slack.mode");
  });

  it("rejects HTTP mode on Slack accounts", () => {
    const res = validateConfigObject({
      hygh: { employeeMode: true },
      channels: {
        slack: {
          mode: "socket",
          accounts: {
            ops: {
              mode: "http",
              signingSecret: "secret",
            },
          },
        },
      },
      gateway: {
        bind: "loopback",
        controlUi: { enabled: false },
      },
    });

    expect(res.ok).toBe(false);
    expect(issuePaths(res)).toContain("channels.slack.accounts.ops.mode");
  });

  it("rejects non-loopback/tailnet gateway bind", () => {
    const res = validateConfigObject({
      hygh: { employeeMode: true },
      channels: {
        slack: {
          mode: "socket",
        },
      },
      gateway: {
        bind: "lan",
        controlUi: { enabled: false },
      },
    });

    expect(res.ok).toBe(false);
    expect(issuePaths(res)).toContain("gateway.bind");
  });

  it("rejects when control UI is not explicitly disabled", () => {
    const res = validateConfigObject({
      hygh: { employeeMode: true },
      channels: {
        slack: {
          mode: "socket",
        },
      },
      gateway: {
        bind: "loopback",
      },
    });

    expect(res.ok).toBe(false);
    expect(issuePaths(res)).toContain("gateway.controlUi.enabled");
  });
});
