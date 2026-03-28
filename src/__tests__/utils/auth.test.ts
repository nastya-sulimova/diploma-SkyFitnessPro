import { isAuthenticated, getToken, removeToken } from "@/utils/auth";

describe("Auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("returns false when no token", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("returns true when token exists", () => {
    localStorage.setItem("token", "test-token");
    expect(isAuthenticated()).toBe(true);
  });

  it("gets token from localStorage", () => {
    localStorage.setItem("token", "test-token");
    expect(getToken()).toBe("test-token");
  });

  it("removes token from localStorage", () => {
    localStorage.setItem("token", "test-token");
    removeToken();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
