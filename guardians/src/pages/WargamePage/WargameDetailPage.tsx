import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
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

type Review = {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    userName: string;
};

function WargameDetailPage() {
    const {id} = useParams();
    const [wargame, setWargame] = useState<Wargame | null>(null);
    const [flag, setFlag] = useState("");
    const [qaList, setQaList] = useState<QuestionWithAnswers[]>([]);
    const [reviewList, setReviewList] = useState<Review[]>([]);
    const [podUrl, setPodUrl] = useState<string | null>(null);
    const [isPodRunning, setIsPodRunning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalResult, setModalResult] = useState<null | { correct: boolean; message: string }>(null);
    const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [newReview, setNewReview] = useState("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState<string>("");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmEditDone, setConfirmEditDone] = useState(false);


    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/users/me`);
            if (res.data.result.data) {
                setIsLoggedIn(true);
                setCurrentUserId(res.data.result.data.id);
            }
        } catch {
            setIsLoggedIn(false); // 에러 나면 로그인 안 된 걸로 간주
        }
    };

    const handleCreateReview = async () => {
        if (!newReview.trim()) return;

        try {
            await axios.post(`${API_BASE}/api/wargames/${id}/reviews`, {
                content: newReview
            });
            setNewReview("");
            fetchReviews();
        } catch {
            alert("리뷰 등록 실패!");
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        try {
            await axios.delete(`${API_BASE}/api/wargames/reviews/${reviewId}`);
            await fetchReviews();
        } catch {
            console.error("리뷰 삭제 실패");
        }
    };

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
        fetchReviews();
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

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/wargames/${id}/reviews`);
            setReviewList(res.data.result.data);
        } catch (e) {
            console.error("리뷰 불러오기 실패", e);
        }
    };

    const startEdit = (id: number, content: string) => {
        setEditingReviewId(id);
        setEditingContent(content);
    };

    const cancelEdit = () => {
        setEditingReviewId(null);
        setEditingContent("");
    };

    const handleConfirmEdit = async (reviewId: number) => {
        if (!editingContent.trim()) return;
        try {
            await axios.patch(`${API_BASE}/api/wargames/reviews/${reviewId}`, {
                content: editingContent
            });
            setEditingReviewId(null);
            setEditingContent("");
            fetchReviews();
            setConfirmEditDone(true); // 👈 요거
        } catch {
            alert("리뷰 수정 실패");
        }
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
                                <button
                                    onClick={toggleBookmark}
                                    className={`${styles["action-btn"]} ${wargame.bookmarked ? styles.active : ""}`}
                                >
                                    <img
                                        src={`/src/assets/${wargame.bookmarked ? "star.png" : "star_bin.png"}`}
                                        style={{
                                            width: "1.1em",
                                            height: "1.1em",
                                            verticalAlign: "text-bottom",
                                            marginRight: "0.3em",
                                        }}
                                    />
                                    북마크
                                </button>

                                <button
                                    onClick={toggleLike}
                                    className={`${styles["action-btn"]} ${wargame.liked ? styles.active : ""}`}
                                >
                                    <img
                                        src={`/src/assets/${wargame.liked ? "heart.png" : "heart_bin.png"}`}
                                        style={{
                                            width: "1.1em",
                                            height: "1.1em",
                                            verticalAlign: "text-bottom",
                                            marginRight: "0.3em",
                                        }}
                                    />
                                    {wargame.likeCount}
                                </button>
                            </div>
                        </div>
                        <div className={styles["badge-meta-wrapper"]}>
                            <div className={styles["badge-row"]}>
  <span className={styles["info-badge"]}>
    <img
        src="/src/assets/folder.png"
        style={{
            width: "1.05em",
            height: "1.05em",
            verticalAlign: "text-bottom",
            marginRight: "0.3em",
        }}
    />
      {categoryMap[wargame.category]}
  </span>
                                <span className={styles["info-badge"]}>
    <img
        src="/src/assets/fire.png"
        style={{
            width: "1.05em",
            height: "1.05em",
            verticalAlign: "text-bottom",
            marginRight: "0.3em",
        }}
    />
                                    {wargame.difficulty}
  </span>
                            </div>

                            <div className={styles.meta}>
                                <span>
  <img
      src="/src/assets/clock.png"
      style={{
          width: "1.05em",
          height: "1.05em",
          verticalAlign: "text-bottom",
          marginRight: "0.3em",
      }}
  />
                                    {wargame.createdAt.split("T")[0]}
</span>
                            </div>
                        </div>
                    </div>

                    {/* 문제 다운로드 */}
                    <div className={styles["download-box"]}>
                        <a href={wargame.fileUrl} target="_blank" rel="noreferrer" className={styles["file-link"]}>
                            <img
                                src="/src/assets/box.png"
                                style={{
                                    width: "1.05em",
                                    height: "1.05em",
                                    verticalAlign: "text-bottom",
                                    marginRight: "0.3em",
                                }}
                            />
                            문제 파일 다운로드
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
                                        {modalResult.correct ? "정답!" : "오답!"}
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
                        {isLoggedIn && (
                            <button
                                className={styles["submit-btn"]}
                                style={{marginBottom: '1rem', marginLeft: 'auto', display: 'block'}}
                            >
                                질문하기
                            </button>
                        )}
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
                    <div className={styles.reviewSection}>
                        <h2 className={styles["review-title"]}>리뷰</h2>
                        {isLoggedIn && (
                            <div className={styles.reviewForm}>
                                <textarea
                                    className={styles.reviewTextarea}
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    placeholder="리뷰를 작성해보세요!"
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button
                                        className={styles["submit-btn"]}
                                        style={{ width: "80px" }}
                                        onClick={() => setIsReviewModalOpen(true)}
                                    >
                                        등록
                                    </button>
                                </div>
                            </div>
                        )}

                        {reviewList.length === 0 ? (
                            <p style={{padding: "1rem", color: "#888"}}>아직 리뷰가 없습니다.</p>
                        ) : (
                            <ul className={styles.reviewList}>
                                {reviewList.map((r) => (
                                    <li key={r.id} className={styles.reviewItem}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{fontWeight: 600}}>{r.userName}</div>
                                            <small style={{color: '#666'}}>작성일: {r.createdAt.split("T")[0]}</small>
                                        </div>

                                        {editingReviewId === r.id ? (
                                            <>
                                                    <textarea
                                                        className={styles.reviewTextarea}
                                                        value={editingContent}
                                                        onChange={(e) => setEditingContent(e.target.value)}
                                                    />
                                                <div className={styles.reviewActionBtns}>
                                                    <button onClick={() => handleConfirmEdit(r.id)}>저장</button>
                                                    <button onClick={() => cancelEdit()}>취소</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p style={{margin: '0.5rem 0'}}>{r.content}</p>
                                                {isLoggedIn && r.userId === currentUserId && (
                                                    <div className={styles.reviewActionBtns}>
                                                        <button onClick={() => startEdit(r.id, r.content)}>수정</button>
                                                        <button onClick={() => setConfirmDeleteId(r.id)}>삭제</button>
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
                <div className={styles.rightColumn}>
                    {firstSolver && (
                        <div className={styles.firstSolverCard}>
                            <div>
                                <div>
                                    <img
                                        src="/src/assets/congratulations.png"
                                        style={{
                                            width: "1.3em",
                                            height: "1.3em",
                                            verticalAlign: "text-bottom",
                                            marginLeft: "0.1em",
                                            marginRight: "0.4em",
                                        }}
                                    />
                                    First Blood!
                                </div>
                                <strong>{firstSolver.username}님</strong>
                            </div>
                        </div>
                    )}
                    <WargameUserStatusCard users={currentUsers}/>
                </div>
            </div>
            {isReviewModalOpen && (
                <div className={styles["modal-overlay"]} onClick={() => setIsReviewModalOpen(false)}>
                    <div
                        className={styles["modal-box"]}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "3rem" }}>리뷰를 등록할까요?</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                            <button className={styles["submit-btn"]} onClick={() => {
                                handleCreateReview();
                                setIsReviewModalOpen(false);
                            }}>확인</button>
                            <button className={styles["submit-btn"]} style={{ backgroundColor: "#ddd", color: "#333" }} onClick={() => setIsReviewModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDeleteId !== null && (
                <div className={styles["modal-overlay"]} onClick={() => setConfirmDeleteId(null)}>
                    <div className={styles["modal-box"]} onClick={(e) => e.stopPropagation()}>
                        <p style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "3rem" }}>리뷰를 삭제할까요?</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                            <button
                                className={styles["submit-btn"]}
                                onClick={() => {
                                    handleDeleteReview(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }}
                            >
                                확인
                            </button>
                            <button
                                className={styles["submit-btn"]}
                                style={{ backgroundColor: "#ddd", color: "#333" }}
                                onClick={() => setConfirmDeleteId(null)}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmEditDone && (
                <div className={styles["modal-overlay"]} onClick={() => setConfirmEditDone(false)}>
                    <div className={styles["modal-box"]} onClick={(e) => e.stopPropagation()}>
                        <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>리뷰가 수정되었습니다!</p>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                            <button className={styles["submit-btn"]} onClick={() => setConfirmEditDone(false)}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default WargameDetailPage;
