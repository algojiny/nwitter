import { signOut } from "firebase/auth";
import {
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService, { db } from "../fbase";

const Profile = ({ userObj }) => {
  const navigate = useNavigate();
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

    console.log(nweets.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
