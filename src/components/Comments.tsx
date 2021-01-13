import React, { useState, useEffect } from 'react';
import { Avatar } from "@material-ui/core";
import styles from "./Comments.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from '../features/userSlice';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';


interface PROPS {
    id: string;
    postId: string;
    avatar: string;
    text: string;
    timestamp: any;
    username: string;
    likeUser: string[];
}

interface CHALLENGEUSERS {
    id: string;
    avatar: string;
    displayName: string;
    totalIppon: number; 
}

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        marginRight: theme.spacing(1),
    }
}));

const Comments: React.FC<PROPS> = (props) => {
    const classes = useStyles();
    const user = useSelector(selectUser);
    const [challengeUsers, setChallengeUsers] = useState<CHALLENGEUSERS[]>([{
        id: "",
        avatar: "",
        displayName: "",
        totalIppon: 0,
    },
    ]);

    useEffect(() => {
        const unSub = db
        .collection("challengeUsers")
        .onSnapshot((snapshot) => {
            setChallengeUsers(
                snapshot.docs.map((doc) => ({
                id: doc.id,
                avatar: doc.data().avatar,
                displayName: doc.data().displayName,
                totalIppon: doc.data().totalIppon,
            }))
            );
        });
        return () => {
            unSub();
        };
    }, [props.postId]);

    const likeComment = async () => {
        const challenger = challengeUsers.filter((challenger) => {
            return challenger.displayName === props.username;
        })
        if(props.likeUser && props.likeUser.includes(user.displayName)){
            await db.collection("posts").doc(props.postId).collection("comments").doc(props.id).update({
                likeUser: firebase.firestore.FieldValue.arrayRemove(user.displayName),
            })
        } else {
            await db.collection("posts").doc(props.postId).collection("comments").doc(props.id).update({
                likeUser: firebase.firestore.FieldValue.arrayUnion(user.displayName),
            })
           if (props.likeUser && props.likeUser.length > 9){
            await db.collection("challengeUsers").doc(challenger[0].id).update({
                totalIppon: firebase.firestore.FieldValue.increment(1),
            })
            }
        }
    }

    return (
        <div className={styles.post_comment}>
            <span><Avatar src={props.avatar} className={classes.small}/></span>
            <span className={styles.post_commentUser}>{props.username ? props.username : "anoymous"}</span>
            <span className={styles.post_commentText}>{props.text}</span>
            <span className={styles.post_headerTime}>
            {new Date(props.timestamp?.toDate()).toLocaleString()}
            </span>
            <div>
            {props.likeUser && props.likeUser.includes(user.displayName) ?
            <FavoriteIcon className={styles.like_button} onClick={likeComment}/> :
            <FavoriteBorderIcon className={styles.unlike_button} onClick={likeComment}/> 
            }
            </div>
            <div className={styles.like_numbers}>{props.likeUser ? props.likeUser.length : 0}</div>
        </div>
    )
}

export default Comments

