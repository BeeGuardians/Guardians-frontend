import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './components/FreeBoardDetailPage.module.css';
import Modal from "./components/Modal.tsx";

interface Board {
    boardId: number;
    title: string;
    content: string;
    username: string;
    createdAt: string;
    likeCount: number;
    viewCount: number;
    liked: boolean;
    userId: string;
}

interface Comment {
    commentId: number;
    content: string;
    username: string;
    createdAt: string;
    userId: string;
}

const FreeBoardDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [board, setBoard] = useState<Board | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState<number | null>(null);

    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchBoard();
        fetchComments();
        checkLoginStatus();
    }, [id]);

    const fetchBoard = () => {
        axios.get(`/api/boards/${id}`, {withCredentials: true})
            .then(res => {
                const data = res.data.result.data;
                setBoard(data);
                setIsLiked(data.liked);
            });
    };

    const fetchComments = () => {
        axios.get(`/api/boards/${id}/comments`, {withCredentials: true})
            .then(res => setComments(res.data.result.data));
    };

    const checkLoginStatus = () => {
        axios.get('/api/users/me', {withCredentials: true})
            .then(res => {
                const id = res.data.result.data.id;
                setIsLoggedIn(true);
                setSessionUserId(String(id));
            })
            .catch(() => {
                setIsLoggedIn(false);
                setSessionUserId(null);
            });
    };

    const toggleLike = () => {
        if (!id) return;
        axios.post(`/api/boards/${id}/like`, {}, {withCredentials: true})
            .then(res => {
                const liked = res.data.result.data.liked;
                setIsLiked(liked);
                setBoard(prev => prev ? {
                    ...prev,
                    likeCount: prev.likeCount + (liked ? 1 : -1)
                } : prev);
            });
    };

    const handleDelete = () => {
        setConfirmDeletePost(true);
    };

    const confirmDeletePostAction = () => {
        if (!board) return;
        axios.delete(`/api/boards/${board.boardId}`, { withCredentials: true }).then(() => {
            setInfoMessage('게시글이 삭제되었습니다.');
            setShowInfoModal(true);
        });
    };

    const handleInfoModalClose = () => {
        setShowInfoModal(false);
        if (infoMessage === '게시글이 삭제되었습니다.') {
            navigate('/community/free');
        }
    };

    const handleEdit = () => {
        if (!board) return;
        navigate(`/community/free/edit/${board.boardId}`);
    };

    const handleCommentSubmit = () => {
        if (!newComment.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }

        axios.post(`/api/boards/${id}/comments`, {content: newComment}, {withCredentials: true})
            .then(() => {
                setNewComment('');
                fetchComments();
            });
    };

    const startEditComment = (id: number, content: string) => {
        setEditingCommentId(id);
        setEditingCommentContent(content);
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentContent('');
    };

    const handleConfirmEditComment = async (commentId: number) => {
        if (!editingCommentContent.trim()) return;
        try {
            await axios.patch(`/api/boards/${id}/comments/${commentId}`, {
                content: editingCommentContent
            }, {withCredentials: true});
            setEditingCommentId(null);
            setEditingCommentContent('');
            fetchComments();
        } catch {
            setInfoMessage('댓글 수정 실패');
            setShowInfoModal(true);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await axios.delete(`/api/boards/${id}/comments/${commentId}`, {withCredentials: true});
            setConfirmDeleteCommentId(null);
            fetchComments();
        } catch {
            setInfoMessage('댓글 삭제 실패');
            setShowInfoModal(true);
        }
    };




    if (!board) {
        return <div style={{textAlign: 'center', marginTop: '2rem'}}>로딩 중...</div>;
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(-1)}
                        style={{
                            fontSize: '2rem',
                            textDecoration: 'none'
                    }}
                    >
                        ←
                    </button>
                    {isLoggedIn && String(sessionUserId) === String(board.userId) && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className={styles.deleteBtn} onClick={handleEdit}>수정하기</button>
                            <button className={styles.deleteBtn} onClick={handleDelete}>삭제하기</button>
                        </div>         )}
                </div>

                <div className={styles.leftColumn}>
                    <div className={styles["header-card"]}>
                        <div className={styles["title-row"]}>
                            <h1 className={styles.title}>{board.title}</h1>
                            <button
                                onClick={toggleLike}
                                disabled={!isLoggedIn}
                                className={`${styles["action-btn"]} ${isLiked ? styles.active : ""}`}
                                style={{
                                    marginLeft: '1rem',
                                    cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                                    width: '60px',
                                    height: '35px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {isLiked ? "❤️" : "🤍"} {board.likeCount}
                            </button>                        </div>
                        <div className={styles.meta}>
                            <span>✍ 작성자: {board.username}</span>
                            <span>🕒 작성일: {new Date(board.createdAt).toLocaleDateString()}</span>
                            <span>👀 조회 {board.viewCount}</span>
                            <span>👍 추천 {board.likeCount}</span>
                        </div>
                    </div>

                    <div className={styles.plainContent}>
                        {board.content}
                    </div>

                    <div className={styles.commentSection}>
                        <h2 className={styles.commentTitle}>댓글 {comments.length}</h2>

                        {isLoggedIn && (
                            <div className={styles.commentForm}>
                                <textarea
                                    className={styles.commentTextarea}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="댓글을 입력하세요"
                                />
                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                                    <button
                                        className={styles.submitBtn}
                                        onClick={handleCommentSubmit}
                                    >
                                        등록
                                    </button>
                                </div>
                            </div>
                        )}

                        {comments.length === 0 ? (
                            <p className={styles.noComment}>아직 댓글이 없습니다.</p>
                        ) : (
                            <ul className={styles.commentList}>
                                {comments.map(comment => (
                                    <li key={comment.commentId} className={styles.commentItem}>
                                        <div className={styles.commentHeader}>
                                            <div className={styles.username}>{comment.username}</div>
                                            <small className={styles.createdAt}>
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>

                                        {editingCommentId === comment.commentId ? (
                                            <>
                                                <textarea
                                                    className={styles.commentTextarea}
                                                    value={editingCommentContent}
                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                />
                                                <div className={styles.reviewActionBtns}>
                                                    <button
                                                        onClick={() => handleConfirmEditComment(comment.commentId)}>저장
                                                    </button>
                                                    <button onClick={cancelEditComment}>취소</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className={styles.commentContent}>{comment.content}</p>
                                                {isLoggedIn && String(sessionUserId) === String(comment.userId) && (
                                                    <div className={styles.reviewActionBtns}>
                                                        <button onClick={() => startEditComment(comment.commentId, comment.content)}>수정</button>
                                                        <button onClick={() => setConfirmDeleteCommentId(comment.commentId)}>삭제</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ 댓글 삭제 모달 */}
            <Modal
                isOpen={confirmDeleteCommentId !== null}
                onClose={() => setConfirmDeleteCommentId(null)}
                onConfirm={() => handleDeleteComment(confirmDeleteCommentId!)}
                message="댓글을 삭제할까요?"
            />

            {/* ✅ 게시글 삭제 모달 */}
            <Modal
                isOpen={confirmDeletePost}
                onClose={() => setConfirmDeletePost(false)}
                onConfirm={confirmDeletePostAction}
                message="정말 삭제하시겠습니까?"
            />

            {/* ✅ 알림 모달 */}
            <Modal
                isOpen={showInfoModal}
                onClose={handleInfoModalClose}
                onConfirm={handleInfoModalClose}
                message={infoMessage}
                showCancelButton={false}
            />
        </div>
    );
};

export default FreeBoardDetailPage;
