// lib/facebook.js
export const getFacebookProfilePicture = async (accessToken) => {
    try {
      // Replace {access-token} and {facebook-user-id} with actual values
      const response = await fetch(
        `https://graph.facebook.com/me/picture?type=large&redirect=false&access_token=${accessToken}`
      );
      const data = await response.json();

      if (data && data.data && data.data.url) {
        return data.data.url;
      } else {
        throw new Error('Unable to fetch profile picture');
      }
    } catch (error) {
      console.error('Error fetching Facebook profile picture:', error);
      return null;
    }
  };
