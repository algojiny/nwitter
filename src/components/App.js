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
      if (user) {
        if (user.displayName == null) {
          const name = userObj?.email.split("@")[0];
          await updateProfile(user, {
            displayName: name,
          });
        }
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
