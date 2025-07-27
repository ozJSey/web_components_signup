import { beforeEach, describe, expect, it, vi } from "vitest";
import { useId } from "vue";
import { mockUserDatabase } from "~/entities/auth/constants/mock_user_db";
import { generateMockAuthToken, generateMockTokens, getMockToken, mockDelay, mockGetUserByToken } from "~/entities/auth/services/mock-auth";
import type { StoredUser } from "~/entities/auth/types/index";

vi.mock("vue", async () => {
  const actual = await vi.importActual("vue");
  return {
    ...actual,
    useId: vi.fn(),
  };
});

describe("Mock Auth Functions", () => {
  beforeEach(() => {
    mockUserDatabase.clear();
    vi.clearAllMocks();

    let callCount = 0;
    (useId as ReturnType<typeof vi.fn>).mockImplementation(() => `test-id-${++callCount}`);
  });

  describe("getMockToken", () => {
    it("should return a string token", () => {
      const token = getMockToken();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should return different tokens on multiple calls", () => {
      const token1 = getMockToken();
      const token2 = getMockToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("mockDelay", () => {
    it("should resolve after delay", async () => {
      const start = Date.now();
      await mockDelay();
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(1000);
    });
  });

  describe("mockGetUserByToken", () => {
    const mockUser: StoredUser = {
      email: "test@example.com",
      password: "password123",
      userId: "user123",
      createdAt: new Date(),
      firstName: "Test",
      lastName: "User",
      subscribeToUpdates: true,
    };

    it("should return user when token exists in database", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5); // Ensure success (not < 0.1)
      const token = "test-token";
      mockUserDatabase.set(token, mockUser);

      const result = await mockGetUserByToken(token);
      expect(result).toEqual(mockUser);
    });

    it("should return null when token does not exist", async () => {
      const result = await mockGetUserByToken("non-existent-token");
      expect(result).toBeNull();
    });

    it("should throw error occasionally (10% chance)", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.04); // < 0.05 to trigger error

      await expect(mockGetUserByToken("test-token")).rejects.toThrow("Failed to fetch user data");
    });
  });

  describe("generateMockAuthToken", () => {
    it("should return auth token string on success", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);

      const result = await generateMockAuthToken("user123");
      expect(typeof result).toBe("string");
      expect(result).toMatch(/mock_auth_token_user123_/);
    });

    it("should throw error on failure", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.05);

      await expect(generateMockAuthToken("user123")).rejects.toThrow("Mock refetch failed");
    });
  });

  describe("generateMockTokens", () => {
    it("should generate tokens with correct format", () => {
      const tokens = generateMockTokens();

      expect(tokens).toHaveProperty("authToken");
      expect(tokens).toHaveProperty("refreshToken");
      expect(tokens.authToken).toMatch(/access_token_.*_\w+/);
      expect(tokens.refreshToken).toMatch(/refresh_token_.*_\w+/);
      expect(tokens.authToken).not.toBe(tokens.refreshToken);
    });

    it("should generate unique tokens", () => {
      const tokens1 = generateMockTokens();
      const tokens2 = generateMockTokens();

      expect(tokens1.authToken).not.toBe(tokens2.authToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });
  });
});