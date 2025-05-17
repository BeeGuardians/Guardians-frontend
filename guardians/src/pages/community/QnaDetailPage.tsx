import {Link, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './components/QnaDetailPage.module.css'

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
}

const QnaDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [qna, setQna] = useState<Qna | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [newAnswer, setNewAnswer] = useState('');
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 답변 수정 상태
    const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
    const [editingAnswerContent, setEditingAnswerContent] = useState('');

    // 질문 수정 상태
    const [editingQuestion, setEditingQuestion] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchQna();
        fetchAnswers();
        checkLogin();
    }, [id]);

    const fetchQna = async () => {
        const res = await axios.get(`/api/qna/questions/${id}`, {withCredentials: true});
        const data = res.data.result.data;
        setQna(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
    };

    const fetchAnswers = async () => {
        const res = await axios.get(`/api/qna/answers/${id}`, {withCredentials: true});
        setAnswers(res.data.result.data);
    };

    const checkLogin = async () => {
        try {
            const res = await axios.get("/api/users/me", {withCredentials: true});
            setSessionUserId(String(res.data.result.data.id));
            setIsLoggedIn(true);
        } catch {
            setIsLoggedIn(false);
        }
    };

    const handleDeleteQuestion = async () => {
        if (!window.confirm('질문을 삭제할까요?')) return;
        await axios.delete(`/api/qna/questions/${id}?userId=${sessionUserId}`, {withCredentials: true});
        alert('삭제 완료!');
        navigate('/community/qna');
    };

    const handleUpdateQuestion = async () => {
        await axios.patch(`/api/qna/questions/${id}?userId=${sessionUserId}`, {
            title: editedTitle,
            content: editedContent
        }, {withCredentials: true});
        setEditingQuestion(false);
        fetchQna();
    };

    const handleAnswerSubmit = async () => {
        if (!newAnswer.trim()) return;
        await axios.post(`/api/qna/answers?userId=${sessionUserId}`, {
            content: newAnswer,
            questionId: id
        }, {withCredentials: true});
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
        }, {withCredentials: true});
        setEditingAnswerId(null);
        setEditingAnswerContent('');
        fetchAnswers();
    };

    const deleteAnswer = async (answerId: number) => {
        if (!window.confirm("답변을 삭제할까요?")) return;
        await axios.delete(`/api/qna/answers/${answerId}?userId=${sessionUserId}`, {withCredentials: true});
        fetchAnswers();
    };

    if (!qna) return <div style={{textAlign: 'center', marginTop: '2rem'}}>로딩 중...</div>;

    const isAuthor = sessionUserId === String(qna.userId);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>← 뒤로가기</button>
                    {isLoggedIn && isAuthor && (
                        <>
                            {editingQuestion ? (
                                <button className={styles.deleteBtn} onClick={handleUpdateQuestion}>저장</button>
                            ) : (
                                <>
                                    <button className={styles.deleteBtn} onClick={() => setEditingQuestion(true)}>수정하기
                                    </button>
                                    <button className={styles.deleteBtn} onClick={handleDeleteQuestion}>삭제하기</button>
                                </>
                            )}
                        </>
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
                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                                    <button className={styles.submitBtn} onClick={handleAnswerSubmit}>등록</button>
                                </div>
                            </div>
                        )}

                        <ul className={styles.commentList}>
                            {answers.map(answer => (
                                <li key={answer.id} className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <div className={styles.username}>{answer.username}</div>
                                        <small className={styles.createdAt}>
                                            {new Date(answer.createdAt).toLocaleDateString()}
                                        </small>
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
                                                    <button
                                                        onClick={() => startEditAnswer(answer.id, answer.content)}>수정
                                                    </button>
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
        </div>
    );
};

export default QnaDetailPage;
