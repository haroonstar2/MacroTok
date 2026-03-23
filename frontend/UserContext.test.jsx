// // This tells Vitest: "When the component asks for 'firebase/auth', give them these fake functions."
// vi.mock("firebase/auth", async () => {
//   return {
//     getAuth: vi.fn(),
//     // Make these simple "empty" fake functions to see if the components are actually calling these
//     signInWithEmailAndPassword: vi.fn(),
//     createUserWithEmailAndPassword: vi.fn(),
//     signInWithPopup: vi.fn(),
//     sendPasswordResetEmail: vi.fn(),
//     getAdditionalUserInfo: vi.fn(),
//     signOut: vi.fn(),
//     GoogleAuthProvider: vi.fn().mockImplementation(),
//     onAuthStateChanged: vi.fn(),
//   };
// });

// vi.mock("firebase/firestore", async () => {
//   return {
//     // Dummy return string so that setDoc doesn't try to run with nothing
//     doc: vi.fn(() => ({ id: "mock-doc-id" })),
//     setDoc: vi.fn(),
//     getFirestore: vi.fn().mockImplementation(),
//   };
// });

// test.skip("new email user settings stored in firestore", async () => {
//   const user = userEvent.setup();

//   // Mock the Firebase resolve function to return a fake user object
//   // createUserWithEmailAndPassword.mockResolvedValue({
//   //   user: {
//   //     email: "test@example.com",
//   //     displayName: "Test User",
//   //     uid: "12345",
//   //   },
//   // });

//   // Toggle to sign up
//   await user.click(screen.getByRole("button", { name: /sign up/i }));

//   // Get and type messages into the fields
//   await user.type(screen.getByPlaceholderText(/John Doe/i), "Test User");
//   await user.type(
//     screen.getByPlaceholderText(/you@example.com/i),
//     "test@example.com",
//   );
//   await user.type(screen.getByPlaceholderText("Password"), "password123");
//   await user.type(
//     screen.getByPlaceholderText(/confirm password/i),
//     "password123",
//   );

//   // Click the sign in button
//   const submitBtn = screen.getByRole("button", { name: /create account/i });
//   await user.click(submitBtn);

//   // Verify the Firebase was actually called
//   // expect(createUserWithEmailAndPassword).toHaveBeenCalled();

//   // Verify a new Firebase document was created
//   // expect(doc).toHaveBeenCalledWith(
//   //   getFirestore(),
//   //   expect.stringMatching(/users/i),
//   //   expect.stringMatching(/12345/i),
//   // );

//   // Verify the document was updated with the correct fields
//   // expect(setDoc).toHaveBeenCalledWith(
//   //   expect.anything(),
//   //   expect.objectContaining({
//   //     email: "test@example.com",
//   //     displayName: "Test User",
//   //   }),
//   // );
// });

// test.skip("existing google user does not create new settings in firestore", async () => {
//   const user = userEvent.setup();

//   // Mock the Firebase Success Response
//   signInWithPopup.mockResolvedValue({
//     user: {
//       email: "test@google.com",
//       displayName: "Google User",
//       uid: "google-123",
//     },
//   });

//   // Click the google button
//   const googleBtn = screen.getByRole("button", {
//     name: /Continue with Google/i,
//   });
//   await user.click(googleBtn);

//   expect(doc).not.toHaveBeenCalled();
//   expect(setDoc).not.toHaveBeenCalled();
// });

// test.skip("new google user settings stored in firestore", async () => {
//   const user = userEvent.setup();

//   // Mock the Firebase Success Response
//   signInWithPopup.mockResolvedValue({
//     user: {
//       email: "test@google.com",
//       displayName: "Google User",
//       uid: "google-123",
//     },
//   });

//   // Mock a new user
//   getAdditionalUserInfo.mockReturnValue({ isNewUser: true });

//   // Toggle to sign up
//   await user.click(screen.getByRole("button", { name: /sign up/i }));

//   // Click the google button
//   const googleBtn = screen.getByRole("button", {
//     name: /sign up with google/i,
//   });
//   await user.click(googleBtn);

//   expect(signInWithPopup).toHaveBeenCalled();

//   // Verify a new Firebase document was created
//   expect(doc).toHaveBeenCalledWith(
//     getFirestore(),
//     expect.stringMatching(/users/i),
//     expect.stringMatching(/google-123/i),
//   );

//   // Verify the document was updated with the correct fields
//   expect(setDoc).toHaveBeenCalledWith(
//     expect.anything(),
//     expect.objectContaining({
//       email: "test@google.com",
//       displayName: "Google User",
//     }),
//   );
// });
