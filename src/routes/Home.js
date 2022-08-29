import { async } from "@firebase/util";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../fbase";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const dbNweets = await getDocs(collection(db, "nweets"));
    dbNweets.forEach((doc) => {
      const nweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setNweets((prev) => [nweetObj, ...prev]);
    });
  };
  useEffect(() => {
    getNweets();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (nweet !== "")
      await addDoc(collection(db, "nweets"), {
        nweet,
        createdAt: serverTimestamp(),
      });
    setNweet("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
  console.log(nweets);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet, id) => (
          <div key={id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
