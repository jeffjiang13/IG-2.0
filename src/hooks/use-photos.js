import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/user';
import { activeUserLatestPost, getPhotos, getUserByUserId } from '../services/firebase';
import PropTypes from 'prop-types';

function usePhotos({ userId: activeUserId }) {
  const [photos, setPhotos] = useState(null);
  const { user: { uid: userId = '' } } = useContext(UserContext);

  useEffect(() => {
    async function getTimelinePhotos() {
      const [{ following }] = await getUserByUserId(userId);
      let followedUserPhotos = [];

      if (following.length > 0) {
        // Divide following into chunks of 10 to abide by Firebase's limitations
        const chunkSize = 10;
        for (let i = 0; i < following.length; i += chunkSize) {
          const chunk = following.slice(i, i + chunkSize);
          const photosFromChunk = await getPhotos(userId, chunk);
          followedUserPhotos = followedUserPhotos.concat(photosFromChunk);
        }
      }

      // Sort photos by timestamp in descending order
      followedUserPhotos.sort((a, b) => b.timestamp - a.timestamp);

      // Set the photos state
      setPhotos(followedUserPhotos);

      // If there's an activeUserId, prepend their latest photo
      if (activeUserId) {
        const activeUserLatestPhoto = await activeUserLatestPost(userId, activeUserId);
        setPhotos((prevPhotos) =>
          activeUserLatestPhoto ? [activeUserLatestPhoto, ...prevPhotos] : prevPhotos
        );
      }
    }

    getTimelinePhotos();
  }, [userId, activeUserId]);

  return { photos };
}

usePhotos.propTypes = {
  activeUserId: PropTypes.string,
};

export default usePhotos;
