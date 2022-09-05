import { updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AppRouter from "../components/Router";
import authService from "../fbase";

function App() {
  const [init, setInit] = useState(false); //firebase초기화
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      // user ? setUserObj(user) : setUserObj(null);
      //이메일로 로그인하여 displayName이 없을때 자동으로 만들어서 넣어주기
      if (user) {
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          await updateProfile(user, {
            displayName: name,
          });
          console.log(user.displayName);
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) =>
            updateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) =>
        updateProfile(user, { displayName: user.displayName }),
    });
  };
  return (
    <div
      style={{
        maxWidth: 890,
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 80,
        justifyContent: "center",
        // height: "100vh",
      }}
    >
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer style={{ textAlign: "center", marginTop: "30px" }}>
        &copy; {new Date().getFullYear()} Nwitter
      </footer>
    </div>
  );
}

export default App;
