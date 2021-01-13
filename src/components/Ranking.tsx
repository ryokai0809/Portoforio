import React, { useState, useEffect } from 'react';
import {db} from "../firebase";
import {Avatar} from "@material-ui/core";
import styles from "./Ranking.module.css";
import { makeStyles } from "@material-ui/core/styles";


interface CHALLENGEUSERS {
    id: string;
    avatar: string;
    displayName: string;
    totalIppon: number; 
}

const useStyles = makeStyles((theme) => ({
    big: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginRight: theme.spacing(1),
    }
}));

const Ranking:React.FC = () => {
    const classes = useStyles();
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
        .orderBy("totalIppon", "desc")
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
    }, []);

    return (
        <>
            {challengeUsers[0]?.id && 
            <ol className={styles.rankings}>
            {challengeUsers.map(User => (
                <li>
                <div key={User.id} className={styles.players}>
                    <span>
                        <Avatar src={User.avatar} className={classes.big}/>
                    </span>
                    <div className={styles.profile_details}>
                        <div className={styles.profile_name}>プレイヤー名：{User.displayName}</div>
                        <div className={styles.profile_ippon}>一本数：{User.totalIppon}</div>
                    </div>
                </div>
                </li>
            ))}
            </ol>
            }
        </>
    )
}

export default Ranking

