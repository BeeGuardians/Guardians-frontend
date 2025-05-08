import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./WargameDetailPage.module.css";
import QACard from "./QACard";

axios.defaults.withCredentials = true;

type Wargame = {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    likeCount: number;
    category: number;
    difficulty: string;
    createdAt: string;
    updatedAt: string;
    solved: boolean;
    bookmarked: boolean;
    liked: boolean;
};

type QuestionWithAnswers = {
    id: number;
    title: string;
    content: string;
    username: string;
    userId: number;
    createdAt: string;
    answers: {
        id: number;
        content: string;
        username: string;
        createdAt: string;
    }[];
};

function WargameDetailPage() {
    const { id } = useParams();
    const [wargame, setWargame] = useState<Wargame | null>(null);
    const [flag, setFlag] = useState("");
    const [qaList, setQaList] = useState<QuestionWithAnswers[]>([]);
    //const [sessionUserId, setSessionUserId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalResult, setModalResult] = useState<null | { correct: boolean; message: string }>(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const categoryMap: Record<number, string> = {
        1: "웹",
        2: "리버싱",
        3: "포렌식",
        4: "암호",
        5: "시스템",
    };

    const fetchWargame = () => {
        axios.get(`${API_BASE}/api/wargames/${id}`)
            .then((res) => setWargame(res.data.result.data))
            .catch((err) => console.error("워게임 상세 불러오기 실패", err));
    };

    // const fetchSessionUser = async () => {
    //     try {
    //         const res = await axios.get(`${API_BASE}/api/users/me`);
    //         setSessionUserId(res.data.result.data.id);
    //     } catch {
    //         setSessionUserId(null);
    //     }
    // };

    const fetchQnA = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/qna/wargames/${id}/questions`);
            const questionList: QuestionWithAnswers[] = res.data.result.data;

            const fullList: QuestionWithAnswers[] = await Promise.all(
                questionList.map(async (q) => {
                    const answerRes = await axios.get(`${API_BASE}/api/qna/answers/${q.id}`);
                    return {
                        ...q,
                        answers: answerRes.data.result.data,
                    };
                })
            );

            setQaList(fullList);
        } catch (e) {
            console.error("QnA 불러오기 실패", e);
        }
    };

    useEffect(() => {
        fetchWargame();
        // fetchSessionUser();
        fetchQnA();
    }, [id]);

    const submitFlag = () => {
        axios.post(`${API_BASE}/api/wargames/${id}/submit`, { flag })
            .then((res) => {
                const result = res.data.result.data;
                setModalResult(result);
                setIsModalOpen(true);
                fetchWargame();
            })
            .catch((err) => {
                const errorMessage = err?.response?.data?.message || "서버 오류! 나중에 다시 시도해주세요.";
                setModalResult({ correct: false, message: errorMessage });
                setIsModalOpen(true);
            });
    };

    const toggleBookmark = () => {
        axios.post(`${API_BASE}/api/wargames/${id}/bookmark`).then(fetchWargame);
    };

    const toggleLike = () => {
        axios.post(`${API_BASE}/api/wargames/${id}/like`).then(fetchWargame);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (modalResult?.message === "로그인이 되지 않았습니다. 로그인을 해주세요.") {
            window.location.href = "/login";
        } else {
            window.location.reload();
        }
    };

    if (!wargame) return <p style={{ padding: "3rem" }}>로딩 중...</p>;

    return (
        <div className={styles.container}>
            <div className={styles["header-card"]}>
                <div className={styles["title-row"]}>
                    <h1 className={styles.title}>
                        [{wargame.title}]
                        {wargame.solved && <span className={styles.badge}>✔ 해결됨</span>}
                    </h1>
                    <div className={styles["action-box"]}>
                        <button onClick={toggleBookmark} className={`${styles["action-btn"]} ${wargame.bookmarked ? styles.active : ""}`}>
                            {wargame.bookmarked ? "⭐" : "☆"} 북마크
                        </button>
                        <button onClick={toggleLike} className={`${styles["action-btn"]} ${wargame.liked ? styles.active : ""}`}>
                            {wargame.liked ? "❤️" : "🤍"} {wargame.likeCount}
                        </button>
                    </div>
                </div>

                <div className={styles["badge-meta-wrapper"]}>
                    <div className={styles["badge-row"]}>
                        <span className={styles["info-badge"]}>📁 {categoryMap[wargame.category]}</span>
                        <span className={styles["info-badge"]}>🔥 {wargame.difficulty}</span>
                    </div>
                    <div className={styles.meta}>
                        <span>🕒 {wargame.createdAt.split("T")[0]}</span>
                    </div>
                </div>
            </div>

            <div className={styles["download-box"]}>
                <a href={wargame.fileUrl} target="_blank" rel="noreferrer" className={styles["file-link"]}>
                    📦 문제 파일 다운로드
                </a>
            </div>

            <h2 className={styles["desc-title"]}>문제 설명</h2>
            <div className={styles.desc}>{wargame.description}</div>

            <div className={styles["submit-box"]}>
                <input
                    type="text"
                    placeholder="플래그를 입력하세요"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    className={styles.input}
                />
                <button onClick={submitFlag} className={styles["submit-btn"]}>
                    플래그 제출
                </button>
            </div>

            {isModalOpen && modalResult && (
                <div className={styles["modal-overlay"]} onClick={handleCloseModal}>
                    <div
                        className={`${styles["modal-box"]} ${modalResult.correct ? styles["correct"] : styles["wrong"]}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalResult.message !== "로그인이 되지 않았습니다. 로그인을 해주세요." && (
                            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                                {modalResult.correct ? "정답입니다!" : "틀렸습니다!"}
                            </p>
                        )}
                        <p style={{ marginTop: "0.5rem", color: "#555" }}>{modalResult.message}</p>
                        <button onClick={handleCloseModal} className={styles["submit-btn"]}>닫기</button>
                    </div>
                </div>
            )}

            <div className={styles["qa-section"]}>
                <h2 className={styles["qa-title"]}>Q&A</h2>
                {qaList.length === 0 ? (
                    <p style={{ padding: "1rem", color: "#888" }}>아직 등록된 질문이 없습니다.</p>
                ) : (
                    qaList.map((q) => (
                        <QACard
                            key={q.id}
                            question={{
                                id: q.id,
                                wargameTitle: String(wargame?.id || "알 수 없음"),
                                title: q.title,
                                content: q.content,
                                username: q.username,
                                createdAt: q.createdAt,
                                answerCount: q.answers.length,
                                likeCount: 0,
                                viewCount: 0,
                            }}
                            isAnswered={q.answers.length > 0}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default WargameDetailPage;
