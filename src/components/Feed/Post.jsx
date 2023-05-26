import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import Header from './Header';
import Image from './Image';
import Video from './Video'; // Video component needs to be created, see below
import Buttons from './Buttons';
import Captions from './Captions';
import Comments from './Comments';

function Post({ content }) {
  const handleFocus = () => commentInput.current.focus();
  const commentInput = useRef(null);
  const [toggledLiked, setToggledLiked] = useState(content.userLikedPhoto);
  const [likes, setLikes] = useState(content.likes?.length);

  const isVideo = content.videoSrc !== undefined && content.videoSrc !== null;

  return (
    <div className="container my-5 divide-y rounded-md border bg-white shadow-md">
      <Header id={content.id} username={content.username} userImage={content.userImage} />
      {isVideo ? (
        <Video
          src={content.videoSrc}
          caption={content.caption}
          id={content.id}
          toggledLiked={toggledLiked}
          setToggledLiked={setToggledLiked}
          likes={likes}
          setLikes={setLikes}
        />
      ) : (
        <Image
          src={content.imageSrc}
          caption={content.caption}
          id={content.id}
          toggledLiked={toggledLiked}
          setToggledLiked={setToggledLiked}
          likes={likes}
          setLikes={setLikes}
        />
      )}
      <div>
        <Buttons
          id={content.id}
          handleFocus={handleFocus}
          toggledLiked={toggledLiked}
          setToggledLiked={setToggledLiked}
          likes={likes}
          setLikes={setLikes}
        />
        <Captions caption={content.caption} username={content.username} />
      </div>
      <div>
        <Comments id={content.id} postedAt={content.timestamp} commentInput={commentInput} />
      </div>
    </div>
  );
}

Post.propTypes = {
  content: PropTypes.shape({
    username: PropTypes.string.isRequired,
    userImage: PropTypes.string.isRequired,
    imageSrc: PropTypes.string,
    videoSrc: PropTypes.string,
    caption: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    userLikedPhoto: PropTypes.bool.isRequired,
    likes: PropTypes.array,
    timestamp: PropTypes.object.isRequired
  })
};

export default Post;
