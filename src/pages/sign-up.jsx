import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { doesUsernameExist } from "../services/firebase";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseApp } from "../lib/firebase";
import * as ROUTES from "../constants/routes";
import slide1 from "/slide (1).jpeg";
import slide2 from "/slide (2).jpeg";
import slide3 from "/slide (3).jpeg";
import slide4 from "/slide (4).jpeg";
import slide5 from "/slide (5).jpeg";
import Copyright from "./Copyright"
import appleStore from "/get-app-apple.png";
import gpStore from "/get-app-gp.png";
const db = getFirestore(firebaseApp);
function SignUp() {
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [slide1, slide2, slide3, slide4, slide5]; // slideX are the imported images
  useEffect(() => {
    const timer = setInterval(() => {
      if (window.innerWidth <= 640) {
        setActiveSlide(-1);
      } else {
        setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const isInvalid =
    password === "" ||
    emailAddress === "" ||
    fullName === "" ||
    username === "" ||
    confirmPassword === "";

  const handleSignUp = async (event) => {
    event.preventDefault();
    const usernameExists = await doesUsernameExist(username);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    } else if (!/^[A-Za-z ]+$/.test(fullName)) {
      setError("Invalid Name.");
      setFullName("");
      setLoading(false);
    } else if (username.length > 10) {
      setError("Username can be maximum of 10 characters.");
      setUsername("");
      setLoading(false);
    } else if (!usernameExists.length) {
      try {
        const createdUserResult = await createUserWithEmailAndPassword(
          auth,
          emailAddress,
          password
        );
        await updateProfile(createdUserResult.user, {
          displayName: username,
        });
        await addDoc(collection(db, "users"), {
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          following: [],
          followers: [],
          dateCreated: Date.now(),
          image: "/images/default.png",
          bio: "",
          lastSeen: serverTimestamp(),
        });
        navigate(ROUTES.LOGIN);
      } catch (error) {
        if (error) setLoading(false);
        if (error.code === "auth/email-already-exists") {
          setError("Email already exists.");
          setEmailAddress("");
          setPassword("");
          setConfirmPassword("");
        } else if (error.code === "auth/invalid-email") {
          setError("Invalid Email. Please check.");
          setEmailAddress("");
          setPassword("");
          setConfirmPassword("");
        } else if (error.code === "auth/invalid-display-name") {
          setError(
            "Invalid Username. Only alphanumeric characters and '_' and '.' are allowed."
          );
          setUsername("");
        } else if (error.code === "auth/invalid-password") {
          setError("Invalid Password. Must be atleast 6 characters.");
          setPassword("");
          setConfirmPassword("");
        } else if (error.code === "auth/weak-password") {
          setError("Choose a stronger password.");
          setPassword("");
          setConfirmPassword("");
        } else {
          setError(error.code);
          setFullName("");
          setEmailAddress("");
          setPassword("");
          setConfirmPassword("");
          setUsername("");
        }
      }
    } else {
      setUsername("");
      setLoading(false);
      setError("Username already exists. Please choose another one");
    }
  };
  useEffect(() => {
    document.title = "Sign Up - Instagram Clone";
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden items-center justify-center lg:flex mr-4 mb-80">
        <div className="phone-frame">
          <div className="slides-container">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index}`}
                className={`slide ${
                  index === activeSlide ? "active__slide" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="top-grid my-3 p-[24px]">
          <h1 className="-mx-16 flex w-full justify-center ">
            <img
              src="/images/logo.png"
              alt="Instagram Logo"
              className="mt-4 mb-4 w-48 "
            />
          </h1>
          <h1 className="flex justify-center text-center ">
            <p className="mb-8 text-[16px] font-semibold text-gray-500 ">
              Sign up to see photos and videos <br /> from your friends.
            </p>
          </h1>
          {error && <p className="error-text">{error}</p>}
          <form method="POST" onSubmit={handleSignUp}>
            <input
              type="text"
              autoComplete="name"
              required
              aria-label="Enter Your Full Name"
              placeholder="Full Name"
              className="input text-xs"
              onChange={({ target }) => {
                setFullName(target.value), setError();
              }}
              value={fullName}
            />
            <input
              type="text"
              autoComplete="username"
              required
              aria-label="Enter Your Username"
              placeholder="Username"
              className="input text-xs"
              onChange={({ target }) => {
                setUsername(target.value), setError();
              }}
              value={username}
            />
            <input
              type="email"
              autoComplete="email"
              required
              aria-label="Enter Your Email Address"
              placeholder="Email Address"
              className="input text-xs"
              onChange={({ target }) => {
                setEmailAddress(target.value), setError();
              }}
              value={emailAddress}
            />
            <input
              type="password"
              autoComplete="new-password"
              required
              aria-label="Enter Your Password"
              placeholder="Password"
              className="input text-xs"
              onChange={({ target }) => {
                setPassword(target.value), setError();
              }}
              value={password}
            />
            <input
              type="password"
              autoComplete="new-password"
              required
              aria-label="Confirm Your Password"
              placeholder="Confirm Password"
              className="input text-xs"
              onChange={({ target }) => {
                setConfirmPassword(target.value), setError();
              }}
              value={confirmPassword}
            />
            <p className="mb-4 mt-2 text-center text-xs text-gray-500">
              People who use our service may have uploaded <br /> your contact
              information to Instagram. Learn
              <br /> More
            </p>
            <p className="text-center text-xs text-gray-500">
              By signing up, you agree to our Terms, Data <br /> Policy and Cookies
              Policy.
            </p>
            <button
              className={`submit ${isInvalid && " bg-opacity-40"}`}
              disabled={isInvalid === true}
              type="submit"
              onClick={() => setLoading(true)}
            >
              {loading ? "Creating your account" : "Sign up"}
            </button>
          </form>
        </div>
        <div className=" bottom-grid">
          <p className="mr-2 text-sm font-semibold">Have an account?</p>
          <Link to={ROUTES.LOGIN} className=" text-sm font-bold text-blue-400">
            Log in
          </Link>
        </div>
        <div className="flex w-full flex-col items-center justify-center rounded mt-4 mb-40">
          <p className="mb-2 text-sm">Get the app.</p>
          <a
            target="_blank"
            href="https://github.com/jeffjiang13"
            className="text-sm"
          >
            <div className="mb-10 flex items-center">
              <img src={appleStore} className="mr-3 h-10" alt="apple store" />
              <img src={gpStore} alt="google store" className="h-10" />
            </div>
          </a>
        </div>
      </div>
      <Copyright />
    </div>
  );
}

export default SignUp;
