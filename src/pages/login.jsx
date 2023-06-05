import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import slide1 from "/slide (1).jpeg";
import slide2 from "/slide (2).jpeg";
import slide3 from "/slide (3).jpeg";
import slide4 from "/slide (4).jpeg";
import slide5 from "/slide (5).jpeg";
import Copyright from "./Copyright";
import appleStore from "/get-app-apple.png";
import gpStore from "/get-app-gp.png";
import { ImFacebook2 as FacebookIcon } from "react-icons/im";
import { signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";

function Login() {
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, emailAddress, password);
      // await updateUserStatus(auth.currentUser.uid, true);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      if (error) setLoading(false);
      if (error.code === "auth/user-not-found") {
        setError("User doesn't exist. Please Sign Up.");
        setEmailAddress("");
        setPassword("");
      } else if (error.code === "auth/wrong-password") {
        setError("Invalid Password. Please Try Again.");
        setPassword("");
      } else if (error.code === "auth/too-many-requests") {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. Please Reset your password or Try Again later."
        );
        setEmailAddress("");
        setPassword("");
      } else {
        setEmailAddress("");
        setPassword("");
        setError(error.message);
      }
    }
  };
  // const handleResetPassword = async (event) => {
  //   event.preventDefault();
  //   if (emailAddress === "") {
  //     setError("Enter your Email Address first");
  //   } else {
  //     try {
  //       await sendPasswordResetEmail(auth, emailAddress);
  //       setError(
  //         "Password Reset Link sent successfully. Please check your email. If not found in Inbox, check your Spam folder"
  //       );
  //     } catch (error) {
  //       if(error.code === "auth/invalid-email"){
  //         setError("Enter a valid Email Address.")
  //       }else if(error.code === "auth/user-not-found"){
  //         setError("User Not Found. Please Sign Up.")
  //       }
  //        else{
  //         setError(error.message);
  //       }
  //     }
  //   }
  //};
  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    const db = getFirestore();

    try {
        const result = await signInWithPopup(auth, provider);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        let imageUrl = result.user.photoURL || "/images/default.png";

        await fetch(`https://graph.facebook.com/${result.user.providerData[0].uid}/picture?type=large&redirect=false&access_token=${accessToken}`)
            .then(response => response.json())
            .then(async (data) => {
                if (data && data.data && data.data.url) {
                    imageUrl = data.data.url; // Use Facebook profile picture if available
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        const userRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(userRef);

        let userData = {
            userId: result.user.uid,
            emailAddress: result.user.email.toLowerCase(),
            dateCreated: serverTimestamp(),
            lastSeen: serverTimestamp(),
        };

        if (!docSnap.exists()) {
            // If it's a new user, set the Facebook profile picture, username, and fullName
            userData.image = imageUrl;
            userData.following = [];
            userData.followers = [];
            userData.bio = "";
            userData.username = result.user.email.split("@")[0].toLowerCase(); // Generate a username from the user's email
            userData.fullName = result.user.displayName;
        } else {
            // If user document already exists, don't update the profile picture, username, and fullName
            const existingData = docSnap.data();
            // Check if user has updated their profile picture in your app
            if (existingData.image !== "/images/default.png") {
                // User has updated their profile picture, so we don't use Facebook image
                userData.image = existingData.image;
            } else {
                // User hasn't updated their profile picture, so we use the Facebook image
                userData.image = imageUrl;
            }
            userData.bio = existingData.bio ? existingData.bio : "";
            userData.following = existingData.following ? existingData.following : [];
            userData.followers = existingData.followers ? existingData.followers : [];
            userData.username = existingData.username;
            userData.fullName = existingData.fullName;
        }

        // If document doesn't exist or if document exists, set the user document with userData
        // Here, we use setDoc() which creates a new document if it doesn't exist or updates the document if it already exists
        await setDoc(userRef, userData, { merge: true });

        navigate(ROUTES.DASHBOARD);
    } catch (error) {
        console.log("Facebook login error:", error);
    }
};




  useEffect(() => {
    document.title = "Login - Instagram Clone";
  }, []);
  return (
    <div className="grid grid-cols-1 overflow-scroll lg:grid-cols-2">
      <div className="mr-4 mb-6 hidden items-center justify-center lg:flex">
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
        <div className=" top-grid -mb-36 p-5">
          <h1 className="-mx-16 flex w-full justify-center">
            <img
              src="/images/logo.png"
              alt="Instagram Logo"
              className="mt-4 mb-6 w-48 "
            />
          </h1>
          <h1 className="flex justify-center text-center ">
            <p className="mb-8 text-[16px] font-semibold text-gray-500 ">
              Login to your account.
            </p>
          </h1>
          {error && <p className="error-text">{error}</p>}
          <form method="POST" onSubmit={handleLogin}>
            <input
              type="email"
              autoComplete="email"
              required
              value={emailAddress}
              aria-label="Enter Your Email Address"
              placeholder="Email Address"
              className="input text-xs"
              onChange={({ target }) => {
                setEmailAddress(target.value), setError("");
              }}
            />
            <input
              type="password"
              autoComplete="current-password"
              required
              aria-label="Enter Your Password"
              placeholder="Password"
              value={password}
              className="input text-xs"
              onChange={({ target }) => {
                setPassword(target.value), setError("");
              }}
            />
            <button
              className={`submit ${isInvalid && " bg-opacity-40"}`}
              disabled={isInvalid}
              type="submit"
              onClick={() => setLoading(true)}
            >
              {loading ? "Logging in" : "Log in"}
            </button>
            <div className="my-3 flex items-center gap-2">
              <div className="h-0 w-full border-b-[1px] border-gray-400 bg-transparent"></div>
              <div className="text-base font-semibold uppercase text-gray-500">
                or
              </div>
              <div className="h-0 w-full border-b-[1px] border-gray-400 bg-transparent"></div>
            </div>
            <button
              type="button"
              className="mt-6 mb-4 flex w-full items-center justify-center text-[#4267B2]"
              onClick={handleFacebookLogin}
            >
              <FacebookIcon fill="#4267B2" />
              <span className="ml-1 text-xs font-semibold">
                Log in with Facebook
              </span>{" "}
            </button>
            <h1 className="flex justify-center text-center ">
              <button
                // onClick={handleResetPassword}
                className="my-3 text-xs font-semibold text-gray-500 decoration-inherit"
              >
                Forgot Password?
              </button>
            </h1>
          </form>
        </div>
        <div className=" bottom-grid mt-40">
          <p className="mr-2 text-sm font-semibold">Don't have an Account?</p>
          <Link
            to={ROUTES.SIGN_UP}
            className=" text-sm font-bold text-blue-400"
          >
            Sign Up
          </Link>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-center rounded">
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
      <br />
      <br />
      <br />
      <br />

      <Copyright />
    </div>
  );
}

export default Login;
