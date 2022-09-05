import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { db, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [edting, setEditing] = useState(false); //edit모드 설정
  const [newNweet, setNewNweet] = useState(nweetObj.text); //input에 입력된 text업데이트
  const onDeleteClick = async () => {
    const ok = confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(doc(db, "nweets", nweetObj.id)); //firestore에서 뉴윗객체 지우기
      if (nweetObj.attachmentUrl !== null)
        await deleteObject(ref(storageService, nweetObj.attachmentUrl)); //storage에서 첨부파일 지우기
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "nweets", nweetObj.id), {
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };
  return (
    <div className="nweet">
      {edting ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  required
                  autoFocus
                  onChange={onChange}
                  className="formInput"
                />
                <input type="submit" value="Update Nweet" className="formBtn" />
              </form>
              <button onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
