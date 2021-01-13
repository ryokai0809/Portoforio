import React from 'react'
import styles from "./Rule.module.css";
import rank from '../pictures/ranking.png';
import input from '../pictures/input.png';
import like from '../pictures/like.png';
import submit from '../pictures/submit.png';

const Rule: React.FC = () => {
    return (
        <>
            <ol className={styles.rule}>
                <li>
                    <br/>
                    <br/>
                    <div className={styles.rule_detail}>
                        お題を出題したり
                    </div>
                    <img className={styles.long_pic} src={input} alt=""/>
                </li>
                <li>
                    <br/>
                        <br/>
                        <div className={styles.rule_detail}>
                            30秒以内に回答し
                        </div>
                        <img className={styles.long_pic} src={submit} alt=""/>
                        <br/>
                        <br/>
                        <div className={styles.rule_detail}>
                            一本を渡したり、貰ったり
                        </div>
                        <img className={styles.long_pic} src={like} alt=""/>
                    </li>
                <li>
                    <br/>
                    <br/>
                    <div className={styles.rule_detail}>
                        沢山の Ippon を獲得し、ランキング上位へ <span className={styles.important}>（10票で一本）</span>
                    </div>
                    <span>
                    <img className={styles.pic} src={rank} alt=""/>
                    </span>
                </li>
            </ol>
            <div className={styles.footer}>バグのお問い合わせ：saitoe3437771@gmail.com</div>
        </>
    )
}

export default Rule
