import React, { useRef, useState } from "react";
import { db, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState(""); //신규뉴윗입력
  const [attachment, setAttachment] = useState(null); //첨부파일여부

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = null;
    //첨부파일이 있으면,
    if (attachment !== null) {
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
    }
    //신규뉴윗객체만들기
    const nweetObj = {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    //신규뉴윗 또는 첨부파일이 있으면, 참조 경로에 신규뉴윗객체추가
    if (nweet !== "" || attachment != null)
      await addDoc(collection(db, "nweets"), nweetObj);
    setNweet("");
    onClearAttachment();
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
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
    // console.log(theFile);
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        value={nweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        onChange={onFileChange}
        type="file"
        accept="image/*"
        ref={fileInput}
      />
      <input type="submit" value="Nweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
}
