// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest"
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
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
        providerData: [{ providerId: "password" }],
    };

    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
        callback(fakeUser);
        return () => {};
    });

    vi.mocked(doc).mockReturnValue({ docRef: true });

    vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({ settings: {} }),
    });

    vi.mocked(deleteDoc).mockResolvedValue(undefined);
    vi.mocked(reauthenticateWithCredential).mockResolvedValue(undefined);
    vi.mocked(reauthenticateWithPopup).mockResolvedValue(undefined);

    vi.mock("../../startFirebase", () => ({
        db: { type: "mocked_db_instance" },
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

afterEach(() => {
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

    const signOutBtn = await screen.findByRole("button", { name: /Sign Out/i })
    await user.click(signOutBtn);

    expect(signOut).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText(/Landing Page/i)).toBeInTheDocument());
});

test("user settings are properly loaded from Firebase on mount", async () => {
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ settings: { username: "TestUser" } })
    });

    renderSettingsPage();

    await waitFor(() => {
        expect(doc).toHaveBeenCalledWith(
            expect.objectContaining({ type: "mocked_db_instance" }),
            "users",
            "123"
        );
    });

    await waitFor(() => {
        const textBox = screen.getByLabelText(/username/i);
        expect(textBox).toHaveValue("TestUser");
    });
});

test("modified user settings are sent to Firebase", async () => {
    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ fitnessGoal: "lose_weight" })
    });

    renderSettingsPage();

    const saveBtn = await screen.findByRole("button", { name: /Save Changes/i });
    await userEvent.click(saveBtn);

    expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ settings: expect.anything() })
    );
});

test("change password link is sent to email", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    const securityBtn = await screen.findByRole("button", { name: /security/i });
    await user.click(securityBtn);

    const changePasswordLink = screen.getByRole("button", { name: /Send Password Reset Link/i });
    await user.click(changePasswordLink);

    expect(sendPasswordResetEmail).toHaveBeenCalled();
});

test("delete account button actually deletes the user's account", async () => {
    const user = userEvent.setup();

    reauthenticateWithCredential.mockResolvedValue({ user: { uid: "123" } });
    vi.spyOn(window, "prompt").mockReturnValue("password123");
    vi.mocked(deleteUser).mockResolvedValue(undefined);
    vi.mocked(deleteDoc).mockResolvedValue(undefined);

    renderSettingsPage();

    const accountBtn = await screen.findByRole("button", { name: /account/i });
    await user.click(accountBtn);

    const deleteAccountBtn = screen.getByRole("button", { name: /Delete My Account/i });
    await user.click(deleteAccountBtn);
    expect(screen.getByText(/Are you absolutely sure?/i));

    const deleteAccountBtn2 = screen.getByRole("button", { name: /Delete Account/i });
    await user.click(deleteAccountBtn2);

    await waitFor(() => {
        expect(deleteDoc).toHaveBeenCalled();
        expect(deleteUser).toHaveBeenCalled();
    });

    await waitFor(() => expect(screen.getByText(/Landing Page/i)).toBeInTheDocument());
});

test("uploading an invalid file type shows alert and does not save to Firebase", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { container } = renderSettingsPage();
    const user = userEvent.setup();
    const profileBtn = await screen.findByRole("button", { name: /profile/i });
    await user.click(profileBtn);

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["doc"], "document.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(alertMock).toHaveBeenCalledWith("Only JPG, PNG or GIF files are allowed.");
    expect(updateDoc).not.toHaveBeenCalled();
    alertMock.mockRestore();
});

test("uploading a file larger than 500KB shows alert and does not save to Firebase", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { container } = renderSettingsPage();
    const user = userEvent.setup();
    const profileBtn = await screen.findByRole("button", { name: /profile/i });
    await user.click(profileBtn);

    const fileInput = container.querySelector('input[type="file"]');
    const largeContent = new Uint8Array(510 * 1024);
    const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(alertMock).toHaveBeenCalledWith("File must be smaller than 500KB.");
    expect(updateDoc).not.toHaveBeenCalled();
    alertMock.mockRestore();
});

function mockFileReader(base64Result) {
    const OriginalFileReader = global.FileReader;
    class MockFileReader {
        constructor() {
            this.result = null;
            this.onload = null;
            this.onerror = null;
        }
        readAsDataURL() {
            this.result = base64Result;
            const self = this;
            Promise.resolve().then(() => {
                if (self.onload) self.onload();
            });
        }
    }
    global.FileReader = MockFileReader;
    return () => { global.FileReader = OriginalFileReader; };
}

test("uploading a valid JPG calls updateDoc with base64 photoURL", async () => {
    updateDoc.mockResolvedValue(undefined);
    const restore = mockFileReader("data:image/jpeg;base64,abc123");

    const { container } = renderSettingsPage();
    const user = userEvent.setup();
    const profileBtn = await screen.findByRole("button", { name: /profile/i });
    await user.click(profileBtn);

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["photo"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            { "settings.photoURL": "data:image/jpeg;base64,abc123" }
        );
    });
    restore();
});

test("dark mode toggle switches between light and dark theme", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    const preferencesBtn = await screen.findByRole("button", { name: /preferences/i });
    await user.click(preferencesBtn);

    const darkModeToggle = screen.getByRole("checkbox", { name: /dark mode/i });
    expect(darkModeToggle).not.toBeChecked();
    await user.click(darkModeToggle);
    expect(darkModeToggle).toBeChecked();
});

test("timezone can be changed and saves to Firebase", async () => {
    const user = userEvent.setup();

    getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ settings: { timezone: "Eastern Time (ET)" } })
    });

    renderSettingsPage();

    const timezoneSelector = await screen.findByLabelText(/Time Zone/i);
    await user.selectOptions(timezoneSelector, "Pacific Time (PT)");
    expect(timezoneSelector).toHaveValue("Pacific Time (PT)");

    const saveBtn = await screen.findByRole("button", { name: /Save Changes/i });
    await user.click(saveBtn);

    expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
            settings: expect.objectContaining({ timezone: "Pacific Time (PT)" }),
        })
    );
});
