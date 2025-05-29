import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserInfoModal from './UserInfoModal';
import styles from './components/QnaDetailPage.module.css';
import Modal from './components/Modal.tsx';

interface Qna {
    id: number;
    title: string;
    content: string;
    username: string;
    createdAt: string;
    viewCount: number;
    userId: string;
    wargameId: number;
    wargameTitle: string;
    profileImageUrl: string;
}

interface Answer {
    id: number;
    content: string;
    username: string;
    createdAt: string;
    userId: string;
    profileImageUrl?: string;
    tier?: string;
}

interface UserForModal {
    id: string;
    username: string;
    profileImageUrl: string;
    email: string;
}

const QnaDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [qna, setQna] = useState<Qna | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [newAnswer, setNewAnswer] = useState('');
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
    const [editingAnswerContent, setEditingAnswerContent] = useState('');
    const [showActions, setShowActions] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    const [userInfo, setUserInfo] = useState<UserForModal | null>(null);
    const [userModalOpen, setUserModalOpen] = useState(false);

    const actionsRef = useRef<HTMLDivElement | null>(null);
    const actionMenuBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchQna();
        fetchAnswers();
        checkLoginStatus();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                actionsRef.current &&
                !actionsRef.current.contains(event.target as Node) &&
                actionMenuBtnRef.current &&
                !actionMenuBtnRef.current.contains(event.target as Node)
            ) {
                setShowActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchQna = async () => {
        try {
            const res = await axios.get(`/api/qna/questions/${id}`, { withCredentials: true });
            const data = res.data.result.data;
            setQna(data);
            setEditedTitle(data.title);
            setEditedContent(data.content);
        } catch (error) {
            console.error("Error fetching QnA question:", error);
        }
    };

    const fetchAnswers = async () => {
        try {
            const res = await axios.get(`/api/qna/answers/${id}`, { withCredentials: true });
            setAnswers(res.data.result.data);
        } catch (error) {
            console.error("Error fetching QnA answers:", error);
        }
    };

    const checkLoginStatus = () => {
        axios.get('/api/users/me', { withCredentials: true })
            .then(res => {
                const userIdFromSession = String(res.data.result.data.id);
                setIsLoggedIn(true);
                setSessionUserId(userIdFromSession);
            })
            .catch(() => {
                setIsLoggedIn(false);
                setSessionUserId(null);
            });
    };

    const handleDelete = () => setConfirmDeletePost(true);

    const confirmDeletePostAction = async () => {
        try {
            await axios.delete(`/api/qna/questions/${id}?userId=${sessionUserId}`, { withCredentials: true });
            setInfoMessage('질문이 삭제되었습니다.');
            setShowInfoModal(true);
        } catch (error) {
            console.error("Error deleting question:", error);
            setInfoMessage('질문 삭제에 실패했습니다.');
            setShowInfoModal(true);
        }
    };

    const handleEdit = () => setEditingQuestion(true);

    const handleSaveQuestionEdit = async () => {
        try {
            await axios.patch(`/api/qna/questions/${id}?userId=${sessionUserId}`, {
                title: editedTitle,
                content: editedContent
            }, { withCredentials: true });
            setEditingQuestion(false);
            fetchQna();
        } catch (error) {
            console.error("Error saving question edit:", error);
            setInfoMessage('질문 수정에 실패했습니다.');
            setShowInfoModal(true);
        }
    };

    const handleInfoModalClose = () => {
        setShowInfoModal(false);
        if (infoMessage === '질문이 삭제되었습니다.') navigate('/community/qna');
    };

    const handleAnswerSubmit = async () => {
        if (!newAnswer.trim()) {
            setInfoMessage('답변 내용을 입력해주세요.');
            setShowInfoModal(true);
            return;
        }
        try {
            await axios.post(`/api/qna/answers?userId=${sessionUserId}`, {
                content: newAnswer,
                questionId: id
            }, { withCredentials: true });
            setNewAnswer('');
            fetchAnswers();
        } catch (error) {
            console.error("Error submitting answer:", error);
            setInfoMessage('답변 등록에 실패했습니다.');
            setShowInfoModal(true);
        }
    };

    const startEditAnswer = (answerId: number, content: string) => {
        setEditingAnswerId(answerId);
        setEditingAnswerContent(content);
    };

    const confirmEditAnswer = async (answerId: number) => {
        if (!editingAnswerContent.trim()) {
            setInfoMessage('수정할 답변 내용을 입력해주세요.');
            setShowInfoModal(true);
            return;
        }
        try {
            await axios.patch(`/api/qna/answers/${answerId}?userId=${sessionUserId}`, {
                content: editingAnswerContent
            }, { withCredentials: true });
            setEditingAnswerId(null);
            setEditingAnswerContent('');
            fetchAnswers();
        } catch (error) {
            console.error("Error editing answer:", error);
            setInfoMessage('답변 수정에 실패했습니다.');
            setShowInfoModal(true);
        }
    };

    const deleteAnswer = async (answerId: number) => {
        if (!window.confirm("답변을 삭제할까요?")) return;
        try {
            await axios.delete(`/api/qna/answers/${answerId}?userId=${sessionUserId}`, { withCredentials: true });
            fetchAnswers();
        } catch (error) {
            console.error("Error deleting answer:", error);
            setInfoMessage('답변 삭제에 실패했습니다.');
            setShowInfoModal(true);
        }
    };

    const handleUserClick = async (targetUserId: string) => {
        try {
            // console.log("QnaDetailPage: handleUserClick called for targetUserId:", targetUserId);
            const res = await axios.get(`/api/users/${targetUserId}`, { withCredentials: true });
            const userDataFromApi = res.data.result.data;

            // console.log("QnaDetailPage: Fetched user base info (from /api/users/{userId}):", userDataFromApi);

            const userForModalObj: UserForModal = {
                id: String(userDataFromApi.userId || userDataFromApi.id),
                username: userDataFromApi.username,
                profileImageUrl: userDataFromApi.profileImageUrl || '/default-profile.png',
                email: userDataFromApi.email || 'N/A',
            };

            // console.log("QnaDetailPage: Prepared userForModalObj:", userForModalObj);
            // console.log("QnaDetailPage: Type of userForModalObj.id:", typeof userForModalObj.id, "Value:", userForModalObj.id);

            setUserInfo(userForModalObj);
            setUserModalOpen(true);
        } catch (error) {
            console.error("QnaDetailPage: Error fetching user base info for modal:", error);
            setInfoMessage('유저 정보를 불러오는데 실패했습니다.');
            setShowInfoModal(true);
        }
    };

    if (!qna) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>로딩 중...</div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)} style={{ fontSize: '1.4rem' }}>←</button>
                    {isLoggedIn && sessionUserId === String(qna.userId) && (
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
                                    {!editingQuestion ? (
                                        <>
                                            <button className={styles.deleteBtn} onClick={handleEdit}>수정하기</button>
                                            <button className={styles.deleteBtn} onClick={handleDelete}>삭제하기</button>
                                        </>
                                    ) : (
                                        <button className={styles.deleteBtn} onClick={handleSaveQuestionEdit}>저장하기</button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.leftColumn}>
                    <div className={styles["title-row"]}>
                        {qna.wargameId && qna.wargameTitle && (
                            <Link to={`/wargame/${qna.wargameId}`} style={{ fontWeight: 600, color: "#FFA94D", marginRight: '8px' }}>
                                [{qna.wargameTitle}]
                            </Link>
                        )}
                        <div className={styles["header-card"]}>
                            <div className={styles["title-row"]}>
                                {editingQuestion ? (
                                    <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className={styles.titleInput} />
                                ) : (
                                    <h1 className={styles.title}>{qna.title}</h1>
                                )}
                            </div>
                            <div className={styles.meta}>
                                <div className={styles.usernameWrapper} onClick={() => handleUserClick(String(qna.userId))}>
                                    <div className={styles.commentProfileImageWrapper}>
                                        <img
                                            src={qna.profileImageUrl || '/default-profile.png'}
                                            alt={`${qna.username}'s profile`}
                                            className={styles.commentProfileImage}
                                        />
                                    </div>
                                    <span className={styles.usernameLink}>
                                        {qna.username}
                                    </span>
                                </div>
                                <span>{new Date(qna.createdAt).toLocaleDateString()}</span>
                                <span>조회 {qna.viewCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.plainContent}>
                        {editingQuestion ? (
                            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className={styles.editContentArea} rows={10} />
                        ) : (
                            qna.content
                        )}
                    </div>

                    <div className={styles.commentSection}>
                        <h2 className={styles.commentTitle}>답변 {answers.length}</h2>
                        {isLoggedIn && (
                            <div className={styles.commentForm}>
                                <textarea className={styles.commentTextarea} value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="답변을 입력하세요" />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className={styles.submitBtn} onClick={handleAnswerSubmit}>등록</button>
                                </div>
                            </div>
                        )}
                        <ul className={styles.commentList}>
                            {answers.map(answer => (
                                <li key={answer.id} className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <div className={styles.commentProfileImageWrapper} onClick={() => handleUserClick(String(answer.userId))}>
                                            <img
                                                src={answer.profileImageUrl || '/default-profile.png'}
                                                alt={`${answer.username}'s profile`}
                                                className={styles.commentProfileImage}
                                            />
                                        </div>
                                        <div>
                                            <div className={styles.usernameRow} onClick={() => handleUserClick(String(answer.userId))}>
                                                <span className={styles.usernameLink}>
                                                    {answer.username}
                                                </span>
                                            </div>
                                            <small className={styles.createdAt}>{new Date(answer.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                    {editingAnswerId === answer.id ? (
                                        <>
                                            <textarea className={styles.commentTextarea} value={editingAnswerContent} onChange={(e) => setEditingAnswerContent(e.target.value)} />
                                            <div className={styles.reviewActionBtns}>
                                                <button onClick={() => confirmEditAnswer(answer.id)}>저장</button>
                                                <button onClick={() => setEditingAnswerId(null)}>취소</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className={styles.commentContent}>{answer.content}</p>
                                            {isLoggedIn && String(answer.userId) === sessionUserId && (
                                                <div className={styles.reviewActionBtns}>
                                                    <button onClick={() => startEditAnswer(answer.id, answer.content)}>수정</button>
                                                    <button onClick={() => deleteAnswer(answer.id)}>삭제</button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <UserInfoModal
                isOpen={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                userInfo={userInfo}
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
        </div>
    );
};

export default QnaDetailPage;