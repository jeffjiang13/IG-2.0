import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getUserByUserId } from "../../services/firebase";

function Stories({ activeUserId, following }) {
  const [users, setUsers] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);

    // Fetch users
    const getUsers = async () => {
      const userPromises = following.map(userId => getUserByUserId(userId));
      const usersData = await Promise.all(userPromises);
      const fetchedUsers = usersData.map(([user]) => user);
      setUsers(fetchedUsers);

      const activeUser = await getUserByUserId(activeUserId);
      setUsers(prevUsers => [activeUser[0], ...prevUsers]);
    };

    getUsers();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [activeUserId, following]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Conditional arrow styles
  const arrowStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: isDesktop ? 'block' : 'none', // Hide arrows on mobile
  };

  return following && (
    <div className="container mt-5 overflow-hidden rounded-md border bg-white shadow-sm relative">
      <button
        onClick={() => handleScroll('left')}
        style={{ ...arrowStyles, left: 0 }}
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-800 rounded-full bg-white items-center justify-center hover:bg-gray-300" />
      </button>
      <div
        ref={scrollContainerRef}
        className="flex h-full w-full space-x-2 overflow-x-scroll p-2"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
        }}
      >
        {users.map((content, index) => (
          <div
            className="relative flex h-full max-w-full flex-col items-center justify-center text-center"
            key={index}
          >
            <Link to={`/profile/${content.username}`}>
              <img
                src={content.image}
                alt={content.username}
                className="aspect-square h-16 w-16 cursor-pointer rounded-full border-2 border-solid border-transparent object-cover p-[2px] border-gradient-t-insta-gray-50"
              />
            </Link>
            {content.userId === activeUserId && (
              <span className="absolute top-[50%] -right-1 rounded-full border-2 border-white bg-white">
                <PlusIcon className="h-5 rounded-full bg-blue-500 bg-opacity-80 p-[2px] text-white shadow-md" />
              </span>
            )}
            <Link
              to={`/profile/${content.username}`}
              className="text-center text-xs text-gray-500"
            >
              <p className="w-[70px] truncate">{content.username}</p>
            </Link>
          </div>
        ))}
      </div>
      <button
        onClick={() => handleScroll('right')}
        style={{ ...arrowStyles, right: 0 }}
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-800 rounded-full bg-white items-center justify-center hover:bg-gray-300" />
      </button>
    </div>
  );
}

Stories.propTypes = {
  activeUserId: PropTypes.string.isRequired,
  following: PropTypes.array.isRequired,
};

export default Stories;
