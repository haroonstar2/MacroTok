import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { auth } from "../../startFirebase";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import "./login.css";
import "./style.css";

export default function Setup2FA() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedPhone = location.state?.phone || "";

  const [phone, setPhone] = useState(passedPhone);
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }

    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, [navigate]);

  const handleSendCode = async () => {
    if (!auth.currentUser) {
      setErrorMsg("No signed-in user found.");
      return;
    }

    if (!phone.trim()) {
      setErrorMsg("Enter a phone number first.");
      return;
    }

    setSendingCode(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const multiFactorSession = await multiFactor(
        auth.currentUser,
      ).getSession();

      const phoneInfoOptions = {
        phoneNumber: phone,
        session: multiFactorSession,
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);

      const id = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        recaptchaRef.current,
      );

      setVerificationId(id);
      setSuccessMsg("Verification code sent.");
    } catch (error) {
      console.error("Send code error:", error);
      setErrorMsg(error.message || "Failed to send verification code.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      setErrorMsg("No signed-in user found.");
      return;
    }

    if (!verificationId) {
      setErrorMsg("Send the verification code first.");
      return;
    }

    if (!verificationCode.trim()) {
      setErrorMsg("Enter the verification code.");
      return;
    }

    setEnrolling(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode,
      );

      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(credential);

      await multiFactor(auth.currentUser).enroll(
        multiFactorAssertion,
        "Primary Phone",
      );

      setSuccessMsg("2FA setup complete.");
      navigate("/feed");
    } catch (error) {
      console.error("Enroll 2FA error:", error);
      setErrorMsg(error.message || "Failed to enroll 2FA.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="modern-login-page">
      <div className="container">
        <div className="container-5">
          <div className="container-6">
            <div className="paragraph">
              <p className="text-wrapper">
                Secure your account by adding a phone number for two-factor
                authentication.
              </p>
            </div>
            <div className="container-7">
              <div className="container-8"></div>
              <h1 className="text-wrapper-2">Set Up 2FA</h1>
            </div>
          </div>

          <form className="form" onSubmit={handleEnroll}>
            <div className="container-9">
              <label className="label">Phone Number</label>
              <input
                type="tel"
                className="input"
                placeholder="+15555555555"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button
              className="button-3"
              type="button"
              onClick={handleSendCode}
              disabled={sendingCode}
            >
              <div className="text-wrapper-7">
                {sendingCode ? "Sending..." : "Send Code"}
              </div>
            </button>

            <div className="container-9">
              <label className="label">Verification Code</label>
              <input
                type="text"
                className="input"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>

            {errorMsg && (
              <div style={{ color: "red", marginBottom: "12px" }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ color: "green", marginBottom: "12px" }}>
                {successMsg}
              </div>
            )}

            <button className="button-3" type="submit" disabled={enrolling}>
              <div className="text-wrapper-7">
                {enrolling ? "Finishing..." : "Finish Setup"}
              </div>
            </button>
          </form>

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
}
