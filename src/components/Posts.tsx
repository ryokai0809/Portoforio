import React, {useState, useEffect} from 'react'
import styles from "./Posts.module.css";
import { db } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { Avatar, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { selectUser } from '../features/userSlice';
import DeleteIcon from '@material-ui/icons/Delete';
import Forward30Icon from '@material-ui/icons/Forward30';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import Comments from './Comments';

interface PROPS {
    postId: string;
    avatar: string;
    image: string;
    text: string;
    timestamp: any;
    username: string;
    challengeUser: string[];
}

interface COMMENT {
    id: string;
    avatar: string;
    text: string;
    timestamp: any;
    username: string;
    likeUser: string [];
}

const Posts: React.FC<PROPS> = (props) => {
    const user = useSelector(selectUser);
    const [comment, setComment] = useState("");
    const [gameRight, setGameRight] = useState(true);
    const [isGaming, setIsGaming] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [comments, setComments] = useState<COMMENT[]>([
        {
            id: "",
            avatar: "",
            text: "",
            username: "",
            timestamp: null,
            likeUser: [],
        },
    ]);

    useEffect(() => {
        const unSub = db
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
            setComments(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                avatar: doc.data().avatar,
                text: doc.data().text,
                username: doc.data().username,
                timestamp: doc.data().timestamp,
                likeUser: doc.data().likeUser,
            }))
            );
        });
        if(props.challengeUser.includes(user.displayName)){
            setGameRight(false);
        }
        if(props.username === user.displayName){
            setGameRight(false);
        }
        return () => {
            unSub();
        }
    }, [props.postId, props.challengeUser, user.displayName ])


    const [count, setCount] = useState(30);
    let dummyNum: number = 30;
    function showTime(){
        setIsGaming(true);
        const time = setTimeout(showTime, 1000);
        setCount((pre) => pre = pre - 1);
        dummyNum--;
        if(dummyNum < 1) {
            setGameRight(false);
            challengeGame();
            setCount(30);
            dummyNum = 30;
            clearInterval(time);
            setIsGaming(false);        
        }
    }

    function challengeGame(){
        if(!props.challengeUser.includes(user.displayName)) {
            db.collection("posts").doc(props.postId).update({
                challengeUser: firebase.firestore.FieldValue.arrayUnion(user.displayName),
            });
        }
    }

    const newComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        db.collection("posts").doc(props.postId).collection("comments").add({
            avatar: user.photoUrl,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            username: user.displayName,
        });
        setComment("");
    }
    
    const deletePost = () => {
        let con = window.confirm("本当に削除しますか？");
        if(con){
            db.collection("posts").doc(props.postId).delete();
        }
    }

    function startGame() {
        setOpenComments(!openComments);
        if(gameRight){
            showTime();
        }
    }

    return (
        <div className={styles.post}>
            <div className={styles.post_avatar}>
                <Avatar src={props.avatar}/>
            </div>
            <div className={styles.post_body}>
                <div>
                    <div className={styles.post_header}>
                        <div>
                            <span className={styles.post_headerUser}>{props.username}</span>
                            <span className={styles.post_headerTime}>
                                {new Date(props.timestamp?.toDate()).toLocaleString()}
                            </span>
                            {props.avatar === user.photoUrl && <DeleteIcon className={styles.post_delete_button} onClick={deletePost}/>}
                        </div>
                    </div>
                </div>

            <Button disabled={isGaming} onClick={startGame}>
            {gameRight ? 
                <Forward30Icon className={styles.post_tweetImage} /> : 
                <ChromeReaderModeIcon className={styles.post_tweetImage}/>
                }
            </Button>

            {openComments && (<>

            {props.image && (
                <div className={styles.post_tweetImage}>
                    <img src={props.image} alt="tweet"/>
                </div>
            )}

            <div className={styles.post_tweet}>
                {gameRight ? <div className={styles.post_permission}>残り時間：{count} 秒</div> : <div className={styles.post_permission}> 解答権がありません</div>}
                        <div className={styles.post_title}>{props.text}</div>
            </div>



            <form onSubmit={newComment}>
                <div className={styles.post_form}>
                    <input 
                      disabled={!gameRight}
                      className={styles.post_input}
                      type="text"
                      placeholder="回答して下さい"
                      value={comment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setComment(e.target.value)
                      }
                    />
                </div>
                <button
                  className={
                      comment ? styles.post_button : styles.post_buttonDisable
                  }
                  type="submit"
                >
                    <SendIcon className={styles.post_sendIcon}/>
                </button>
            </form>

            {comments.map((com) => (
                <Comments 
                key={com.id}
                id={com.id}
                postId={props.postId}
                avatar={com.avatar}
                text={com.text}
                timestamp={com.timestamp}
                username={com.username}
                likeUser={com.likeUser}
                />
            ))}

            </>)}
            
            </div>
        </div>
    )
}

export default Posts
