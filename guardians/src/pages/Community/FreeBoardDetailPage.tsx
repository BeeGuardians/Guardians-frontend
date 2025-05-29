import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UserInfoModal from './UserInfoModal.tsx'; // UserInfoModal import
import styles from './components/FreeBoardDetailPage.module.css'; // CSS 파일 경로 확인
import Modal from './components/Modal.tsx'; // Modal import

// 게시글 정보 인터페이스
interface Board {
    boardId: number;
    title: string;
    content: string;
    username: string;
    createdAt: string;
    likeCount: number;
    viewCount: number;
    liked: boolean;
    userId: string; // userId 필드 (백엔드 응답과 일치)
    profileImageUrl?: string;
}

// 댓글 정보 인터페이스
interface Comment {
    commentId: number;
    content: string;
    username: string;
    createdAt: string;
    userId: string; // userId 필드 (백엔드 응답과 일치)
    profileImageUrl?: string;
    tier?: string;
}

// UserInfoModal에 전달할 사용자 정보 인터페이스
// UserInfoModal은 'id' 필드를 기대하므로 여기서 매핑해 줍니다.
interface UserForModal {
    id: string; // UserInfoModal에서 사용될 필드명
    username: string;
    profileImageUrl: string;
    email: string;
}

const FreeBoardDetailPage = () => {
    const { id } = useParams<{ id: string }>();
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

    // 유저 정보 모달 관련 상태
    const [userInfo, setUserInfo] = useState<UserForModal | null>(null);
    const [userModalOpen, setUserModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchBoard();
        fetchComments();
        checkLoginStatus();
    }, [id]);

    const fetchBoard = () => {
        axios.get(`/api/boards/${id}`, { withCredentials: true })
            .then(res => {
                const data = res.data.result.data;
                setBoard(data);
                setIsLiked(data.liked);
            })
            .catch(err => console.error("Failed to fetch board:", err));
    };

    const fetchComments = () => {
        axios.get(`/api/boards/${id}/comments`, { withCredentials: true })
            .then(res => setComments(res.data.result.data))
            .catch(err => console.error("Failed to fetch comments:", err));
    };

    const checkLoginStatus = () => {
        axios.get('/api/users/me', { withCredentials: true })
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
        axios.post(`/api/boards/${id}/like`, {}, { withCredentials: true })
            .then(res => {
                const liked = res.data.result.data.liked;
                setIsLiked(liked);
                setBoard(prev => prev ? {
                    ...prev,
                    likeCount: prev.likeCount + (liked ? 1 : -1)
                } : prev);
            })
            .catch(err => console.error("Failed to toggle like:", err));
    };

    const handleDelete = () => {
        setConfirmDeletePost(true);
    };

    const confirmDeletePostAction = () => {
        if (!board) return;
        axios.delete(`/api/boards/${board.boardId}`, { withCredentials: true })
            .then(() => {
                setInfoMessage('게시글이 삭제되었습니다.');
                setShowInfoModal(true);
            })
            .catch(err => {
                console.error("Failed to delete post:", err);
                setInfoMessage('게시글 삭제 실패');
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

        axios.post(`/api/boards/${id}/comments`, { content: newComment }, { withCredentials: true })
            .then(() => {
                setNewComment('');
                fetchComments();
            })
            .catch(err => {
                console.error("Failed to submit comment:", err);
                setInfoMessage('댓글 등록 실패');
                setShowInfoModal(true);
            });
    };

    const startEditComment = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
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
        } catch (err) {
            console.error("Failed to edit comment:", err);
            setInfoMessage('댓글 수정 실패');
            setShowInfoModal(true);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await axios.delete(`/api/boards/${id}/comments/${commentId}`, { withCredentials: true });
            setConfirmDeleteCommentId(null);
            fetchComments();
        } catch (err) {
            console.error("Failed to delete comment:", err);
            setInfoMessage('댓글 삭제 실패');
            setShowInfoModal(true);
        }
    };

    // 유저 프로필 클릭 시 유저 정보 모달 띄우기
    const handleUserClick = async (targetUserId: string) => {
        try {
            console.log("FreeBoardDetailPage: handleUserClick called for targetUserId:", targetUserId);

            // /api/users/{targetUserId} API 호출하여 사용자 기본 정보 가져오기
            const res = await axios.get(`/api/users/${targetUserId}`, { withCredentials: true });
            const userData = res.data.result.data; // 서버로부터 받은 원본 유저 데이터

            console.log("FreeBoardDetailPage: Fetched user base info (from /api/users/{userId}):", userData);

            const userInfoForModal: UserForModal = {
                id: String(userData.userId), // 여기서 userData.userId 값을 사용합니다.
                username: userData.username,
                profileImageUrl: userData.profileImageUrl,
                email: userData.email,
            };

            console.log("FreeBoardDetailPage: Prepared userInfoForModal object:", userInfoForModal);
            console.log("FreeBoardDetailPage: Type of userInfoForModal.id:", typeof userInfoForModal.id);


            setUserInfo(userInfoForModal); // UserInfoModal에 전달할 userInfo 설정
            setUserModalOpen(true); // 유저 정보 모달 열기

        } catch (error) {
            // 만약 여기서 에러가 발생하면, userData.userId 접근 전에 문제가 생긴 것일 수 있습니다.
            console.error("FreeBoardDetailPage: Error fetching user base info for modal or preparing data:", error);
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
                                    width: '60px',
                                    height: '35px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {isLiked ? "❤️" : "🤍"} {board.likeCount}
                            </button>
                        </div>
                        <div className={styles.meta}>
                            <span>
                                <span
                                    className={styles.usernameLink}
                                    onClick={() => handleUserClick(board.userId)}
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
                                                        onClick={() => handleUserClick(comment.userId)}
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

            <Modal
                isOpen={confirmDeleteCommentId !== null}
                onClose={() => setConfirmDeleteCommentId(null)}
                onConfirm={() => handleDeleteComment(confirmDeleteCommentId!)}
                message="댓글을 삭제할까요?"
            />

            <Modal
                isOpen={confirmDeletePost}
                onClose={() => setConfirmDeletePost(false)}
                onConfirm={confirmDeletePostAction}
                message="정말 삭제하시겠습니까?"
            />

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

export default FreeBoardDetailPage;