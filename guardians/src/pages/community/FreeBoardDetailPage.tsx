import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './FreeBoardDetailPage.module.css';

interface Board {
    boardId: number;
    title: string;
    content: string;
    username: string;
    createdAt: string;
    likeCount: number;
    viewCount: number;
    liked: boolean;
}

const FreeBoardDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [board, setBoard] = useState<Board | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/boards/${id}`, { withCredentials: true })
                .then(res => setBoard(res.data.result.data))
                .catch(err => {
                    console.error('게시글 상세 불러오기 실패', err);
                    alert('게시글을 불러오지 못했습니다.');
                });
        }
    }, [id]);

    const toggleLike = () => {
        axios.post(`/api/boards/${id}/like`, {}, { withCredentials: true })
            .then(() => {
                setBoard(prev => prev ? { ...prev, liked: !prev.liked, likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1 } : prev);
            })
            .catch(err => {
                console.error('좋아요 실패', err);
                alert('좋아요 처리 중 문제가 발생했습니다.');
            });
    };



    if (!board) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    ← 뒤로가기
                </button>

                <div className={styles.headerRow}>
                    <h1 className={styles.title}>{board.title}</h1>
                    <div className={styles.actionRow}>
                        <button
                            onClick={toggleLike}
                            className={`${styles['action-btn']} ${board.liked ? styles.active : ''}`}
                        >
                            {board.liked ? '❤️' : '🤍'} {board.likeCount}
                        </button>
                    </div>
                </div>

                <div className={styles.meta}>
                    작성자: {board.username} | 작성일: {new Date(board.createdAt).toLocaleDateString()} | 조회수: {board.viewCount}
                </div>

                <div className={styles.contentBox}>
                    {board.content}
                </div>
            </div>
        </div>
    );
};

export default FreeBoardDetailPage;
