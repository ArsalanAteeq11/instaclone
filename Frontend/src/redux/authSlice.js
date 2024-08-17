import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    otherUsers: null,
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updatebookmark: (state, action) => {
      if (state.user?.bookmarks?.includes(action.payload)) {
        state.user.bookmarks = state.user.bookmarks.filter(
          (postId) => postId !== action.payload
        );
      } else {
        state.user?.bookmarks?.push(action.payload);
      }
    },
    updateFollowing: (state, action) => {
      if (state.user?.following?.includes(action.payload)) {
        state.user.following = state.user.following.filter(
          (id) => id !== action.payload
        );
      } else {
        state.user?.following?.push(action.payload);
      }
    },
    updateFollowers: (state, action) => {
      if (state.userProfile?.followers?.includes(action.payload)) {
        state.userProfile.followers = state.userProfile.followers.filter(
          (id) => id !== action.payload
        );
      } else {
        state.userProfile?.followers?.push(action.payload);
      }
    },
    updateOtherUsers: (state, action) => {
      state.otherUsers?.map((otherUser) => {
        if (otherUser?.followers?.includes(action.payload)) {
          otherUser.followers = otherUser.followers.filter(
            (id) => id !== action.payload
          );
        } else {
          otherUser.followers.push(action.payload);
        }
      });
    },
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});
export const {
  setUser,
  updatebookmark,
  getOtherUsers,
  setUserProfile,
  updateFollowing,
  updateFollowers,
  updateOtherUsers,
  setSelectedUser,
} = authSlice.actions;
export default authSlice.reducer;

// const user = state?.otherUsers?.find(
//   (otherUser) => otherUser?._id === action.payload
// );
// if (user?.followers?.includes(state.user.userId)) {
//   user.followers = user.followers.filter(
//     (item) => item !== state.user.userId
//   );
// } else {
//   user.followers.push(state.user.userId);
// }
