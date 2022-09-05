import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService, { db } from "../fbase";

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
      console.log(userObj.displayName);
    }
  };
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  const getMyNweets = async () => {
    //동일한 uid를 조건부로 필터링하는 쿼리
    const q = query(
      collection(db, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
    );
    //쿼리를 실행하고 결과를 QuerySnapshot 으로 반환
    const nweets = await getDocs(q);
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
export default Profile;
