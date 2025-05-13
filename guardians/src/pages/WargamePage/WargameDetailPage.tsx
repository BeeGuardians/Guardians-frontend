import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./WargameDetailPage.module.css";
import QACard from "./QACard";
import WargameUserStatusCard from "./WargameUserStatusCard";

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

type UserStatus = {
    username: string;
    startedAt: string;
    isFirstSolver?: boolean;
};

function WargameDetailPage() {
    const {id} = useParams();
    const [wargame, setWargame] = useState<Wargame | null>(null);
    const [flag, setFlag] = useState("");
    const [qaList, setQaList] = useState<QuestionWithAnswers[]>([]);
    const [podUrl, setPodUrl] = useState<string | null>(null);
    const [isPodRunning, setIsPodRunning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalResult, setModalResult] = useState<null | { correct: boolean; message: string }>(null);
    const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
    const firstSolver: UserStatus | undefined = userStatuses.find((u) => u.isFirstSolver);
    const currentUsers: UserStatus[] = userStatuses.filter((u) => !u.isFirstSolver);


    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const categoryMap: Record<number, string> = {
        1: "웹",
        2: "리버싱",
        3: "포렌식",
        4: "암호",
        5: "시스템",
    };

    useEffect(() => {
        fetchWargame();
        fetchQnA();
        fetchUserStatus();
    }, [id]);

    const fetchWargame = () => {
        axios.get(`${API_BASE}/api/wargames/${id}`)
            .then((res) => setWargame(res.data.result.data))
            .catch((err) => console.error("워게임 상세 불러오기 실패", err));
    };

    const fetchQnA = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/qna/wargames/${id}/questions`);
            const questionList: QuestionWithAnswers[] = res.data.result.data;

            const fullList = await Promise.all(
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

    const fetchUserStatus = () => {
        // 더미 데이터로 대체
        const dummyUsers: UserStatus[] = [
            {
                username: "flagHunter",
                startedAt: "2025-05-13T08:40:00",
                isFirstSolver: true
            },
            {
                username: "debugMaster",
                startedAt: "2025-05-13T08:45:00"
            },
            {
                username: "zeroCool",
                startedAt: "2025-05-13T08:47:00"
            }
        ];
        setUserStatuses(dummyUsers);
    };

    // const fetchUserStatus = () => {
    //     axios.get(`${API_BASE}/api/wargames/${id}/status`).then(res => {
    //         setUserStatuses(res.data.result.data);
    //     }).catch(err => console.error("유저 상태 불러오기 실패", err));
    // }

    const startWargamePod = async () => {
        try {
            const res = await axios.post(`${API_BASE}/api/wargames/${id}/start`);
            const {url} = res.data.result.data;
            setPodUrl(url);
            setIsPodRunning(true);
        } catch {
            alert("파드 생성 실패!");
        }
    };

    const stopWargamePod = async () => {
        try {
            await axios.delete(`${API_BASE}/api/wargames/${id}/stop`);
            setPodUrl(null);
            setIsPodRunning(false);
        } catch {
            alert("파드 삭제 실패!");
        }
    };

    const submitFlag = () => {
        axios.post(`${API_BASE}/api/wargames/${id}/submit`, {flag})
            .then((res) => {
                setModalResult(res.data.result.data);
                setIsModalOpen(true);
                fetchWargame();
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || "서버 오류! 나중에 다시 시도해주세요.";
                setModalResult({correct: false, message: msg});
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

    if (!wargame) return <p style={{padding: "3rem"}}>로딩 중...</p>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.leftColumn}>
                    {/* 기본 정보 카드 */}
                    <div className={styles["header-card"]}>
                        <div className={styles["title-row"]}>
                            <div>
                                <p className={styles["wargame-id"]}>워게임 {wargame.id}</p>
                                <h1 className={styles.title}>
                                    [{wargame.title}]
                                    {wargame.solved && <span className={styles.badge}>✔ 해결</span>}
                                </h1>
                            </div>
                            <div className={styles["action-box"]}>
                                <button onClick={toggleBookmark}
                                        className={`${styles["action-btn"]} ${wargame.bookmarked ? styles.active : ""}`}>
                                    {wargame.bookmarked ? "⭐" : "☆"} 북마크
                                </button>
                                <button onClick={toggleLike}
                                        className={`${styles["action-btn"]} ${wargame.liked ? styles.active : ""}`}>
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

                    {/* 문제 다운로드 */}
                    <div className={styles["download-box"]}>
                        <a href={wargame.fileUrl} target="_blank" rel="noreferrer" className={styles["file-link"]}>
                            📦 문제 파일 다운로드
                        </a>
                    </div>

                    {/* 문제 설명 */}
                    <h2 className={styles["desc-title"]}>문제 설명</h2>
                    <div className={styles.desc}>{wargame.description}</div>

                    {/* 워게임 인스턴스 제어 카드 */}
                    <h2 className={styles["pod-title"]}>워게임 인스턴스</h2>
                    <div className={styles["pod-card"]}>
                        <div className={styles["submit-box"]}>
                            {isPodRunning ? (
                                <button onClick={stopWargamePod} className={styles["submit-btn"]}>워게임 종료</button>
                            ) : (
                                <button onClick={startWargamePod} className={styles["submit-btn"]}>워게임 시작</button>
                            )}
                        </div>
                        {podUrl && (
                            <p className={styles["pod-url"]}>
                                접속 URL: <a href={podUrl} target="_blank" rel="noreferrer">{podUrl}</a>
                            </p>
                        )}
                    </div>

                    {/* 플래그 제출 */}
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

                    {/* 정답 모달 */}
                    {isModalOpen && modalResult && (
                        <div className={styles["modal-overlay"]} onClick={handleCloseModal}>
                            <div
                                className={`${styles["modal-box"]} ${modalResult.correct ? styles["correct"] : styles["wrong"]}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {modalResult.message !== "로그인이 되지 않았습니다. 로그인을 해주세요." && (
                                    <p style={{fontSize: "1.1rem", fontWeight: 600}}>
                                        {modalResult.correct ? "정답입니다!" : "틀렸습니다!"}
                                    </p>
                                )}
                                <p style={{marginTop: "0.5rem", color: "#555"}}>{modalResult.message}</p>
                                <button onClick={handleCloseModal} className={styles["submit-btn"]}>닫기</button>
                            </div>
                        </div>
                    )}

                    {/* Q&A */}
                    <div className={styles["qa-section"]}>
                        <h2 className={styles["qa-title"]}>Q&A</h2>
                        {qaList.length === 0 ? (
                            <p style={{padding: "1rem", color: "#888"}}>아직 등록된 질문이 없습니다.</p>
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
                <div className={styles.rightColumn}>
                    {firstSolver && (
                        <div className={styles.firstSolverCard}>
                            <div>
                                <div>🎉 First Blood!</div>
                                <strong>{firstSolver.username}님</strong>
                            </div>
                        </div>
                    )}
                    <WargameUserStatusCard users={currentUsers} />
                </div>
            </div>
        </div>
    );
}
export default WargameDetailPage;
