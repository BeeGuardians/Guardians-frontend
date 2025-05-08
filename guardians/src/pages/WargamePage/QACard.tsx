import styles from "./QACard.module.css";
import viewIcon from "../../assets/view.png";
import likeIcon from "../../assets/like.png";
import commentIcon from "../../assets/comment.png";
import { useNavigate } from "react-router-dom";

type QACardProps = {
    question: {
        id: number;
        wargameTitle: string;
        title: string;
        content: string;
        username: string;
        createdAt: string;
        answerCount: number;
        likeCount: number;
        viewCount: number;
    };
    isAnswered: boolean;
};

function QACard({ question, isAnswered }: QACardProps) {
    const navigate = useNavigate();

    return (
        <div
            className={styles.card}
            onClick={() => navigate(`/qna/questions/${question.id}`)}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.04)")}
        >
            <div className={styles.topRow}>
                <span className={styles.wargameTitle}>워게임 {question.wargameTitle}</span>
                <span className={styles.userMeta}>
                    {question.username} · {question.createdAt.split("T")[0]}
                </span>
            </div>

            <div className={styles.title}>{question.title}</div>
            <div className={styles.content}>
                {question.content.length > 150
                    ? question.content.slice(0, 150) + "..."
                    : question.content}
            </div>

            <hr className={styles.separator} />

            <div className={styles.bottomRow}>
                <div className={styles.iconRow}>
                    <div className={styles.iconItem}>
                        <img src={commentIcon} alt="comment" />
                        <span>{question.answerCount} 답변</span>
                    </div>
                    <div className={styles.iconItem}>
                        <img src={likeIcon} alt="like" />
                        <span>{question.likeCount} 추천</span>
                    </div>
                    <div className={styles.iconItem}>
                        <img src={viewIcon} alt="view" />
                        <span>{question.viewCount} 조회</span>
                    </div>
                </div>

                {isAnswered && (
                    <span className={styles.answeredBadge}>답변 완료</span>
                )}
            </div>
        </div>
    );
}

export default QACard;
