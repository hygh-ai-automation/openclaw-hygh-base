export type HyghConfig = {
  /**
   * Harden runtime defaults for employee deployments.
   * When enabled, config validation enforces:
   * - Slack Socket Mode only (no HTTP mode)
   * - Explicit non-public gateway binding (loopback/tailnet)
   * - Control UI disabled
   */
  employeeMode?: boolean;
};
