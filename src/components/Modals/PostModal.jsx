import React, { Fragment, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { postModalState } from "../../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import {
  CameraIcon,
  CloudUploadIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import useUser from "../../hooks/use-user";
import { addPostsAndVideosToFirestore } from "../../services/firebase";

function PostModal() {
  const [isVideo, setIsVideo] = useState(false);

  const [open, setOpen] = useRecoilState(postModalState);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    user: { username, image, userId },
  } = useUser();

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);
    const caption = captionRef.current.value;
    await addPostsAndVideosToFirestore(
      userId,
      username,
      image,
      caption,
      selectedFile,
      isVideo
    );
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
    document.location.reload();
  };

  const addFileToPost = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (file) {
      reader.onload = (readerEvent) => {
        console.log(readerEvent.target.result);

        setSelectedFile(readerEvent.target.result);
      };
      reader.readAsDataURL(file);
      setIsVideo(file.type.startsWith("video"));
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="absolute inset-0 z-[60] overflow-y-auto"
        onClose={setOpen}
      >
        <div className="m-2 flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opactiy-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opactiy-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full max-w-sm transform space-y-4 overflow-hidden rounded-lg bg-white p-2 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
              <button
                className="float-right outline-none"
                onClick={() => {
                  setOpen(false), setLoading(false), setSelectedFile(null);
                }}
              >
                <XIcon className=" h-6  w-6 cursor-pointer text-gray-300" />
              </button>
              <div
                as="h3"
                className="text-md flex items-center justify-center space-x-4"
              >
                <div className="">
                  {/* <CloudUploadIcon className="mt-[2px] h-8 w-8 text-blue-600" /> */}
                </div>
                <span>
                  <strong>Create new post</strong>
                </span>
              </div>
              <hr />
              <div>
                {selectedFile ? (
                  isVideo ? (
                    <video
                      src={selectedFile}
                      alt="Posting Video"
                      className="w-full cursor-pointer object-contain"
                      onClick={() => setSelectedFile(null)}
                      controls
                    />
                  ) : (
                    <img
                      src={selectedFile}
                      alt="Posting Image"
                      className="w-full cursor-pointer object-contain"
                      onClick={() => setSelectedFile(null)}
                    />
                  )
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto mt-24 flex h-24 w-24 cursor-pointer items-center justify-center"
                  >
                    <img
                      src="/photovideo.png"
                      className=""
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-500"
                    >
                      {selectedFile ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-100"
                            onClick={() => {
                              setSelectedFile(null);
                            }}
                          >
                            <TrashIcon
                              className="h-5 w-5 text-red-600"
                              aria-hidden="true"
                            />
                          </div>
                          <p className="text-sm">
                            Click here to Remove or Change
                          </p>
                        </div>
                      ) : (
                        "Click on the icon to select An image or video."
                      )}
                    </Dialog.Title>
                    <div>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        hidden
                        onChange={addFileToPost}
                        ref={filePickerRef}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Please Enter a Caption"
                        ref={captionRef}
                        className=" w-full border-none text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <div className="flex justify-center">
                    <button
                      className="mb-20 disables:bg-gray-400 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 enabled:hover:scale-[1.03] enabled:active:scale-95 disabled:cursor-not-allowed sm:text-sm "
                      onClick={uploadPost}
                      type="button"
                      disabled={!selectedFile}
                    >
                      {loading ? "Creating..." : "Create Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default PostModal;
