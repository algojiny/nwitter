import React, { useRef, useState } from "react";
import { db, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

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
      creatorPhoto: userObj.photoURL,
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
    //선택한 파일의 정보를 불러오기
    reader.readAsDataURL(theFile);
    //이벤트 리스너를 추가하여, 정보 불러오기가 끝나면 파일정보중 url을 result로 저장
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    // console.log(theFile);
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
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
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
}
