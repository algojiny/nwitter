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
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import authService, { db, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";

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
    if (
      userObj.displayName === newDisplayName &&
      userObj.photoURL === attachment
    )
      return alert("변경된 사항이 없습니다.");

    //프로필사진을 storage에 저장하기 만들어야함
    let attachmentUrl = null;
    //첨부파일이 있으면,
    if (attachment !== userObj.photoURL) {
      //파일참조경로 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //storage에 참조경로로 파일 업로드
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      //storage 참조 경로에 있는 파일의 URL을 다운로드
      attachmentUrl = await getDownloadURL(response.ref);
      console.log(attachmentUrl);
    } else {
      attachmentUrl = userObj.photoURL;
    }

    await updateProfile(authService.currentUser, {
      displayName: newDisplayName,
      photoURL: attachmentUrl,
    });
    refreshUser();
    alert("변경 완료 하였습니다.");
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
    console.log(attachment);
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
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
