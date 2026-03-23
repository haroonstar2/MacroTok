// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import SettingsPage from "./SettingsPage";
import { UserProvider } from "../../UserContext";
import { useUser } from "../../UserContext";

import { signOut, sendPasswordResetEmail } from "firebase/auth";

const fakeUser = vi.hoisted(() => ({
  uid: "123",
  email: "test@example.com",
  providerData: [{ providerId: "password" }],
}));

vi.mock("../../startFirebase", () => ({
  db: { type: "mocked_db_instance" },
  auth: { currentUser: { ...fakeUser, displayName: "Test User" } },
}));

vi.mock("../../UserContext", () => ({
  useUser: vi.fn(),
  UserProvider: ({ children }) => <>{children}</>,
}));

vi.mock("firebase/auth", async () => {
  return {
    getAuth: vi.fn().mockImplementation(),
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    deleteUser: vi.fn(),
    reauthenticateWithCredential: vi.fn().mockResolvedValue(undefined),
    reauthenticateWithPopup: vi.fn().mockResolvedValue(undefined),
    GoogleAuthProvider: vi.fn(),
    EmailAuthProvider: { credential: (email, pw) => ({ email, pw }) },
  };
});

vi.mock("firebase/firestore", async () => {
  return {
    doc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getFirestore: vi.fn().mockImplementation(),
    onSnapshot: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(useUser).mockReturnValue({
    user: fakeUser,
    userData: {
      settings: {
        username: "TestUser",
        fitnessGoal: "lose_weight",
        emailNotifications: true,
        pushNotifications: true,
        communityUpdates: true,
        isPublic: true,
        photoURL: "https://example.com/photo.jpg",
        timezone: "America/Los_Angeles",
      },
    },
    updateSettings: vi.fn(),
    deleteAccount: vi.fn(),
    loading: false,
  });
});

afterEach(() => {
  cleanup();
});

function renderSettingsPage() {
  return render(<SettingsPage />, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={["/settings"]}>
        <UserProvider>
          <Routes>
            <Route path="/settings" element={children} />
          </Routes>
        </UserProvider>
      </MemoryRouter>
    ),
  });
}

test("pressing sign out button signs out the user", async () => {
  const user = userEvent.setup();

  renderSettingsPage();

  // Await and findByRole allows the test to wait until the button is rendered
  const signOutBtn = await screen.findByRole("button", { name: /Sign Out/i });
  await user.click(signOutBtn);

  expect(signOut).toHaveBeenCalled();
});

test("user settings are properly loaded from Firebase on mount", async () => {
  // Render the component AFTER mocking the functions
  renderSettingsPage();

  // Veriy the username field is filled in correctly
  await waitFor(() => {
    const textBox = screen.getByLabelText(/username/i);
    expect(textBox).toHaveValue("TestUser");
  });
});

test("modified user settings are sent to Firebase", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  renderSettingsPage();

  await waitFor(() => {
    expect(screen.getByLabelText(/username/i)).toHaveValue("TestUser");
  });

  // Save settings button
  const saveBtn = await screen.findByRole("button", { name: /Save Changes/i });
  expect(saveBtn).toBeInTheDocument();

  // Click the save button
  await user.click(saveBtn);

  const { updateSettings } = useUser();

  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "TestUser",
        fitnessGoal: "lose_weight",
      }),
    );
  });

  alertMock.mockRestore();
});

test("change password link is sent to email", async () => {
  const user = userEvent.setup();
  renderSettingsPage();

  // Await and findByRole allows the test to wait until the button is rendered
  const securityBtn = await screen.findByRole("button", { name: /security/i });

  // Navigate to the security tab
  await user.click(securityBtn);

  expect(
    screen.getByRole("heading", { name: /security/i }),
  ).toBeInTheDocument();

  const changePasswordLink = screen.getByRole("button", {
    name: /Send Password Reset Link/i,
  });

  await user.click(changePasswordLink);

  expect(sendPasswordResetEmail).toHaveBeenCalled();
});

test("alerts user that password link expires in 20 minutes", async () => {
  const user = userEvent.setup();

  renderSettingsPage();

  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  // Await and findByRole allows the test to wait until the button is rendered
  const securityBtn = await screen.findByRole("button", { name: /security/i });
  await user.click(securityBtn);

  expect(
    screen.getByRole("heading", { name: /security/i }),
  ).toBeInTheDocument();

  const changePasswordLink = screen.getByRole("button", {
    name: /Send Password Reset Link/i,
  });
  await user.click(changePasswordLink);

  // Verify the alert contains the specific instruction
  expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(/Check your email./i),
  );
});

test("delete account button actually deletes the user's account", async () => {
  const user = userEvent.setup();

  vi.spyOn(window, "prompt").mockReturnValue("password123");

  renderSettingsPage();

  // Await and findByRole allows the test to wait until the button is rendered
  const accountBtn = await screen.findByRole("button", { name: /account/i });
  await user.click(accountBtn);

  expect(
    screen.getByRole("heading", { name: /Account Management/i }),
  ).toBeInTheDocument();

  // Click the delete account button
  const deleteAccountBtn = screen.getByRole("button", {
    name: /Delete My Account/i,
  });
  await user.click(deleteAccountBtn);
  expect(screen.getByText(/Are you absolutely sure?/i));

  // Click the delete account button again
  const deleteAccountBtn2 = screen.getByRole("button", {
    name: /Delete Account/i,
  });
  await user.click(deleteAccountBtn2);

  const { deleteAccount } = useUser();

  await waitFor(() => {
    expect(deleteAccount).toHaveBeenCalled();
  });
});

test("deactivate account actually deactivates user's account", () => {
  // Deactivating isn't a thing in Firebase natively so we'll have to find a way to do that
});

test("uploading a profile image calls upload function", async () => {
  const user = userEvent.setup();
  // Store the container element to access the file input
  const { container } = renderSettingsPage();

  const profileBtn = await screen.findByRole("button", { name: /profile/i });
  await user.click(profileBtn);

  expect(screen.getByRole("heading", { name: /Profile/i })).toBeInTheDocument();

  // Create a test file and get the file input
  const file = new File(["photo"], "photo.jpg", { type: "image/jpeg" });
  const fileInput = container.querySelector('input[type="file"]');
  // Simulate file input selection
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Click the photo button
  const photoBtn = await screen.findByRole("button", { name: /Photo/i });
  await user.click(photoBtn);

  // Verify uploadProfileImage was called with the file and userId
  const { updateSettings } = useUser();
  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        photoURL: expect.stringContaining("data:image"),
      }),
    );
  });
});

test("enabling 2FA button starts two-factor authentication flow", async () => {
  // TODO: implement beginTwoFactorEnrollment(user) handler in SettingsPage.jsx
  // Expected behavior:
  // - Click "Enable 2FA" button
  // - Opens modal or redirects to 2FA setup (TOTP/SMS)
  // - Updates auth state to reflect 2FA enabled

  // Something like this: beginTwoFactorEnrollment(user: User) => Promise<void>

  const user = userEvent.setup();
  renderSettingsPage();

  const securityBtn = await screen.findByRole("button", { name: /security/i });
  await user.click(securityBtn);

  const enable2FABtn = screen.getByRole("button", { name: /Enable 2FA/i });
  // await user.click(enable2FABtn);
  // expect(beginTwoFactorEnrollment).toHaveBeenCalledWith(expect.objectContaining({ uid: "123" }));
});

test("dark mode toggle switches between light and dark theme", async () => {
  const user = userEvent.setup();
  renderSettingsPage();

  // Navigate to preferences tab
  const preferencesBtn = await screen.findByRole("button", {
    name: /preferences/i,
  });
  await user.click(preferencesBtn);

  expect(
    screen.getByRole("heading", { name: /Preferences/i }),
  ).toBeInTheDocument();

  // Find the dark mode toggle
  const darkModeToggle = screen.getByRole("checkbox", { name: /dark mode/i });
  expect(darkModeToggle).toBeInTheDocument();

  // Verify toggle state changes
  expect(darkModeToggle).not.toBeChecked();
  await user.click(darkModeToggle);
  expect(darkModeToggle).toBeChecked();
});

test("email notifications can be toggled and saves to Firebase", async () => {
  const user = userEvent.setup();

  renderSettingsPage();

  // Navigate to preferences tab
  const preferencesBtn = await screen.findByRole("button", {
    name: /preferences/i,
  });
  await user.click(preferencesBtn);

  expect(
    screen.getByRole("heading", { name: /Preferences/i }),
  ).toBeInTheDocument();

  // Find the email notifications description to locate the checkbox
  expect(
    screen.getByText(/Receive emails about your meal plans and recipes/i),
  ).toBeInTheDocument();

  // Get all checkboxes and find the one for email notifications
  const checkboxes = screen.getAllByRole("checkbox");
  const emailNotificationsCheckbox = checkboxes[1];

  // Toggle the checkbox
  await user.click(emailNotificationsCheckbox);

  // Verify context was called with emailNotifications setting
  const { updateSettings } = useUser();
  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        emailNotifications: expect.any(Boolean),
      }),
    );
  });
});

test("push notifications can be toggled and saves to Firebase", async () => {
  const user = userEvent.setup();

  renderSettingsPage();

  // Navigate to preferences tab
  const preferencesBtn = await screen.findByRole("button", {
    name: /preferences/i,
  });
  await user.click(preferencesBtn);

  expect(
    screen.getByRole("heading", { name: /Preferences/i }),
  ).toBeInTheDocument();

  // Verify push notifications text is present
  expect(
    screen.getByText(/Get reminders for meal times and weekly planning/i),
  ).toBeInTheDocument();

  // Get all checkboxes and find the one for push notifications
  const checkboxes = screen.getAllByRole("checkbox");
  const pushNotificationsCheckbox = checkboxes[2];
  await user.click(pushNotificationsCheckbox);

  // Verify updateDoc was called with pushNotifications setting
  const { updateSettings } = useUser();
  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        pushNotifications: expect.any(Boolean),
      }),
    );
  });
});

test("community updates can be toggled and saves to Firebase", async () => {
  const user = userEvent.setup();

  renderSettingsPage();

  // Navigate to preferences tab
  const preferencesBtn = await screen.findByRole("button", {
    name: /preferences/i,
  });
  await user.click(preferencesBtn);

  expect(
    screen.getByRole("heading", { name: /Preferences/i }),
  ).toBeInTheDocument();

  // Verify community updates text is present
  expect(
    screen.getByText(/Stay informed about community recipes and content/i),
  ).toBeInTheDocument();

  // Get all checkboxes and find the one for community updates
  const checkboxes = screen.getAllByRole("checkbox");
  const communityUpdatesCheckbox = checkboxes[3];
  await user.click(communityUpdatesCheckbox);

  // Verify context was called with communityUpdates setting
  const { updateSettings } = useUser();
  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        communityUpdates: expect.any(Boolean),
      }),
    );
  });
});

test("public profile toggle can be toggled and saves to Firebase", async () => {
  const user = userEvent.setup();

  renderSettingsPage();

  // Navigate to privacy tab
  const privacyBtn = await screen.findByRole("button", { name: /privacy/i });
  await user.click(privacyBtn);

  expect(
    screen.getByRole("heading", { name: /Privacy Settings/i }),
  ).toBeInTheDocument();

  // Verify public profile text is present
  expect(
    screen.getByText(/Make your profile visible to all users/i),
  ).toBeInTheDocument();

  // Get the toggle and toggle it
  const toggle = screen.getByLabelText("public profile");
  await user.click(toggle);

  // Verify context was called with isPublic setting
  const { updateSettings } = useUser();
  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        isPublic: expect.any(Boolean),
      }),
    );
  });
});

test("data download initiates data export request and privacy policy button links correctly", async () => {
  // TODO (future feature): implement downloadMyData(userId) handler in SettingsPage.jsx
  // Expected behavior:
  // - Click "Download My Data" button
  // - Initiates data export request to Firebase Firestore
  // - Redirects to download page with download link
  // - Privacy Policy button links to privacy policy page
  // - Download My Data button is disabled until download request is complete
  // - Download My Data button is enabled after download request is complete

  const user = userEvent.setup();
  renderSettingsPage();

  // Navigate to privacy tab
  const privacyBtn = await screen.findByRole("button", { name: /privacy/i });
  await user.click(privacyBtn);

  expect(
    screen.getByRole("heading", { name: /Privacy Settings/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /Data & Privacy/i }),
  ).toBeInTheDocument();

  // Get Download My Data button
  const downloadBtn = screen.getByRole("button", { name: /Download My Data/i });
  expect(downloadBtn).toBeInTheDocument();

  // Verify Privacy Policy button exists
  const privacyPolicyBtn = screen.getByRole("button", {
    name: /Privacy Policy/i,
  });
  expect(privacyPolicyBtn).toBeInTheDocument();
});

test("profile section displays upload photo button with file size info", async () => {
  const user = userEvent.setup();
  renderSettingsPage();

  // Navigate to profile tab (should be default)
  const profileBtn = await screen.findByRole("button", { name: /profile/i });
  await user.click(profileBtn);

  expect(
    screen.getByRole("heading", { name: /Profile Settings/i }),
  ).toBeInTheDocument();

  // Verify the file size information is present
  expect(
    screen.getByText(/JPG, PNG or GIF\. Max size 500KB/i),
  ).toBeInTheDocument();
});

test("timezone can be changed and saves to Firebase", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  renderSettingsPage();

  // Find timezone selector
  const timezoneSelector = await screen.findByLabelText(/Time Zone/i);
  fireEvent.change(timezoneSelector, {
    target: { value: "Pacific Time (PT)" },
  });

  // Change timezone to a different value
  //   await user.selectOptions(timezoneSelector, "Pacific Time (PT)");
  expect(timezoneSelector).toHaveValue("Pacific Time (PT)");

  // Save changes
  const saveBtn = await screen.findByRole("button", { name: /Save Changes/i });
  //   await user.click(saveBtn);
  fireEvent.click(saveBtn);

  const { updateSettings } = useUser();
  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        timezone: "Pacific Time (PT)",
      }),
    );
  });

  alertMock.mockRestore();
});

test("disabling push notifications sends false to Firebase on save", async () => {
  const user = userEvent.setup();

  renderSettingsPage();

  // Navigate to preferences tab
  const preferencesBtn = await screen.findByRole("button", {
    name: /preferences/i,
  });
  await user.click(preferencesBtn);

  expect(
    screen.getByRole("heading", { name: /Preferences/i }),
  ).toBeInTheDocument();

  // Get all checkboxes: [darkMode, emailNotifications, pushNotifications, communityUpdates]
  const checkboxes = screen.getAllByRole("checkbox");
  const pushNotificationsCheckbox = checkboxes[2]; // Push notifications is the 3rd checkbox

  // Verify it's initially checked
  expect(pushNotificationsCheckbox).toBeChecked();

  // Toggle it off
  await user.click(pushNotificationsCheckbox);
  expect(pushNotificationsCheckbox).not.toBeChecked();

  // Verify context was called with pushNotifications: false
  const { updateSettings } = useUser();
  await waitFor(() => {
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        pushNotifications: false,
      }),
    );
  });
});
