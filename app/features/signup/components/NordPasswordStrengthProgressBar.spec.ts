import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import NordPasswordStrengthProgressBar from "~/features/signup/components/NordPasswordStrengthProgressBar.vue";
import type { VueWrapper } from "@vue/test-utils";

// Mock constants - what users see, not how it's calculated
vi.mock("~/features/signup/constants/password_strength", () => ({
  PASSWORD_RULES: [
    {
      key: "minLength",
      check: (val: string): boolean => val.length >= 8,
      weight: 20,
      message: "Password must be at least 8 characters",
    },
    {
      key: "hasUppercase",
      check: (val: string): boolean => /[A-Z]/.test(val),
      weight: 20,
      message: "Password must contain at least one uppercase letter",
    },
    {
      key: "hasLowercase",
      check: (val: string): boolean => /[a-z]/.test(val),
      weight: 20,
      message: "Password must contain at least one lowercase letter",
    },
    {
      key: "hasNumber",
      check: (val: string): boolean => /[0-9]/.test(val),
      weight: 20,
      message: "Password must contain at least one number",
    },
    {
      key: "hasSpecial",
      check: (val: string): boolean => /[^A-Za-z0-9]/.test(val),
      weight: 20,
      message: "Password must contain at least one special character",
    },
  ],
  COLOR_MAP: [
    "var(--n-color-status-danger)",     // Very weak - red
    "var(--n-color-status-danger)",     // Weak - red
    "var(--n-color-status-warning)",    // Fair - orange
    "var(--n-color-status-info)",       // Good - blue
    "var(--n-color-status-success)",    // Strong - green
  ],
  PROGRESS_BAR_COLOR_MAP: [
    "var(--n-color-status-danger)",     // Very weak - red
    "var(--n-color-status-danger)",     // Weak - red
    "var(--n-color-status-warning)",    // Fair - orange
    "var(--n-color-status-info)",       // Good - blue
    "var(--n-color-status-success)",    // Strong - green
  ],
  TEXT_COLOR_MAP: [
    "n-color-text-danger",     // Very weak - red text
    "n-color-text-danger",     // Weak - red text
    "n-color-text-warning",    // Fair - orange text
    "n-color-text-info",       // Good - blue text
    "n-color-text-success",    // Strong - green text
  ],
}));

describe("NordPasswordStrengthProgressBar - User Experience Tests", () => {
  const createPasswordSchema = (): z.ZodString => {
    return z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
  };

  const createWrapper = (password: string | undefined = "", schema = createPasswordSchema()): VueWrapper<InstanceType<typeof NordPasswordStrengthProgressBar>> => {
    return mount(NordPasswordStrengthProgressBar, {
      props: {
        password,
        validationSchema: schema,
      },
      global: {
        stubs: {
          "nord-stack": {
            template: '<div data-testid="stack"><slot /></div>',
            props: ["gap", "direction", "justify-content", "align-items"],
          },
          "nord-progress-bar": {
            template: '<div data-testid="progress-bar" :data-value="value" :style="style"></div>',
            props: ["value", "max", "style"],
          },
          "nord-icon": {
            template: '<span data-testid="requirement-icon" :data-icon="name" :class="$attrs.class"></span>',
            props: ["name", "size"],
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("👀 What Users See Initially", () => {
    it('should show "Enter password" when no password is entered', () => {
      const wrapper = createWrapper("");

      expect(wrapper.text()).toContain("Enter password");
    });

    it("should show empty progress bar for no password", () => {
      const wrapper = createWrapper("");

      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("0");
    });

    it("should not show requirements list when password is empty", () => {
      const wrapper = createWrapper("");

      expect(wrapper.text()).not.toContain("Password requirements");
    });
  });

  describe("💪 Password Strength Visual Feedback", () => {
    it('should show "Very weak" for passwords meeting minimal criteria', () => {
      const wrapper = createWrapper("abc"); // Only lowercase

      expect(wrapper.text()).toContain("Very weak");

      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("20"); // 1 of 5 rules
    });

    it('should show "Weak" for passwords meeting some criteria', () => {
      const wrapper = createWrapper("Abc1"); // uppercase + lowercase + number

      expect(wrapper.text()).toContain("Weak");

      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("60"); // 3 of 5 rules
    });

    it('should show "Good" for passwords meeting most criteria', () => {
      const wrapper = createWrapper("Abc1!"); // 4 of 5 rules (missing length)

      expect(wrapper.text()).toContain("Good");

      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("80"); // 4 of 5 rules
    });

    it('should show "Strong" for passwords meeting all criteria', () => {
      const wrapper = createWrapper("Abcdef1!"); // All 5 rules

      expect(wrapper.text()).toContain("Strong");

      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("100"); // All rules met
    });

    it("should use appropriate colors to match strength level", () => {
      // Test weak password (red)
      const weakWrapper = createWrapper("abc");
      const weakProgress = weakWrapper.find('[data-testid="progress-bar"]');
      expect(weakProgress.attributes("style")).toContain("--n-color-status-danger");

      // Test strong password (green)
      const strongWrapper = createWrapper("Abcdef1!");
      const strongProgress = strongWrapper.find('[data-testid="progress-bar"]');
      expect(strongProgress.attributes("style")).toContain("--n-color-status-success");
    });
  });

  describe("📋 Password Requirements Display", () => {
    it("should show requirements list when user starts typing", () => {
      const wrapper = createWrapper("a");

      expect(wrapper.text()).toContain("Password requirements");
    });

    it("should show all 5 password requirements", () => {
      const wrapper = createWrapper("weak");

      expect(wrapper.text()).toContain("Password must be at least 8 characters");
      expect(wrapper.text()).toContain("Password must contain at least one uppercase letter");
      expect(wrapper.text()).toContain("Password must contain at least one lowercase letter");
      expect(wrapper.text()).toContain("Password must contain at least one number");
      expect(wrapper.text()).toContain("Password must contain at least one special character");
    });

    it("should show checkmarks for requirements that are met", () => {
      const wrapper = createWrapper("Abc123!"); // Meets 4/5 requirements (missing length - only 7 chars)

      const checkmarks = wrapper.findAll('[data-icon="interface-checked"]');
      expect(checkmarks).toHaveLength(4); // 4 requirements met (missing length)
    });

    it("should show X marks for requirements that are not met", () => {
      const wrapper = createWrapper("abc"); // Only meets lowercase requirement

      const xMarks = wrapper.findAll('[data-icon="interface-close"]');
      expect(xMarks).toHaveLength(4); // 4 requirements not met

      const checkmarks = wrapper.findAll('[data-icon="interface-checked"]');
      expect(checkmarks).toHaveLength(1); // 1 requirement met
    });

    it("should hide requirements when password becomes perfect", () => {
      const wrapper = createWrapper("Perfect123!");

      // Perfect password should not show requirements
      expect(wrapper.text()).not.toContain("Password requirements");
    });
  });

  describe("🔄 Real-time Feedback as User Types", () => {
    it("should update strength immediately when password changes", async () => {
      const wrapper = createWrapper("weak");

      // Initially weak
      expect(wrapper.text()).toContain("Very weak");

      // Update to stronger password
      await wrapper.setProps({ password: "StrongPass123!" });

      // Should now show strong
      expect(wrapper.text()).toContain("Strong");
    });

    it("should update requirement checkmarks in real-time", async () => {
      const wrapper = createWrapper("abc");

      // Initially only lowercase met
      let checkmarks = wrapper.findAll('[data-icon="interface-checked"]');
      expect(checkmarks).toHaveLength(1);

      // Add uppercase
      await wrapper.setProps({ password: "Abc" });

      checkmarks = wrapper.findAll('[data-icon="interface-checked"]');
      expect(checkmarks).toHaveLength(2); // lowercase + uppercase
    });

    it("should update progress bar percentage in real-time", async () => {
      const wrapper = createWrapper("a");

      let progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("20"); // 1/5 rules

      // Add more criteria
      await wrapper.setProps({ password: "Abc1!" });

      progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("80"); // 4/5 rules (missing length)
    });
  });

  describe("🎯 User Experience Goals", () => {
    it("should provide clear guidance on what makes a strong password", () => {
      const wrapper = createWrapper("test");

      // Should see specific, actionable requirements
      expect(wrapper.text()).toContain("8 characters");
      expect(wrapper.text()).toContain("uppercase letter");
      expect(wrapper.text()).toContain("lowercase letter");
      expect(wrapper.text()).toContain("number");
      expect(wrapper.text()).toContain("special character");
    });

    it("should give users a sense of progress towards a strong password", () => {
      // Starting weak
      const wrapper = createWrapper("abc");
      expect(wrapper.text()).toContain("Very weak");

      // Progress visible in both text and bar
      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      const value = parseInt(progressBar.attributes("data-value") ?? "0");
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(100);
    });

    it("should celebrate when user achieves a strong password", () => {
      const wrapper = createWrapper("MySecurePass123!");

      // Should show positive feedback
      expect(wrapper.text()).toContain("Strong");

      // Should remove the requirements (they're met)
      expect(wrapper.text()).not.toContain("Password requirements");

      // Progress bar should be full
      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("100");
    });
  });

  describe("♿ Accessibility & Usability", () => {
    it("should use color AND icons to convey requirement status", () => {
      const wrapper = createWrapper("Abc123!");

      // Should have both visual (color) and semantic (icon) indicators
      const successIcons = wrapper.findAll('[data-icon="interface-checked"]');
      const successElements = wrapper.findAll(".n-color-text-success");

      expect(successIcons.length).toBeGreaterThan(0);
      expect(successElements.length).toBeGreaterThan(0);
    });

    it("should provide meaningful labels for screen readers", () => {
      const wrapper = createWrapper("Abc1234"); // This should be "Fair" (60%)

      // Should have descriptive text, not just visual indicators
      expect(wrapper.text()).toContain("Password requirements");
      expect(wrapper.text()).toContain("Weak"); // Strength description
    });
  });

  describe("🔧 Edge Cases & Error Handling", () => {
    it("should handle undefined password gracefully", () => {
      const wrapper = createWrapper(undefined);

      expect(wrapper.text()).toContain("Enter password");

      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("0");
    });

    it("should handle empty string password", () => {
      const wrapper = createWrapper("");

      expect(wrapper.text()).toContain("Enter password");
      expect(wrapper.text()).not.toContain("Password requirements");
    });

    it("should work with custom validation schemas", () => {
      // Custom schema that only requires 4 characters
      const customSchema = z.string().min(4, "Need 4 characters");
      const wrapper = createWrapper("test", customSchema);

      // Should show strong since it meets the only requirement
      expect(wrapper.text()).toContain("Strong");

      const progressBar = wrapper.find('[data-testid="progress-bar"]');
      expect(progressBar.attributes("data-value")).toBe("100");
    });
  });
});