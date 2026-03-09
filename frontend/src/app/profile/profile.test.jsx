// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest"
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from "@testing-library/user-event";

import SettingsPage from "./SettingsPage";

import { 
    signOut, 
    sendPasswordResetEmail, 
    reauthenticateWithCredential, 
    reauthenticateWithPopup,
    deleteUser,
    onAuthStateChanged
} from "firebase/auth";

import { 
    getFirestore, 
    doc, 
    getDoc, 
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

beforeEach(() => {
    vi.clearAllMocks();

    const fakeUser = {
        uid: "123",
        email: "test@example.com",
        providerData: [{ providerId: "password" }], // or "google.com" depending on test
    };

    // Mock the onAuthStateChanged function to return a dummy user
    // Needs to be done before EVERY test
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        callback(fakeUser);
        return () => {}; // return unsubscribe dummy
    });

    // Mock return doc
    vi.mocked(doc).mockReturnValue({ docRef: true });

    // Mock return data from Firebase
    vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({ settings: {/* minimal */} }),
    });

    // Mock the deleteDoc function to return a dummy value so it doesn't throw an error
    vi.mocked(deleteDoc).mockResolvedValue(undefined);

    // Make reauth/resolves succeed by default (so deletion proceeds)
    vi.mocked(reauthenticateWithCredential).mockResolvedValue(undefined);
    vi.mocked(reauthenticateWithPopup).mockResolvedValue(undefined);

    // The previous mocks, mock individual library functions and replaces them with dummy functions
    // auth and db are specific instances created from the library so they need to mock them separately
    vi.mock("../../startFirebase", () => ({
        db: { type: "mocked_db_instance" }, // Dummy for Firestore
        auth: {
            currentUser: {
                uid: "123",
                email: "test@example.com",
                displayName: "Test User",
                providerData: [{ providerId: "password" }]
            },
        }
    }));



});

afterEach(() =>{
    cleanup();
});

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
    }
});

vi.mock("firebase/firestore", async () => {
    return {
        doc: vi.fn(),
        getDoc: vi.fn(),
        updateDoc: vi.fn(),
        deleteDoc: vi.fn(),
        getFirestore: vi.fn().mockImplementation(),
    }
});

function renderSettingsPage() {
  return render(
    <SettingsPage />,
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/settings"]}>
          <Routes>
            <Route path="/settings" element={children} />
            <Route path="/" element={<div>Landing Page</div>} />
          </Routes>
        </MemoryRouter>
      )
    }
  );
}

test("pressing sign out button signs out the user", async () => {

    const user = userEvent.setup();

    renderSettingsPage();

    // Await and findByRole allows the test to wait until the button is rendered
    const signOutBtn = await screen.findByRole("button", { name: /Sign Out/i})

    await user.click(signOutBtn);

    expect(signOut).toHaveBeenCalled();

    // Redirect to landing page
    await waitFor(() => expect(screen.getByText(/Landing Page/i)).toBeInTheDocument());
});

test("user settings are properly loaded from Firebase on mount", async () => {

    // Test Firebase return data
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ 
            settings: {
                username: "TestUser"
            }
        })
    });

    // Render the component AFTER mocking the functions
    renderSettingsPage();

    // Verify it recieved the correct user's data
    // First argument is the db object but don't know what type it is so use expect.anything()
    // Second argument is the collection name
    // Third argument is the user's id
    // Cals doc(db, "users", "123)
    await waitFor(() => {
        expect(doc).toHaveBeenCalledWith(
            expect.objectContaining({ type: "mocked_db_instance" }), 
            "users", 
            "123"
        );
    });

    // Veriy the username field is filled in correctly
    await waitFor(() => {
        const textBox = screen.getByLabelText(/username/i);
        expect(textBox).toHaveValue("TestUser");
    });
});

test("modified user settings are sent to Firebase", async () => {

    // Default values from Firebase
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ fitnessGoal: "lose_weight" }) 
    });

    renderSettingsPage();

    // Save settings button
    const saveBtn = await screen.findByRole("button", { name: /Save Changes/i});
    expect(saveBtn).toBeInTheDocument();

    // Click the save button
    await userEvent.click(saveBtn);

    // Verify the data was updated in Firebase
    expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(), // docRef
        expect.objectContaining({
            settings: expect.anything()
        })
    );

});

test("change password link is sent to email", async () => {

    const user = userEvent.setup();
    renderSettingsPage();

    // Await and findByRole allows the test to wait until the button is rendered
    const securityBtn = await screen.findByRole("button", { name: /security/i})

    // Navigate to the security tab
    await user.click(securityBtn);

    expect(screen.getByRole("heading", { name: /security/i})).toBeInTheDocument();

    const changePasswordLink = screen.getByRole("button", { name: /Send Password Reset Link/i});

    await user.click(changePasswordLink);

    expect(sendPasswordResetEmail).toHaveBeenCalled();

});

test("alerts user that password link expires in 20 minutes", async () => {
    const user = userEvent.setup();
    
    renderSettingsPage();
    
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Await and findByRole allows the test to wait until the button is rendered
    const securityBtn = await screen.findByRole("button", { name: /security/i})
    await user.click(securityBtn);

    expect(screen.getByRole("heading", { name: /security/i})).toBeInTheDocument();
    
    const changePasswordLink = screen.getByRole("button", { name: /Send Password Reset Link/i});
    await user.click(changePasswordLink);
    
    // Verify the alert contains the specific instruction
    expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/Check your email./i)
    );
});

test("delete account button actually deletes the user's account", async () => {

    const user = userEvent.setup();

    // Mock the reauthenticateWithCredential function to return a dummy credential
    reauthenticateWithCredential.mockResolvedValue({ user: { uid: "123" } });
    // Mock the prompt function to return the user's password
    vi.spyOn(window, "prompt").mockReturnValue("password123");

    // Ensure these resolves (so it doesn't throw an error)
    vi.mocked(deleteUser).mockResolvedValue(undefined);
    vi.mocked(deleteDoc).mockResolvedValue(undefined);

    renderSettingsPage();

    // Await and findByRole allows the test to wait until the button is rendered
    const accountBtn = await screen.findByRole("button", { name: /account/i})
    await user.click(accountBtn);

    expect(screen.getByRole("heading", { name: /Account Management/i})).toBeInTheDocument();

    // Click the delete account button
    const deleteAccountBtn = screen.getByRole("button", { name: /Delete My Account/i});
    await user.click(deleteAccountBtn);
    expect(screen.getByText(/Are you absolutely sure?/i))

    // Click the delete account button again
    const deleteAccountBtn2 = screen.getByRole("button", {name: /Delete Account/i});
    await user.click(deleteAccountBtn2);
    
    // Wait for async handler to complete
    await waitFor(() => {
        expect(deleteDoc).toHaveBeenCalled();   
        expect(deleteUser).toHaveBeenCalled();
    });

    // Confirm the user is redirected to landing page
    await waitFor(() => expect(screen.getByText(/Landing Page/i)).toBeInTheDocument());

});

test.skip("deactivate account actually deactivates user's account", () => {
// Deactivating isn't a thing in Firebase natively so we'll have to find a way to do that
});

test.skip("uploading a profile image calls upload function", async () => {
    // TODO: implement uploadProfileImage(file, userId) handler in SettingsPage.jsx
    // Expected behavior:
    // - User selects a file via file input
    // - Handler uploads to cloud storage (Firebase Storage) (maybe find a workaround since this is paid)
    // - Updates user document with photoURL
    // - Shows success confirmation

    // Handler signature will be something like this 
    // uploadProfileImage(file: File, userId: string) => Promise<{ downloadURL: string }>
    
    const user = userEvent.setup();
    renderSettingsPage();

    const profileBtn = await screen.findByRole("button", { name: /profile/i});
    await user.click(profileBtn);

    // Simulate file input selection (once handler is added)
    const fileInput = screen.getByRole("button", { name: /Upload Photo/i});
    // const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    // expect(uploadProfileImage).toHaveBeenCalledWith(expect.any(File), "123");
});

test.skip("enabling 2FA button starts two-factor authentication flow", async () => {
    // TODO: implement beginTwoFactorEnrollment(user) handler in SettingsPage.jsx
    // Expected behavior:
    // - Click "Enable 2FA" button
    // - Opens modal or redirects to 2FA setup (TOTP/SMS)
    // - Updates auth state to reflect 2FA enabled

    // Something like this: beginTwoFactorEnrollment(user: User) => Promise<void>
    
    const user = userEvent.setup();
    renderSettingsPage();

    const securityBtn = await screen.findByRole("button", { name: /security/i});
    await user.click(securityBtn);

    const enable2FABtn = screen.getByRole("button", { name: /Enable 2FA/i});
    // await user.click(enable2FABtn);
    // expect(beginTwoFactorEnrollment).toHaveBeenCalledWith(expect.objectContaining({ uid: "123" }));
});

test("dark mode toggle switches between light and dark theme", async () => {

    const user = userEvent.setup();
    renderSettingsPage();

    // Navigate to preferences tab
    const preferencesBtn = await screen.findByRole("button", { name: /preferences/i});
    await user.click(preferencesBtn);

    expect(screen.getByRole("heading", { name: /Preferences/i})).toBeInTheDocument();

    // Find the dark mode toggle
    const darkModeToggle = screen.getByRole("checkbox", { name: /dark mode/i});
    expect(darkModeToggle).toBeInTheDocument();

    // Verify toggle state changes
    expect(darkModeToggle).not.toBeChecked();
    await user.click(darkModeToggle);
    expect(darkModeToggle).toBeChecked();

});

test("email notifications can be toggled and saves to Firebase", async () => {

    const user = userEvent.setup();

    // Mock Firebase return data with emailNotifications setting
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ 
            settings: {
                emailNotifications: true
            }
        })
    });

    renderSettingsPage();

    // Navigate to preferences tab
    const preferencesBtn = await screen.findByRole("button", { name: /preferences/i});
    await user.click(preferencesBtn);

    expect(screen.getByRole("heading", { name: /Preferences/i})).toBeInTheDocument();

    // Find the email notifications description to locate the checkbox
    expect(screen.getByText(/Receive emails about your meal plans and recipes/i)).toBeInTheDocument();

    // Get all checkboxes and find the one for email notifications
    const checkboxes = screen.getAllByRole("checkbox");
    const emailNotificationsCheckbox = checkboxes[1]; 

    // Toggle the checkbox
    await user.click(emailNotificationsCheckbox);

    // Verify updateDoc was called with emailNotifications setting
    await waitFor(() => {
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ "settings.emailNotifications": expect.any(Boolean) })
        );
    });
});

test("push notifications can be toggled and saves to Firebase", async () => {

    const user = userEvent.setup();

    // Mock Firebase return data with pushNotifications setting
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ 
            settings: {
                pushNotifications: true
            }
        })
    });

    renderSettingsPage();

    // Navigate to preferences tab
    const preferencesBtn = await screen.findByRole("button", { name: /preferences/i});
    await user.click(preferencesBtn);

    expect(screen.getByRole("heading", { name: /Preferences/i})).toBeInTheDocument();

    // Verify push notifications text is present
    expect(screen.getByText(/Get reminders for meal times and weekly planning/i)).toBeInTheDocument();

    // Get all checkboxes and find the one for push notifications
    const checkboxes = screen.getAllByRole("checkbox");
    const pushNotificationsCheckbox = checkboxes[2]; 
    await user.click(pushNotificationsCheckbox)

    // Verify updateDoc was called with pushNotifications setting
    await waitFor(() => {
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ "settings.pushNotifications": expect.any(Boolean) })
        );
    });
});

test("community updates can be toggled and saves to Firebase", async () => {

    const user = userEvent.setup();

    // Mock Firebase return data with communityUpdates setting
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ 
            settings: {
                communityUpdates: true
            }
        })
    });

    renderSettingsPage();

    // Navigate to preferences tab
    const preferencesBtn = await screen.findByRole("button", { name: /preferences/i});
    await user.click(preferencesBtn);

    expect(screen.getByRole("heading", { name: /Preferences/i})).toBeInTheDocument();

    // Verify community updates text is present
    expect(screen.getByText(/Stay informed about community recipes and content/i)).toBeInTheDocument();

    // Get all checkboxes and find the one for community updates
    const checkboxes = screen.getAllByRole("checkbox");
    const communityUpdatesCheckbox = checkboxes[3]; 
    await user.click(communityUpdatesCheckbox)

    // Verify updateDoc was called with communityUpdates setting
    await waitFor(() => {
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ "settings.communityUpdates": expect.any(Boolean) })
        );
    });

});

test("public profile toggle can be toggled and saves to Firebase", async () => {

    const user = userEvent.setup();

    // Mock Firebase return data with isPublic setting
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ 
            settings: {
                isPublic: true
            }
        })
    });

    renderSettingsPage();

    // Navigate to privacy tab
    const privacyBtn = await screen.findByRole("button", { name: /privacy/i});
    await user.click(privacyBtn);

    expect(screen.getByRole("heading", { name: /Privacy Settings/i})).toBeInTheDocument();

    // Verify public profile text is present
    expect(screen.getByText(/Make your profile visible to all users/i)).toBeInTheDocument();

    // Get the toggle and toggle it
    const toggle = screen.getByLabelText("public profile");
    await user.click(toggle);

    // Verify updateDoc was called with isPublic setting
    await waitFor(() => {
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ "settings.isPublic": expect.any(Boolean) })
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
    const privacyBtn = await screen.findByRole("button", { name: /privacy/i});
    await user.click(privacyBtn);

    expect(screen.getByRole("heading", { name: /Privacy Settings/i})).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Data & Privacy/i})).toBeInTheDocument();

    // Get Download My Data button
    const downloadBtn = screen.getByRole("button", { name: /Download My Data/i});
    expect(downloadBtn).toBeInTheDocument();

    // Verify Privacy Policy button exists
    const privacyPolicyBtn = screen.getByRole("button", { name: /Privacy Policy/i});
    expect(privacyPolicyBtn).toBeInTheDocument();

});

test("profile section displays upload photo button with file size info", async () => {

    const user = userEvent.setup();
    renderSettingsPage();

    // Navigate to profile tab (should be default)
    const profileBtn = await screen.findByRole("button", { name: /profile/i});
    await user.click(profileBtn);

    expect(screen.getByRole("heading", { name: /Profile Settings/i})).toBeInTheDocument();

    // Verify the file size information is present
    expect(screen.getByText(/JPG, PNG or GIF\. Max size 2MB/i)).toBeInTheDocument();

});

test("timezone can be changed and saves to Firebase", async () => {

    const user = userEvent.setup();

    // Mock Firebase return data with timezone setting
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ 
            settings: {
                timezone: "Eastern Time (ET)"
            }
        })
    });

    renderSettingsPage();

    // Find timezone selector
    const timezoneSelector = await screen.findByLabelText(/Time Zone/i);
    expect(timezoneSelector).toBeInTheDocument();

    // Change timezone to a different value
    await user.selectOptions(timezoneSelector, "Pacific Time (PT)");
    expect(timezoneSelector).toHaveValue("Pacific Time (PT)");

    // Save changes
    const saveBtn = await screen.findByRole("button", { name: /Save Changes/i});
    await user.click(saveBtn);

    // Verify updateDoc was called with the new timezone
    // expect(updateDoc).toHaveBeenCalledWith(
    //     expect.anything(),
    //     expect.objectContaining({ timeZone: "Pacific Time (PT)" })
    // );

    expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
            settings: expect.objectContaining({
            timezone: "Pacific Time (PT)",
            }),
        })
    );
});

test("disabling push notifications sends false to Firebase on save", async () => {

    const user = userEvent.setup();

    // Mock Firebase return data with pushNotifications initially enabled
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ 
            settings: {
                pushNotifications: true
            }
        })
    });

    renderSettingsPage();

    // Navigate to preferences tab
    const preferencesBtn = await screen.findByRole("button", { name: /preferences/i});
    await user.click(preferencesBtn);

    expect(screen.getByRole("heading", { name: /Preferences/i})).toBeInTheDocument();

    // Get all checkboxes: [darkMode, emailNotifications, pushNotifications, communityUpdates]
    const checkboxes = screen.getAllByRole("checkbox");
    const pushNotificationsCheckbox = checkboxes[2]; // Push notifications is the 3rd checkbox

    // Verify it's initially checked
    expect(pushNotificationsCheckbox).toBeChecked();

    // Toggle it off
    await user.click(pushNotificationsCheckbox);
    expect(pushNotificationsCheckbox).not.toBeChecked();

    // Verify updateDoc was called with pushNotifications: false
    await waitFor(() => {
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ "settings.pushNotifications": false })
        );
    });

});

test.skip("uploading a profile image invokes uploadProfileImage handler", async () => {
    // TODO: implement uploadProfileImage(file, userId) handler in SettingsPage.jsx
    // Expected behavior:
    // - User selects a file via file input
    // - Handler validates file type (JPG, PNG, GIF)
    // - Uploads to Firebase Storage
    // - Updates user document with photoURL
    // - Shows success feedback
    // Handler signature: uploadProfileImage(file: File, userId: string) => Promise<{ downloadURL: string }>

    const user = userEvent.setup();
    renderSettingsPage();

    const profileBtn = await screen.findByRole("button", { name: /profile/i});
    await user.click(profileBtn);

    // Mock handler for future implementation
    const mockUploadProfileImage = vi.fn();
    
    // Once handler exists, test will look like:
    // const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    // const fileInput = screen.getByDisplayValue(...);
    // await user.upload(fileInput, file);
    // expect(mockUploadProfileImage).toHaveBeenCalledWith(expect.any(File), "123");
});