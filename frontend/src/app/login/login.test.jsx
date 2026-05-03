// @vitest-environment jsdom
// This has to be at the very top for some reason
import React from "react";
import "@testing-library/jest-dom/vitest"
import { render, screen, cleanup, waitFor, } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from "@testing-library/user-event"

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";

import {
    doc,
    getFirestore,
    setDoc
} from "firebase/firestore";

import MacroTokLogin from "./MacroTokLogin";

beforeEach(() => {
    render(<MacroTokLogin />, {
        wrapper: ({children}) => (
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={children} />
                    <Route path="/feed" element={<h1>Welcome to the Feed!</h1>} />
                </Routes>
            </MemoryRouter>
        )
    })
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
});

vi.mock("firebase/auth", async () => {
    return {
        getAuth: vi.fn(),
        signInWithEmailAndPassword: vi.fn(),
        createUserWithEmailAndPassword: vi.fn(),
        signInWithPopup: vi.fn(),
        sendPasswordResetEmail: vi.fn(),
        getAdditionalUserInfo: vi.fn(),
        signOut: vi.fn(),
        GoogleAuthProvider: vi.fn().mockImplementation()
    };
});

vi.mock("firebase/firestore", async () => {
    return {
        doc: vi.fn(() => ({ id: "mock-doc-id" })),
        setDoc: vi.fn(),
        getDoc: vi.fn().mockResolvedValue({ exists: () => true, data: () => ({}) }),
        updateDoc: vi.fn(),
        getFirestore: vi.fn().mockImplementation()
    };
});

test("sign in button displays correctly", () => {
    const button = screen.getByRole("button", { name:/sign In/i });
    expect(button).toBeInTheDocument();
});

test("toggle between Sign In and Sign Up updates fields and texts", async () => {
  const user = userEvent.setup();

  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.queryByText(/Sign in to continue your journey./i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /sign up/i }));

  expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /sign in/i }));
  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.queryByText(/Sign in to continue your journey./i)).toBeInTheDocument();
});

test("successfull sign in redirects to feed", async () => {
    const user = userEvent.setup();

    signInWithEmailAndPassword.mockResolvedValue({
        user: { email: "test@example.com", displayName: "Test User", uid: "12345" }
    });

    await user.type(screen.getByPlaceholderText(/you@example.com/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(await screen.findByText(/welcome to the feed/i)).toBeInTheDocument();
});

test("successful sign up redirect to feed", async () => {
    const user = userEvent.setup();
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    createUserWithEmailAndPassword.mockResolvedValue({
        user: { email: "test@example.com", displayName: "Test User", uid: "12345" }
    });

    await user.type(screen.getByPlaceholderText(/John Doe/i), "Test User");
    await user.type(screen.getByPlaceholderText(/you@example.com/i), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(await screen.findByText(/welcome to the feed/i)).toBeInTheDocument();
});

test("google login opens when clicking on the google button", async () => {
    const user = userEvent.setup();

    signInWithPopup.mockResolvedValue({
        user: { email: "test@google.com", displayName: "Google User", uid: "google-123" }
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await user.click(screen.getByRole("button", { name: /Continue with Google/i }));

    expect(signInWithPopup).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith("Success: Welcome, Google User!");
    expect(screen.getByText(/welcome to the feed/i)).toBeInTheDocument();
    alertMock.mockRestore();
});

test("error pops up when user enters invalid email or password", async () => {
    const user = userEvent.setup();

    signInWithEmailAndPassword.mockRejectedValue({
        code: "auth/invalid-credential",
        message: "Invalid email or password. Please try again."
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await user.type(screen.getByPlaceholderText(/you@example.com/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/Sign In Failed: Invalid email or password/i)
    ));
});

test("sign up prevents submit when passwords do not match", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  await user.click(screen.getByRole("button", { name: /sign up/i }));
  await user.type(screen.getByPlaceholderText(/John Doe/i), "Alice");
  await user.type(screen.getByPlaceholderText(/you@example.com/i), "alice@example.com");
  await user.type(screen.getByPlaceholderText("Password"), "password123");
  await user.type(screen.getByPlaceholderText(/confirm password/i), "different123");
  await user.click(screen.getByRole("button", { name: /create account/i }));

  expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  expect(alertMock).toHaveBeenCalled();
  alertMock.mockRestore();
});

test("sign up shows error when email is already in use", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    createUserWithEmailAndPassword.mockRejectedValue({
        code: "auth/email-already-in-use",
        message: "This email address is already in use."
    });

    await user.type(screen.getByPlaceholderText(/John Doe/i), "Alice");
    await user.type(screen.getByPlaceholderText(/you@example.com/i), "alice@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/Sign Up Failed: This email address is already in use/i)
    );
    alertMock.mockRestore();
});

test("password reset with empty email shows alert and does not call firebase", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    await user.click(screen.getByRole("button", { name: /forgot password/i }));

    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/Password Reset: Please enter your email address in the email field first./i));
    alertMock.mockRestore();
});

test("new email user settings stored in firestore", async () => {
    const user = userEvent.setup();

    createUserWithEmailAndPassword.mockResolvedValue({
        user: { email: "test@example.com", displayName: "Test User", uid: "12345" }
    });

    await user.click(screen.getByRole("button", { name: /sign up/i }));
    await user.type(screen.getByPlaceholderText(/John Doe/i), "Test User");
    await user.type(screen.getByPlaceholderText(/you@example.com/i), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(
        getFirestore(),
        expect.stringMatching(/users/i),
        expect.stringMatching(/12345/i)
    );
    expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ email: "test@example.com", displayName: "Test User" })
    );
});
