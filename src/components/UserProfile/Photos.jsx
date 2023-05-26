import React from "react";
import PropTypes from "prop-types";
import Media from "./Photo";
import { postModalState } from "../../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { PlusCircleIcon } from "@heroicons/react/outline";
function Photos({ photos }) {
  const [open, setOpen] = useRecoilState(postModalState);

  return photos.length > 0 ? (
    <div className="grid h-0 grid-cols-3 justify-center gap-1 ">
      {photos.map((photo) => {
        const isVideo = photo.videoSrc !== undefined && photo.videoSrc !== null;

        return (
          <div
            key={photo.id}
            className="group relative h-0 w-auto cursor-pointer overflow-hidden py-[75%] px-0 pt-0"
          >
            <Media
              image={isVideo ? null : photo.imageSrc}
              videoSrc={isVideo ? photo.videoSrc : null}
              photoId={photo.id}
              likes={photo.likes.length}
            />
          </div>
        );
      })}
    </div>
  ) : (
    <div className="my-4 text-center text-3xl">
      <button
        onClick={() => setOpen(true)}
      >
        <img src="/photocam.png" className="h-14 mt-6" />
      </button>
      <br />
      <br />
      <strong>Share Photos</strong>
      <p className="my-4 text-center text-sm">
        When you share photos, they will appear on your profile.
      </p>
      <button
        onClick={() => setOpen(true)}
        className=" text-sm text-blue-400 hover:text-black"
      >
        <strong>Share your first photo</strong>
      </button>
    </div>
  );
}

export default Photos;

Photos.propTypes = {
  photos: PropTypes.array.isRequired,
};
