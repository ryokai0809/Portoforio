import React, { useState } from 'react'
import styles from "./TweetInput.module.css";
import { useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";
import { storage, db } from "../firebase";
import { Avatar, Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

function TweetInput() {
    const user = useSelector(selectUser);
    const [tweetImage, setTweetImage] = useState<File | null>(null);
    const [tweetMsg, setTweetMsg] = useState("");

    const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files![0]) {
            setTweetImage(e.target.files![0]);
            e.target.value = "";
        }
    };

    const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (tweetImage) {
            const S =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const N = 16;
            const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
              .map((n) => S[n % S.length])
              .join("");
            const fileName = randomChar + "_" + tweetImage.name;
            const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
            uploadTweetImg.on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              () => {},
              (err) => {
                alert(err.message);
              },
              async () => {
                await storage
                  .ref("images")
                  .child(fileName)
                  .getDownloadURL()
                  .then(async (url) => {
                    await db.collection("posts").add({
                      avatar: user.photoUrl,
                      image: url,
                      text: tweetMsg,
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      username: user.displayName,
                      postId: randomChar,
                      likeCount: 0,
                      likeUser: [],
                      challengeUser: [],
                    });
                  });
              }
            );
        } else {
            const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYZ0123456789";
            const N = 16; 
            const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
            .map((n) => S[n % S.length])
            .join("");
            db.collection("posts").add({
                avatar: user.photoUrl,
                postId: randomChar,
                image: '',
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
                likeCount: 0,
                likeUser: [],
                challengeUser: [],
            });
        }
        setTweetImage(null);
        setTweetMsg("");
    };
    
    return (
        <>
        <form onSubmit={sendTweet}>
            <div className={styles.tweet_form}>
                <Avatar
                className={styles.tweet_avator}
                src={user.photoUrl}
                />
            <input
                className={styles.tweet_input}
                placeholder="お題を入力して下さい"
                type="text"
                autoFocus
                value={tweetMsg}
                onChange={(e) => setTweetMsg(e.target.value)}
            />
                <IconButton>
                    <label>
                        <AddAPhotoIcon
                            className={
                                tweetImage ? styles.tweet_addIconLoaded: styles.tweet_addIcon
                            }
                        />
                        <input
                            className={styles.tweet_hiddenIcon}
                            type="file"
                            onChange={onChangeImageHandler}
                        />
                    </label>
                </IconButton>
                </div>
                <Button
                type="submit"
                disabled={!tweetMsg}
                className={
                    tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
                }
                >
                    お題出題
                </Button>
        </form>
        </>
    )
}

export default TweetInput