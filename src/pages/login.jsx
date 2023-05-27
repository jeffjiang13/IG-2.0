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
import { facebookProvider} from "../lib/firebase";
import { ImFacebook2 as FacebookIcon } from "react-icons/im";
import { signInWithPopup } from 'firebase/auth';

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
    console.log('handleFacebookLogin called'); // This line is new
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      // The signed-in user info.
      const user = result.user;
      // You can now redirect to another page or do whatever with the user data.
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = error.credential;
      //...
    }
};


  useEffect(() => {
    document.title = "Login - Instagram Clone";
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 overflow-scroll">
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
            <div className="flex gap-2 items-center my-3">
                      <div className="border-b-[1px] bg-transparent border-gray-400 h-0 w-full"></div>
                      <div className="uppercase text-gray-500 font-semibold text-base">
                        or
                      </div>
                      <div className="border-b-[1px] bg-transparent border-gray-400 h-0 w-full"></div>
                    </div>
            <button
            type="button"
            className="flex w-full items-center justify-center text-[#4267B2] mt-6 mb-4"
            onClick={handleFacebookLogin}
          >
            <FacebookIcon fill="#4267B2" />
            <span className="text-xs font-semibold ml-1">
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
