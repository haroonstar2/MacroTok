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
    sendPasswordResetEmail,
    getAdditionalUserInfo
} from "firebase/auth";

import {
    doc, 
    getFirestore, 
    setDoc
} from "firebase/firestore";

import MacroTokLogin from "./MacroTokLogin"; 

// Refer to this for testing react router
// https://medium.com/@1992season/a-way-to-mock-and-test-navigation-events-in-react-by-vitest-c59f9c8ccc0b
// Before each test, render MacroTokLogin at /login
beforeEach(() => {
    render(<MacroTokLogin />, {
        wrapper: ({children}) => (
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    {/* The page we are testing (passed in as 'children') */}
                    <Route path="/login" element={children} />
                    
                    {/* The fake page we want to land on */}
                    <Route path="/feed" element={<h1>Welcome to the Feed!</h1>} />
                </Routes>
            </MemoryRouter>
        )
    })
    // This clears all the mocks that were set up in the tests.
    vi.clearAllMocks();
});

// After each test, unrender everything
// VERY important otherwise things get double rendered which messes up the tests
afterEach(() => {
    cleanup();
});

// This tells Vitest: "When the component asks for 'firebase/auth', give them these fake functions."
vi.mock("firebase/auth", async () => {
    return {
        getAuth: vi.fn(),
        // Make these simple "empty" fake functions to see if the components are actually calling these
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
        // Dummy return string so that setDoc doesn't try to run with nothing
        doc: vi.fn(() => ({ id: "mock-doc-id" })),
        setDoc: vi.fn(),
        getFirestore: vi.fn().mockImplementation()
    };
});

test("sign in button displays correctly", () => {
    const button = screen.getByRole("button", { name:/sign In/i });
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
  expect(screen.queryByText(/Sign in to continue your journey./i)).toBeInTheDocument();

  // Switch to Sign Up
  await user.click(screen.getByRole("button", { name: /sign up/i }));

  // Now shows Create Account and extra fields
  expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();

  // Switch back to Sign In
  await user.click(screen.getByRole("button", { name: /sign in/i }));
  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.queryByText(/Sign in to continue your journey./i)).toBeInTheDocument();
});

test("create account button displays correctly", async () => {

    const button = screen.getByRole('button', { name: /sign up/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
});

test("successfull sign in redirects to feed", async () => {

    const user = userEvent.setup();

    // Mock the Firebase resolve function to return a fake user object
    signInWithEmailAndPassword.mockResolvedValue({
        user: {
            email: "test@example.com",
            displayName: "Test User",
            uid: "12345"
        }
    });

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
    expect(signInWithEmailAndPassword).toHaveBeenCalled();

    // Verify the user was redirected to the feed page
    expect(await screen.findByText(/welcome to the feed/i)).toBeInTheDocument();

});

test("successful sign up redirect to feed", async () => {
    const user = userEvent.setup();
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    createUserWithEmailAndPassword.mockResolvedValue({
        user: {
            email: "test@example.com",
            displayName: "Test User",
            uid: "12345"
        }
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

    // Mock the Firebase Success Response
    signInWithPopup.mockResolvedValue({
        user: {
            email: "test@google.com",
            displayName: "Google User",
            uid: "google-123"
        }
    });

    // Mock the alert 
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Click the google button
    const googleBtn = screen.getByRole("button", { name: /Continue with Google/i });
    await user.click(googleBtn);

    // Verify the Firebase was actually called
    expect(signInWithPopup).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith("Success: Welcome, Google User!");

    // Verify the user was redirected to the feed page
    expect(screen.getByText(/welcome to the feed/i)).toBeInTheDocument();

    // Cleanup the alert mock
    alertMock.mockRestore();
});

test("error pops up when user enters invalid email or password", async () => {

    const user = userEvent.setup();

    signInWithEmailAndPassword.mockRejectedValue({
        code: "auth/invalid-credential",
        message: "Invalid email or password. Please try again."
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

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
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/Sign In Failed: Invalid email or password/i)
    ));

});

test.skip("error pops up when email or password inputs are empty", async () => {

    const user = userEvent.setup();

    signInWithEmailAndPassword.mockRejectedValue({
        code: "auth/invalid-credential",
        message: "Invalid email or password. Please try again."
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Get inputs from the email and password
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    // Type in only the email 
    await user.type(emailInput, "test@example.com");

    // Click the sign in button
    const submitBtn = screen.getByRole("button", { name: /Sign In/i });
    await user.click(submitBtn);

    // Verify the alert was called with the correct error message 
    expect(alertMock).toHaveBeenCalledWith(
    expect.stringMatching(/please enter both email and password/i)
    );

    // Clear the email input
    await user.clear(emailInput);

    // Type in only the password 
    await user.type(passwordInput, "password123");

    // Click the sign in button
    await user.click(submitBtn);

    // Verify the alert was called with the correct error message 
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/Sign In Failed: Invalid email or password/i)
    ));

})

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

test("sign up shows error when email is already in use" , async () => {
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

test.skip("sign up fails if password is less than 6 characters", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    
});

test("password reset with empty email shows alert and does not call firebase", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    await user.click(screen.getByRole("button", { name: /forgot password/i }));

    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/Password Reset: Please enter your email address in the email field first./i));
    alertMock.mockRestore();
});

test("sign in shows error for invalid email format", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});


    signInWithEmailAndPassword.mockRejectedValue({
        code: "auth/invalid-email",
        message: "Invalid email format."
    });

    await user.type(screen.getByPlaceholderText(/you@example.com/i), "invalid@email");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/Invalid email format/i)
    );
    alertMock.mockRestore();
});

test("google login shows error when popup fails", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    signInWithPopup.mockRejectedValue({
        code: "auth/popup-closed-by-user",
        message: "The popup has been closed by the user."
    });

    await user.click(screen.getByRole("button", { name: /Continue with Google/i }));

    expect(signInWithPopup).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/Google Sign In Error The popup has been closed by the user./i)
    );
    alertMock.mockRestore();
});

test("new email user settings stored in firestore", async () => {

    const user = userEvent.setup();

    // Mock the Firebase resolve function to return a fake user object
    createUserWithEmailAndPassword.mockResolvedValue({
        user: {
            email: "test@example.com",
            displayName: "Test User",
            uid: "12345"
        }
    });

    // Toggle to sign up
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Get and type messages into the fields
    await user.type(screen.getByPlaceholderText(/John Doe/i), "Test User");
    await user.type(screen.getByPlaceholderText(/you@example.com/i), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "password123");

    // Click the sign in button
    const submitBtn = screen.getByRole("button", { name: /create account/i });
    await user.click(submitBtn);

    // Verify the Firebase was actually called
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();

    // Verify a new Firebase document was created
    expect(doc).toHaveBeenCalledWith(
        getFirestore(),
        expect.stringMatching(/users/i),
        expect.stringMatching(/12345/i)
    );

    // Verify the document was updated with the correct fields
    expect(setDoc).toHaveBeenCalledWith(
        expect.anything(), 
        expect.objectContaining({
            email: "test@example.com",
            displayName: "Test User"
        })
    );

});

test("existing google user does not create new settings in firestore", async () => {

    const user = userEvent.setup();

    // Mock the Firebase Success Response
    signInWithPopup.mockResolvedValue({
        user: {
            email: "test@google.com",
            displayName: "Google User",
            uid: "google-123"
        }
    });

    // Click the google button
    const googleBtn = screen.getByRole("button", { name: /Continue with Google/i });
    await user.click(googleBtn);

    expect(doc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
});

test("new google user settings stored in firestore", async () => {

    const user = userEvent.setup();

    // Mock the Firebase Success Response
    signInWithPopup.mockResolvedValue({
        user: {
            email: "test@google.com",
            displayName: "Google User",
            uid: "google-123"
        }
    });

    // Mock a new user
    getAdditionalUserInfo.mockReturnValue({ isNewUser: true });

    // Toggle to sign up
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Click the google button
    const googleBtn = screen.getByRole("button", { name: /sign up with google/i });
    await user.click(googleBtn);

    expect(signInWithPopup).toHaveBeenCalled();

    // Verify a new Firebase document was created
    expect(doc).toHaveBeenCalledWith(
        getFirestore(),
        expect.stringMatching(/users/i),
        expect.stringMatching(/google-123/i)
    );

    // Verify the document was updated with the correct fields
    expect(setDoc).toHaveBeenCalledWith(
        expect.anything(), 
        expect.objectContaining({
            email: "test@google.com",
            displayName: "Google User"
        })
    );

});
