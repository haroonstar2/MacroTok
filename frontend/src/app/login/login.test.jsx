// @vitest-environment jsdom
// This has to be at the very top for some reason
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import MacroTokLogin from "./MacroTokLogin";
import { UserProvider } from "../../UserContext";
import { useUser } from "../../UserContext";

// Refer to this for testing react router
// https://medium.com/@1992season/a-way-to-mock-and-test-navigation-events-in-react-by-vitest-c59f9c8ccc0b
// Before each test, render MacroTokLogin at /login
beforeEach(() => {
  vi.mocked(useUser).mockReturnValue({
    user: null,
    googleSignIn: vi.fn(),
    emailSignIn: vi.fn(),
    emailSignUp: vi.fn(),
    loading: false,
  });

  render(<MacroTokLogin />, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={["/login"]}>
        <UserProvider>
          <Routes>
            {/* The page we are testing (passed in as 'children') */}
            <Route path="/login" element={children} />
          </Routes>
        </UserProvider>
      </MemoryRouter>
    ),
  });

  // This clears all the mocks that were set up in the tests.
  vi.clearAllMocks();
});

// After each test, unrender everything
// VERY important otherwise things get double rendered which messes up the tests
afterEach(() => {
  cleanup();
});

vi.mock("../../UserContext", () => ({
  useUser: vi.fn(),
  UserProvider: ({ children }) => <>{children}</>,
}));

test("sign in button displays correctly", () => {
  const button = screen.getByRole("button", { name: /sign In/i });
  expect(button).toBeInTheDocument();
});

test("toggle button shows 'Sign Up' by default", () => {
  const button = screen.getByRole("button", { name: /sign up/i });
  expect(button).toHaveTextContent("Sign Up");
});

test("toggle between Sign In and Sign Up updates fields and texts", async () => {
  const user = userEvent.setup();

  // Initially Sign In mode
  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(
    screen.queryByText(/Sign in to continue your journey./i),
  ).toBeInTheDocument();

  // Switch to Sign Up
  await user.click(screen.getByRole("button", { name: /sign up/i }));

  // Now shows Create Account and extra fields
  expect(
    screen.getByRole("button", { name: /create account/i }),
  ).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();

  // Switch back to Sign In
  await user.click(screen.getByRole("button", { name: /sign in/i }));
  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(
    screen.queryByText(/Sign in to continue your journey./i),
  ).toBeInTheDocument();
});

test("create account button displays correctly", async () => {
  const button = screen.getByRole("button", { name: /sign up/i });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  expect(
    screen.getByRole("button", { name: /create account/i }),
  ).toBeInTheDocument();
});

test("successfull sign in", async () => {
  const user = userEvent.setup();

  // Get inputs from the email and password
  const emailInput = screen.getByPlaceholderText(/you@example.com/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  // Type in the email and password
  await user.type(emailInput, "test@example.com");
  await user.type(passwordInput, "password123");

  // Click the sign in button
  const submitBtn = screen.getByRole("button", { name: /Sign In/i });
  await user.click(submitBtn);

  // Verify the Firebase was actually called
  const { emailSignIn } = useUser();
  expect(emailSignIn).toHaveBeenCalled();
});

test("successful sign up", async () => {
  const user = userEvent.setup();
  await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

  await user.type(screen.getByPlaceholderText(/John Doe/i), "Test User");
  await user.type(
    screen.getByPlaceholderText(/you@example.com/i),
    "test@example.com",
  );
  await user.type(screen.getByPlaceholderText("Password"), "password123");
  await user.type(
    screen.getByPlaceholderText(/confirm password/i),
    "password123",
  );

  await user.click(screen.getByRole("button", { name: /create account/i }));

  // Verify the Firebase was actually called
  const { emailSignUp } = useUser();
  expect(emailSignUp).toHaveBeenCalled();
});

test("google login opens when clicking on the google button", async () => {
  const user = userEvent.setup();

  // Click the google button
  const googleBtn = screen.getByRole("button", {
    name: /Continue with Google/i,
  });
  await user.click(googleBtn);

  // Verify the Firebase was actually called
  const { googleSignIn } = useUser();
  expect(googleSignIn).toHaveBeenCalled();
});

test("error pops up when user enters invalid email or password", async () => {
  const user = userEvent.setup();

  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  // Get inputs from the email and password
  const emailInput = screen.getByPlaceholderText(/you@example.com/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  // Type in the email and password
  await user.type(emailInput, "test@example.com");
  await user.type(passwordInput, "wrongpassword");

  // Click the sign in button
  const submitBtn = screen.getByRole("button", { name: /Sign In/i });
  await user.click(submitBtn);

  // Verify the alert was called with the correct error message
  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith(
      expect.stringMatching(/Email Sign In/i),
    ),
  );
});

test.skip("error pops up when email or password inputs are empty", async () => {
  const user = userEvent.setup();

  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  // Get inputs from the email and password
  const emailInput = screen.getByPlaceholderText(/you@example.com/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  // Type in only the email
  await user.type(emailInput, "test@example.com");

  // Click the sign in button
  const submitBtn = screen.getByRole("button", { name: /Sign In/i });
  await user.click(submitBtn);
  // fireEvent.click(submitBtn);

  // Verify the alert was called with the correct error message
  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(/please enter both email and password/i),
  );

  // Clear the email input
  await user.clear(emailInput);

  // Type in only the password
  await user.type(passwordInput, "password123");

  // Click the sign in button
  await user.click(submitBtn);

  // Verify the alert was called with the correct error message
  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith(
      expect.stringMatching(/Sign In Failed: Invalid email or password/i),
    ),
  );
});

test("sign up prevents submit when passwords do not match", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  await user.type(screen.getByPlaceholderText(/John Doe/i), "Alice");
  await user.type(
    screen.getByPlaceholderText(/you@example.com/i),
    "alice@example.com",
  );
  await user.type(screen.getByPlaceholderText("Password"), "password123");
  await user.type(
    screen.getByPlaceholderText(/confirm password/i),
    "different123",
  );

  await user.click(screen.getByRole("button", { name: /create account/i }));

  // expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();

  const { emailSignUp } = useUser();
  // expect(emailSignUp).not.toHaveBeenCalled();
  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(/Passwords do not match/i),
  );
  alertMock.mockRestore();
});

test("sign up shows error when email is already in use", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  const { emailSignUp } = useUser();
  emailSignUp.mockRejectedValue(
    new Error("Sign Up Failed: This email address is already in use."),
  );

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  await user.type(screen.getByPlaceholderText(/John Doe/i), "Alice");
  await user.type(
    screen.getByPlaceholderText(/you@example.com/i),
    "alice@example.com",
  );
  await user.type(screen.getByPlaceholderText("Password"), "password123");
  await user.type(
    screen.getByPlaceholderText(/confirm password/i),
    "password123",
  );

  await user.click(screen.getByRole("button", { name: /create account/i }));

  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(
      /Sign Up Failed: This email address is already in use/i,
    ),
  );
  alertMock.mockRestore();
});

test("sign up fails if password is less than 6 characters", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  await user.type(screen.getByPlaceholderText(/John Doe/i), "Alice");
  await user.type(
    screen.getByPlaceholderText(/you@example.com/i),
    "alice@example.com",
  );
  await user.type(screen.getByPlaceholderText("Password"), "123");
  await user.type(screen.getByPlaceholderText(/confirm password/i), "123");

  await user.click(screen.getByRole("button", { name: /create account/i }));

  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(/Password must be at least 6 characters/i),
  );
  alertMock.mockRestore();
});

test("password reset with empty email shows alert and does not call firebase", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await user.click(screen.getByRole("button", { name: /forgot password/i }));

  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(
      /Password Reset: Please enter your email address in the email field first./i,
    ),
  );
  alertMock.mockRestore();
});

test("sign in shows error for invalid email format", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await user.type(
    screen.getByPlaceholderText(/you@example.com/i),
    "invalid@email",
  );
  await user.type(screen.getByPlaceholderText("Password"), "password123");
  await user.click(screen.getByRole("button", { name: /Sign In/i }));

  // expect(signInWithEmailAndPassword).toHaveBeenCalled();
  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(/Email Sign In Error/i),
  );
  alertMock.mockRestore();
});

test("google login shows error when popup fails", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await user.click(
    screen.getByRole("button", { name: /Continue with Google/i }),
  );

  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(/Google Sign In Error./i),
  );
  alertMock.mockRestore();
});
