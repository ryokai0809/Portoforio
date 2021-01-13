import React, { useState, useEffect } from 'react'
import {db} from "../firebase";
import styles from "./Feed.module.css";
import { auth } from "../firebase";
import Posts from './Posts';
import TweetInput from './TweetInput';
import Rule from './Rule';
import { useTheme } from '@material-ui/core/styles';

//Tab
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Ranking from './Ranking';

const Feed:React.FC = () => {
    const [posts, setPosts] = useState([
        {
            id: "",
            avatar: "",
            image: "",
            text: "",
            timestamp: null,
            username: "",
            likeUser: [],
            challengeUser: [],
        },
    ]); 
    useEffect(() => {
        const unSub = db
        .collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => 
            setPosts(snapshot.docs.map((doc) => ({
                id: doc.id,
                avatar: doc.data().avatar,
                image: doc.data().image,
                text: doc.data().text,
                timestamp: doc.data().timestamp,
                username: doc.data().username,
                likeUser: doc.data().likeUser,
                challengeUser: doc.data().challengeUser,
            }))
            )
            );
        
        return () => {
            unSub();
        };
    }, []);

    interface TabPanelProps {
        children?: React.ReactNode;
        dir?: string;
        index: any;
        value: any;
      }
      
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
    
        return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
            <Box p={3}>
                <Typography>{children}</Typography>
            </Box>
            )}
        </div>
        );
    }
      
    function a11yProps(index: any) {
        return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
    setValue(index);
    };

    return (
        <div className={styles.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="概要" {...a11yProps(0)} />
          <Tab label="お題出題" {...a11yProps(1)} />
          <Tab label="Ippon　ランキング" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
            <Rule/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
        <div>
        <button className={styles.logout} onClick={async () => await auth.signOut()}>Logout</button>
        <div className={styles.feed}>
            <TweetInput/>
            <br/>
                {posts[0]?.id && 
                <>
                {posts.map((post) => (
                    <Posts 
                        key={post.id} 
                        postId={post.id}
                        avatar={post.avatar} 
                        image={post.image} 
                        text={post.text}
                        timestamp={post.timestamp}
                        username={post.username}
                        challengeUser={post.challengeUser}
                    />
                ))}
                </>
                }
        </div>
        </div>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
         <Ranking/>
        </TabPanel>
      </SwipeableViews>
    </div>
    )
}

export default Feed
