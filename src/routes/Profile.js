import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../fbase";

const Profile = () => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
