import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MiniProfileLoader } from "./Loader";
import * as ROUTES from "../../constants/routes";
import { getAuth, signOut } from 'firebase/auth';  // Add the firebase services here

function MiniProfile({ username, fullName, image }) {
  const auth = getAuth();

  return !username || !fullName ? (
    <MiniProfileLoader />
  ) : (
    <div className="flex justify-between items-center">
      <Link
        to={`/profile/${username}`}
        className="my-2 flex items-center"
      >
        <img
          src={image}
          alt={username}
          className="aspect-square h-14 w-14 cursor-pointer rounded-full border-2 border-gray-300 object-cover p-[2px] text-center"
        />
        <div className="mx-4 flex-1 text-sm">
          <h2 className="cursor-pointer font-semibold text-gray-700">
            {username}
          </h2>
          <h3 className=" text-gray-400">{fullName}</h3>
        </div>
      </Link>
      <Link to={ROUTES.LOGIN} className="ml-2">
        <button
          className="text-blue-500 font-semibold text-xs"
          type="button"
          aria-label="Log Out"
          onClick={() => signOut(auth)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              signOut(auth);
            }
          }}
        >
          Switch
        </button>
      </Link>
    </div>
  );
}
export default MiniProfile;

MiniProfile.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  image: PropTypes.string,
};
