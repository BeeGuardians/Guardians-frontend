import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './components/QnaDetailPage.module.css';
import Modal from "./components/Modal.tsx";

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

    // 답변 수정 상태
    const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
    const [editingAnswerContent, setEditingAnswerContent] = useState('');

    // 질문 수정 상태
    const [editingQuestion, setEditingQuestion] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchQna();
        fetchAnswers();
        checkLoginStatus();
    }, [id]);

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

    const handleDelete = () => {
        setConfirmDeletePost(true);
    };

    const confirmDeletePostAction = async () => {
        axios.delete(`/api/qna/questions/${id}?userId=${sessionUserId}`, { withCredentials: true });
        setInfoMessage('질문이 삭제되었습니다.');
        setShowInfoModal(true);
    };

    const handleEdit = () => {
        // 질문 수정 모드 활성화
        setEditingQuestion(true);
        // navigate(`/community/qna/edit`);  // navigate 유지하고 싶다면 이 부분은 살리기
    };

    const handleSaveQuestionEdit = async () => {
        await axios.patch(`/api/qna/questions/${id}?userId=${sessionUserId}`, {
            title: editedTitle,
            content: editedContent
        }, { withCredentials: true });
        setEditingQuestion(false);  // 수정 모드 종료
        fetchQna();  // 질문 다시 불러오기
    };

    const handleInfoModalClose = () => {
        setShowInfoModal(false);
        if (infoMessage === '질문이 삭제되었습니다.') {
            navigate('/community/qna');
        }
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
        await axios.patch(`/api/qna/answers/${answerId}?userId=${Number(sessionUserId)}`, {
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
    useEffect(() => {
        console.log('로그인한 사용자 ID:', sessionUserId);
        console.log('게시글 작성자 ID:', qna?.userId);
    }, [sessionUserId, qna]);


    if (!qna) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>로딩 중...</div>;

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
                    {isLoggedIn && qna && sessionUserId && String(sessionUserId) === String(qna.userId) && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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

                <div className={styles.leftColumn}>
                    <div className={styles["title-row"]}>
                        <Link
                            to={`/wargame/${qna.wargameId}`}
                            style={{
                                display: "inline-block",
                                marginBottom: "0.75rem",
                                fontWeight: 600,
                                fontSize: "1.05rem",
                                color: "#FFA94D",
                                textDecoration: "none"
                            }}
                        >
                            [{qna.wargameTitle}]
                        </Link>
                        <div className={styles["header-card"]}>
                            <div className={styles["title-row"]}>
                                {editingQuestion ? (
                                    <input
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className={styles.titleInput}
                                    />
                                ) : (
                                    <h1 className={styles.title}>{qna.title}</h1>
                                )}
                            </div>
                            <div className={styles.meta}>
                                <span>✍ 작성자: {qna.username}</span>
                                <span>🕒 작성일: {new Date(qna.createdAt).toLocaleDateString()}</span>
                                <span>👀 조회 {qna.viewCount}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.plainContent}>
                        {editingQuestion ? (
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className={styles.editContentArea}
                                rows={10}
                            />
                        ) : (
                            qna.content
                        )}
                    </div>

                    {/* 답변 영역 */}
                    <div className={styles.commentSection}>
                        <h2 className={styles.commentTitle}>답변 {answers.length}</h2>

                        {isLoggedIn && (
                            <div className={styles.commentForm}>
                                <textarea
                                    className={styles.commentTextarea}
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                    placeholder="답변을 입력하세요"
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className={styles.submitBtn} onClick={handleAnswerSubmit}>등록</button>
                                </div>
                            </div>
                        )}

                        <ul className={styles.commentList}>
                            {answers.map(answer => (
                                <li key={answer.id} className={styles.commentItem}>
                                    <div className={styles.commentHeader} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {/* 프로필 이미지 */}
                                        <img
                                            src={answer.profileImageUrl || '/default-profile.png'}
                                            alt="프로필"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }}
                                        />
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span className={styles.username}>{answer.username}</span>
                                                {/* 티어 뱃지 */}
                                                {answer.tier && (
                                                    <img
                                                        src={`/badges/${answer.tier}.png`}  // 티어 이미지 경로
                                                        alt={`${answer.tier} 티어`}
                                                        style={{ width: '20px', height: '20px' }}
                                                    />
                                                )}
                                            </div>
                                        <small className={styles.createdAt}>{new Date(answer.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>

                                    {editingAnswerId === answer.id ? (
                                        <>
                                            <textarea
                                                className={styles.commentTextarea}
                                                value={editingAnswerContent}
                                                onChange={(e) => setEditingAnswerContent(e.target.value)}
                                            />
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
