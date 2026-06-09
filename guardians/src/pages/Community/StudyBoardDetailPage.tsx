import { useNavigate, useParams } from 'react-router-dom';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './components/BoardDetailPage.module.css'; // BoardDetailPage.module.css 스타일 사용
import Modal from "./components/Modal.tsx";
import UserInfoModal from './UserInfoModal.tsx'; // 유저 정보 모달 임포트

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
    profileImageUrl?: string; // 게시글 작성자 프로필 이미지 추가
}

interface Comment {
    commentId: number;
    content: string;
    username: string;
    createdAt: string;
    userId: string;
    profileImageUrl?: string; // 댓글 작성자 프로필 이미지 추가
    tier?: string; // 티어 정보 추가 (필요하다면)
}

interface UserForModal {
    id: string;
    username: string;
    profileImageUrl: string;
    email: string;
}

const StudyBoardDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [board, setBoard] = useState<Board | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const { user } = useAuth();
    const isLoggedIn = user !== null;
    const sessionUserId = user ? String(user.id) : null;
    const [newComment, setNewComment] = useState('');

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState<number | null>(null);

    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');

    // 유저 정보 모달 관련 상태
    const [userInfo, setUserInfo] = useState<UserForModal | null>(null); // 유저 정보
    const [userModalOpen, setUserModalOpen] = useState(false); // 유저 정보 모달 열기 상태

    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef<HTMLDivElement | null>(null);
    const actionMenuBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchBoard();
        fetchComments();
    }, [id]);

    const fetchBoard = () => {
        axios.get(`/api/boards/${id}`, { withCredentials: true })
            .then(res => {
                const data = res.data.result.data;
                setBoard(data);
                setIsLiked(data.liked); // liked 상태도 여기서 설정
            });
    };

    const fetchComments = () => {
        axios.get(`/api/boards/${id}/comments`, { withCredentials: true })
            .then(res => setComments(res.data.result.data));
    };

    const toggleLike = () => {
        if (!id) return;
        axios.post(`/api/boards/${id}/like`, {}, { withCredentials: true })
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

    const handleEdit = () => {
        if (!board) return;
        navigate(`/community/study/edit/${board.boardId}`);
    };

    const handleCommentSubmit = () => {
        if (!newComment.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }

        axios.post(`/api/boards/${id}/comments`, { content: newComment }, { withCredentials: true })
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
            }, { withCredentials: true });
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
            await axios.delete(`/api/boards/${id}/comments/${commentId}`, { withCredentials: true });
            setConfirmDeleteCommentId(null);
            fetchComments();
        } catch {
            setInfoMessage('댓글 삭제 실패');
            setShowInfoModal(true);
        }
    };

    const handleInfoModalClose = () => {
        setShowInfoModal(false);
        if (infoMessage === '게시글이 삭제되었습니다.') {
            navigate('/community/study');
        }
    };

    // 유저 프로필 클릭 시 유저 정보 모달 띄우기
    const handleUserClick = async (userId: string) => {
        try {
            const res = await axios.get(`/api/users/${userId}`, { withCredentials: true });
            setUserInfo(res.data.result.data);
            setUserModalOpen(true); // 유저 정보 모달 열기
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            setInfoMessage('유저 정보를 불러오는데 실패했습니다.');
            setShowInfoModal(true);
        }
    };

    if (!board) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>로딩 중...</div>;
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(-1)}
                        style={{
                            fontSize: '1.4rem',
                            textDecoration: 'none',
                            color: '#888888',
                            outline: 'none',   // 🔥 포커스 테두리 제거
                            border: 'none',    // 🔥 기본 border 제거
                            background: 'transparent',  // 🔥 필요 시 배경 제거
                            cursor: 'pointer'   // 🔥 클릭 커서 추가
                        }}
                    >
                        ←
                    </button>
                    {isLoggedIn && sessionUserId === board.userId.toString() && (
                        <div className={styles.actionsWrapper} ref={actionsRef}>
                            <button
                                className={styles.actionMenuBtn}
                                ref={actionMenuBtnRef}
                                onClick={() => setShowActions(prev => !prev)}
                            >
                                &#x22EE;
                            </button>

                            {showActions && (
                                <div className={styles.actionButtons}>
                                    <button className={styles.deleteBtn} onClick={handleEdit}>수정하기</button>
                                    <button className={styles.deleteBtn} onClick={handleDelete}>삭제하기</button>
                                </div>
                            )}

                        </div>
                    )}
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
                                    width: '80px',
                                    height: '35px',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {isLiked ? "❤️" : "🤍"} {board.likeCount}
                            </button>
                        </div>
                        <div className={styles.meta}>
                            <span>
                                <span
                                    className={styles.usernameLink}
                                    onClick={() => handleUserClick(board.userId)} // 글쓴이 이름 클릭 시 유저 정보 모달 열기
                                >
                                    {board.username}
                                </span>
                            </span>
                            <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                            <span>👀 조회 {board.viewCount}</span>
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
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                                            <div className={styles.commentProfileImageWrapper} onClick={() => handleUserClick(comment.userId)}>
                                                <img src={comment.profileImageUrl || '/default-profile.png'} alt="프로필" className={styles.commentProfileImage} />
                                            </div>
                                            <div>
                                                <div className={styles.usernameRow}>
                                                    <span
                                                        className={styles.usernameLink}
                                                        onClick={() => handleUserClick(comment.userId)} // 댓글 작성자 이름 클릭 시 유저 정보 모달 열기
                                                    >
                                                        {comment.username}
                                                    </span>
                                                </div>
                                                <small className={styles.createdAt}>
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
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

            {/* 유저 정보 모달 */}
            <UserInfoModal
                isOpen={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                userInfo={userInfo}
            />
        </div>
    );
};

export default StudyBoardDetailPage;