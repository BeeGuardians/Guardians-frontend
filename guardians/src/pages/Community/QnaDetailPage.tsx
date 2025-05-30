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
    profileImageUrl: string;  // 프로필 이미지 URL 추가
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
    const [userInfo, setUserInfo] = useState<null | never>(null); // 유저 정보
    const [userModalOpen, setUserModalOpen] = useState(false); // 모달 열기 상태

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
        const res = await axios.get(`/api/qna/questions/${id}`, { withCredentials: true });
        const data = res.data.result.data;
        setQna(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
    };

    const fetchAnswers = async () => {
        const res = await axios.get(`/api/qna/answers/${id}`, { withCredentials: true });
        setAnswers(res.data.result.data);
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

    const handleDelete = () => setConfirmDeletePost(true);

    const confirmDeletePostAction = async () => {
        await axios.delete(`/api/qna/questions/${id}?userId=${sessionUserId}`, { withCredentials: true });
        setInfoMessage('질문이 삭제되었습니다.');
        setShowInfoModal(true);
    };

    const handleEdit = () => {
        if (!qna) return;
        navigate(`/community/qna/edit/${qna.id}`);
    };

    const handleSaveQuestionEdit = async () => {
        await axios.patch(`/api/qna/questions/${id}?userId=${sessionUserId}`, {
            title: editedTitle,
            content: editedContent
        }, { withCredentials: true });
        setEditingQuestion(false);
        fetchQna();
    };

    const handleInfoModalClose = () => {
        setShowInfoModal(false);
        if (infoMessage === '질문이 삭제되었습니다.') navigate('/community/qna');
    };

    const handleAnswerSubmit = async () => {
        if (!newAnswer.trim()) return;
        await axios.post(`/api/qna/answers?userId=${sessionUserId}`, {
            content: newAnswer,
            questionId: id
        }, { withCredentials: true });
        setNewAnswer('');
        fetchAnswers();
    };

    const startEditAnswer = (id: number, content: string) => {
        setEditingAnswerId(id);
        setEditingAnswerContent(content);
    };

    const confirmEditAnswer = async (answerId: number) => {
        if (!editingAnswerContent.trim()) return;
        await axios.patch(`/api/qna/answers/${answerId}?userId=${sessionUserId}`, {
            content: editingAnswerContent
        }, { withCredentials: true });
        setEditingAnswerId(null);
        setEditingAnswerContent('');
        fetchAnswers();
    };

    const deleteAnswer = async (answerId: number) => {
        if (!window.confirm("답변을 삭제할까요?")) return;
        await axios.delete(`/api/qna/answers/${answerId}?userId=${sessionUserId}`, { withCredentials: true });
        fetchAnswers();
    };

    const handleUserClick = async (userId: string) => {
        const res = await axios.get(`/api/users/${userId}`, { withCredentials: true });
        setUserInfo(res.data.result.data);
        setUserModalOpen(true); // 유저 정보 모달 열기
    };

    if (!qna) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>로딩 중...</div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <button className={styles.backBtn}
                            onClick={() => navigate(-1)} style={{ fontSize: '1.4rem' }}>←</button>
                    {isLoggedIn && sessionUserId === qna.userId.toString() && (
                        <div className={styles.actionsWrapper} ref={actionsRef}>
                            <button
                                className={styles.actionMenuBtn}
                                ref={actionMenuBtnRef}
                                onClick={() => setShowActions(prev => !prev)}  // 버튼 클릭 시 토글
                            >
                                &#x22EE; {/* 세로 점 3개 */}
                            </button>

                            {/* 수정/삭제 버튼 토글 */}
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
                        <Link to={`/wargame/${qna.wargameId}`} style={{ fontWeight: 600, color: "#FFA94D" }}>
                            [{qna.wargameTitle}]
                        </Link>
                        <div className={styles["header-card"]}>
                            <div className={styles["title-row"]}>
                                {editingQuestion ? (
                                    <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className={styles.titleInput} />
                                ) : (
                                    <h1 className={styles.title}>{qna.title}</h1>
                                )}
                            </div>

                            <div className={styles.meta}>
                                <div className={styles.usernameWrapper}>
                                    <div className={styles.commentProfileImageWrapper} onClick={() => handleUserClick(qna.userId)}>
                                        <img
                                            src={qna.profileImageUrl || '/default-profile.png'}
                                            alt={`${qna.username}'s profile`}
                                            className={styles.commentProfileImage}
                                        />
                                    </div>
                                    <span
                                        className={styles.usernameLink}
                                        onClick={() => handleUserClick(qna.userId)} // 글쓴이 이름 클릭 시 유저 정보 모달 열기
                                    >
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
                                        <div className={styles.commentProfileImageWrapper} onClick={() => handleUserClick(answer.userId)}>
                                            <img
                                                src={answer.profileImageUrl || '/default-profile.png'}
                                                alt={`${answer.username}'s profile`}
                                                className={styles.commentProfileImage}
                                            />
                                        </div>
                                        <div>
                                            <div className={styles.usernameRow}>
                                                <span
                                                    className={styles.usernameLink}
                                                    onClick={() => handleUserClick(answer.userId)} // 댓글 작성자 이름 클릭 시 유저 정보 모달 열기
                                                >
                                                    {answer.username}
                                                </span>
                                                {answer.tier && (
                                                    <img src={`/badges/${answer.tier}.png`} alt={`${answer.tier} 티어`} className={styles.tierIcon} />
                                                )}
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
                                            {isLoggedIn && answer.userId.toString() === sessionUserId && (
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

            {/* 유저 정보 모달 */}
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
