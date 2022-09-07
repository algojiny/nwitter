import {
  faArrowRight,
  faArrowRotateRight,
  faCheck,
  faCircleCheck,
  faPlus,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
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
    // if (userObj.displayName !== newDisplayName) {
    //   await updateProfile(authService.currentUser, {
    //     displayName: newDisplayName,
    //   });
    //   refreshUser();
    //   console.log(userObj.displayName);
    // }

    //프로필사진을 storage에 저장하기 만들어야함
    if (
      userObj.displayName === newDisplayName &&
      userObj.photoURL === attachment
    ) {
      alert("변경된 사항이 없습니다.");
    } else {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
        photoURL: attachment,
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

  const [attachment, setAttachment] = useState(userObj.photoURL);
  const [userPhoto, setUserPhoto] = useState(userObj.photoURL);
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
    // console.log(theFile, userObj.photoURL);
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment(userPhoto);
    fileInput.current.value = null;
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <label htmlFor="attach-file" className="profilePhoto__label"></label>
        <div className="profilePhoto__attachment">
          {attachment === null ? (
            <div className="photoNullBox">
              <FontAwesomeIcon icon={faUser} size="4x" />
            </div>
          ) : (
            <img
              src={attachment}
              style={{
                backgroundImage: attachment,
              }}
            />
          )}
          <div className="profilePhoto__clear" onClick={onClearAttachment}>
            <span>Cancel </span>
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </div>
        </div>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
          ref={fileInput}
        />
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
