import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import styles from "./WargameDetailPage.module.css";
import QACard from "./QACard";
import WargameUserStatusCard from "./WargameUserStatusCard";
import {AiOutlineInfoCircle} from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";


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
    score: number;
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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isStartingPod, setIsStartingPod] = useState(false);
    const [isStoppingPod, setIsStoppingPod] = useState(false);
    const [newReview, setNewReview] = useState("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState<string>("");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmEditDone, setConfirmEditDone] = useState(false);
    const [modalResult, setModalResult] = useState<null | {
        correct: boolean;
        message: string;
        accessUrl?: string
    }>(null);
    const [podStatus, setPodStatus] = useState<string>("");
    const [kaliUrl, setKaliUrl] = useState<string | null>(null);
    const [kaliStatus, setKaliStatus] = useState<string>("Not Found");
    const [isStartingKali, setIsStartingKali] = useState(false);
    const [isStoppingKali, setIsStoppingKali] = useState(false);
    const [showWargameTooltip, setShowWargameTooltip] = useState(false);
    const [showKaliTooltip, setShowKaliTooltip] = useState(false);
    const [isKaliGuideOpen, setIsKaliGuideOpen] = useState(false);

    // --- ADMIN 기능: State 추가 ---
    const [userRole, setUserRole] = useState<string | null>(null);
    const [wargameFlag, setWargameFlag] = useState<string | null>(null);
    const [isFlagVisible, setIsFlagVisible] = useState(false);
    const handleCopyFlag = () => {
        if (!wargameFlag) return;
        navigator.clipboard.writeText(wargameFlag)
            .then(() => {
                alert('플래그가 클립보드에 복사되었습니다.');
            })
            .catch(err => {
                console.error('플래그 복사 실패: ', err);
                alert('복사에 실패했습니다.');
            });
    };
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`${API_BASE}/api/wargames/kali/status`)
                .then((res) => {
                    setKaliStatus(res.data.result.data.status);
                    setKaliUrl(res.data.result.data.url);
                })
                .catch((err) => {
                    console.error("칼리 상태 조회 실패", err);
                });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const startKaliPod = async () => {
        setIsStartingKali(true);
        try {
            const res = await axios.post(`${API_BASE}/api/wargames/kali/start`);
            setKaliUrl(res.data.result.data.url);
            setKaliStatus("Pending");
        } catch {
            alert("로그인이 필요합니다.");
        } finally {
            setIsStartingKali(false);
        }
    };

    const stopKaliPod = async () => {
        setIsStoppingKali(true);
        try {
            await axios.delete(`${API_BASE}/api/wargames/kali/stop`);
            setKaliUrl(null);
            setKaliStatus("Not Found");
        } catch {
            alert("칼리 인스턴스 종료 실패");
        } finally {
            setIsStoppingKali(false);
        }
    };


    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (id) {
            fetchWargame();
            fetchQnA();
            fetchUserStatus();
            fetchReviews();
            fetchPodStatus();
        }
    }, [id]);

    // --- ADMIN 기능: 역할 변경 시 플래그 조회 ---
    useEffect(() => {
        if (userRole === 'ADMIN' && id) {
            fetchFlagForAdmin(id);
        }
    }, [userRole, id]);
    // --- 로직 추가 끝 ---

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`${API_BASE}/api/wargames/${id}/status`)
                .then((res) => {
                    setPodStatus(res.data.result.data.status);
                    setPodUrl(res.data.result.data.url);
                })
                .catch((err) => {
                    console.error("파드 상태 불러오기 실패", err);
                });
        }, 3000); // 5초마다

        return () => clearInterval(interval);
    }, [id]);

    // --- ADMIN 기능: checkLoginStatus 함수 수정 ---
    const checkLoginStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/users/me`);
            if (res.data.result.data) {
                setIsLoggedIn(true);
                setCurrentUserId(res.data.result.data.id);
                setUserRole(res.data.result.data.role); // 역할 정보 저장
            }
        } catch {
            setIsLoggedIn(false); // 에러 나면 로그인 안 된 걸로 간주
            setUserRole(null);
        }
    };

    // --- ADMIN 기능: 플래그 조회 함수 추가 ---
    const fetchFlagForAdmin = async (wargameId: string) => {
        try {
            const res = await axios.get(`${API_BASE}/api/wargames/admin/${wargameId}/flag`);
            setWargameFlag(res.data.result.data.flag);
        } catch (err) {
            console.error("관리자용 플래그 조회 실패", err);
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
        axios
            .get(`${API_BASE}/api/wargames/${id}/active-users/list`)
            .then((res) => {
                setUserStatuses(res.data.result.data || []);
            })
            .catch((err) => {
                console.error("🔥 유저 상태 불러오기 실패", err);
            });
    };

    const fetchPodStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/wargames/${id}/status`);
            const status = res.data.result.data?.status;
            const url = res.data.result.data?.url;

            setPodStatus(status);

            setIsPodRunning(status === "Running" || status === "Pending" || status === "Terminating");
            if (status === "Not Found") {
                setIsPodRunning(false);
                setPodUrl(null);
            }
            setPodUrl(status === "Running" ? url : null);
        } catch (err) {
            console.error("🔥 파드 상태 확인 실패", err);
            setIsPodRunning(false);
            setPodUrl(null);
            setPodStatus("Unknown");
        }
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
            setConfirmEditDone(true);
        } catch {
            alert("리뷰 수정 실패");
        }
    };

    const startWargamePod = async () => {
        setIsStartingPod(true);
        try {
            const res = await axios.post(`${API_BASE}/api/wargames/${id}/start`);
            setTimeout(() => {
                const {url} = res.data.result.data;
                setPodUrl(url);
                setIsPodRunning(true);
                setIsStartingPod(false);
            }, 3000);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.result?.message || "파드 생성 실패!";
                alert(errorMsg);
            } else {
                alert("예기치 못한 오류 발생");
            }
            setIsStartingPod(false);
        }
    };

    const stopWargamePod = async () => {
        setIsStoppingPod(true);
        try {
            await axios.delete(`${API_BASE}/api/wargames/${id}/stop`);
            setPodUrl(null);
            setIsPodRunning(false);
        } catch {
            alert("파드 삭제 실패!");
        } finally {
            setIsStoppingPod(false);
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

    const navigate = useNavigate();


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
                                <span className={`${styles["info-badge"]} ${styles["score-badge"]}`}>
                                  💯 {wargame.score}점
                                </span>
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

                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem", position: "relative"}}>
                        <h2 className={styles["pod-title"]} style={{
                            flexShrink: 0,
                            flexGrow: 1,
                            borderBottom: "2px solid #FFA94D",
                            paddingBottom: "0.25rem"
                        }}>해킹 실습 환경</h2>
                        <AiOutlineInfoCircle
                            size={18}
                            color="#888"
                            onMouseEnter={() => setShowKaliTooltip(true)}
                            onMouseLeave={() => setShowKaliTooltip(false)}
                            style={{cursor: "pointer"}}
                        />
                        {showKaliTooltip && (
                            <div style={{
                                position: "absolute",
                                top: "100%",
                                left: "70%",
                                background: "#4d4d4d",
                                color: "#fff",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "8px",
                                zIndex: 999,
                                fontSize: "0.85rem",
                                whiteSpace: "nowrap",
                                marginTop: "0.25rem"
                            }}>
                                실습용 리눅스 환경이에요. 환경이 준비되지 않았다면 이 버튼으로 바로 시작해보세요!
                            </div>
                        )}
                    </div>

                    <div className={styles.guideToggleContainer}>
                        <div onClick={() => setIsKaliGuideOpen(!isKaliGuideOpen)} className={styles.toggleButton}>
                            <span className={styles.toggleTitle}>
                                💡 칼리 리눅스, 왜 필요한가요?
                            </span>
                            <div className={styles.toggleAction}>
                                <span>{isKaliGuideOpen ? '접기' : '자세히 보기'}</span>
                                <IoIosArrowDown
                                    className={`${styles.toggleIcon} ${isKaliGuideOpen ? styles.toggleIconOpen : ''}`}
                                />
                            </div>
                        </div>

                        <div style={{
                            maxHeight: isKaliGuideOpen ? '1000px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.4s ease-in-out'
                        }}>
                            <div className={styles.guideContent}>
                                <p>여러분의 성공적인 문제 해결을 돕기 위해 다음과 같은 기능을 제공해요!</p>
                                <div className={styles.guideItem}>
                                    <h4>🚀 1. 복잡한 설치 과정은 이제 그만!</h4>
                                    <p>더 이상 가상머신(VM)을 설치하거나 듀얼 부팅을 설정할 필요가 없어요. 웹 브라우저만 있다면 언제 어디서든 즉시 해킹 및 보안 테스트에 필요한
                                        모든 도구가 갖춰진 환경에 접속할 수 있어요. 문제 풀이에만 온전히 집중하세요.</p>
                                </div>
                                <div className={styles.guideItem}>
                                    <h4>🛠️ 2. 모든 전문 도구가 한 곳에</h4>
                                    <p>칼리 리눅스에는 정보 수집(Nmap), 웹 취약점 분석(Burp Suite), 익스플로잇(Metasploit), 리버싱(Ghidra) 등의
                                        세계적인 보안 도구들이 미리 설치되어 있어요. 어떤 유형의 문제가 나오더라도, 필요한 도구를 찾아 헤맬 필요 없이 바로 사용할 수
                                        있어요.</p>
                                </div>
                                <div className={styles.guideItem}>
                                    <h4>🛡️ 3. 안전하고 독립된 나만의 공간</h4>
                                    <p>각 사용자에게는 완벽하게 격리된 개인 전용 파드(Pod)가 제공돼요. 여러분의 실습은 다른 사용자나 개인 PC에 전혀 영향을 주지 않아요. 마음껏
                                        테스트하고, 실험하고, 공격하며 실력을 키워나가세요.</p>
                                </div>
                                <div className={styles.guideItem}>
                                    <h4>🌐 4. 모두에게 동일한 표준 환경</h4>
                                    <p>모든 사용자가 동일한 버전의 운영체제와 도구를 사용하므로, "제 PC에서는 안 돼요"와 같은 환경 문제를 최소화할 수 있어요.
                                        CTF(Capture The Flag)와 같은 대회 환경처럼, 모두에게 공정한 표준 실습 환경을 제공해요.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles["pod-card"]}>
                        <div className={styles["submit-box"]}>
                            {kaliStatus === "Running" || kaliStatus === "Pending" || kaliStatus === "Terminating" ? (
                                <button
                                    onClick={stopKaliPod}
                                    className={styles["submit-btn"]}
                                    disabled={isStoppingKali || isStartingKali || kaliStatus === "Terminating"}
                                >
                                    {isStoppingKali || kaliStatus === "Terminating" ? "환경 종료 중..." : "환경 종료"}
                                </button>
                            ) : (
                                <button
                                    onClick={startKaliPod}
                                    className={styles["submit-btn"]}
                                    disabled={isStartingKali || isStoppingKali}
                                >
                                    {isStartingKali ? "환경 시작 중..." : "해킹 환경 시작"}
                                </button>
                            )}
                        </div>
                        {(isStartingKali || isStoppingKali) && (
                            <p className={styles["pod-url"]} style={{color: '#888'}}>
                                최대 60초 정도 소요될 수 있어요.
                            </p>
                        )}
                        {kaliUrl && !isStartingKali && kaliStatus !== "Terminating" && (
                            <p className={styles["pod-url"]}>
                                접속 URL: <a href={kaliUrl} target="_blank" rel="noreferrer">{kaliUrl}</a>
                            </p>
                        )}
                        <p style={{color: "#aaa", marginTop: "0.5rem"}}>상태: {kaliStatus}</p>
                    </div>

                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem", position: "relative"}}>
                        <h2 className={styles["pod-title"]} style={{
                            flexShrink: 0,
                            flexGrow: 1,
                            borderBottom: "2px solid #FFA94D",
                            paddingBottom: "0.25rem"
                        }}>워게임 인스턴스</h2>
                        <AiOutlineInfoCircle
                            size={18}
                            color="#888"
                            onMouseEnter={() => setShowWargameTooltip(true)}
                            onMouseLeave={() => setShowWargameTooltip(false)}
                            style={{cursor: "pointer"}}
                        />
                        {showWargameTooltip && (
                            <div style={{
                                position: "absolute",
                                top: "100%",
                                left: "70%",
                                background: "#4d4d4d",
                                color: "#fff",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "8px",
                                zIndex: 999,
                                fontSize: "0.85rem",
                                whiteSpace: "nowrap",
                                marginTop: "0.25rem"
                            }}>
                                이 워게임에 대한 실습 환경을 시작하거나 종료할 수 있어요.
                            </div>
                        )}
                    </div>
                    <div className={styles["pod-card"]}>
                        <div className={styles["submit-box"]}>
                            {isPodRunning || podStatus === "Terminating" ? (
                                <button
                                    onClick={stopWargamePod}
                                    className={styles["submit-btn"]}
                                    disabled={isStoppingPod || isStartingPod || podStatus === "Terminating"}
                                >
                                    {podStatus === "Terminating" || isStoppingPod
                                        ? "인스턴스 종료 중..."
                                        : "워게임 종료"}
                                </button>
                            ) : (
                                <button
                                    onClick={startWargamePod}
                                    className={styles["submit-btn"]}
                                    disabled={isStartingPod || isStoppingPod || podStatus === "Terminating"}
                                >
                                    {isStartingPod ? "인스턴스 시작 중..." : "워게임 시작"}
                                </button>
                            )}
                        </div>
                        {(isStartingPod || isStoppingPod) && (
                            <p className={styles["pod-url"]} style={{color: '#888'}}>
                                최대 60초 정도 소요될 수 있어요.
                            </p>
                        )}
                        {podUrl && !isStartingPod && podStatus !== "Terminating" && (
                            <p className={styles["pod-url"]}>
                                접속 URL: <a href={podUrl} target="_blank" rel="noreferrer">{podUrl}</a>
                            </p>
                        )}
                        <p style={{color: "#aaa", marginTop: "0.5rem"}}>
                            상태: {podStatus === "Not Found" ? "Stopped" : podStatus}
                        </p>
                    </div>

                    {userRole === 'ADMIN' && wargameFlag && (
                        <div style={{ margin: '2rem 0', border: '1px dashed #e03131', padding: '0.5rem', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
                            <button
                                onClick={() => setIsFlagVisible(!isFlagVisible)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#c92a2a',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    outline: 'none' // 포커스 아웃라인 제거
                                }}
                            >
                                🏴 정답 보기 (관리자만 보여요!) {isFlagVisible ? '▲' : '▼'}
                            </button>
                            {isFlagVisible && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '1rem',
                                    fontFamily: 'monospace',
                                    backgroundColor: '#ffe3e3',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '4px'
                                }}>
                                    <code>{wargameFlag}</code>
                                    <button
                                        onClick={handleCopyFlag}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            outline: 'none' // 포커스 아웃라인 제거
                                        }}
                                    >
                                        <IoCopyOutline size={16} color="#555" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

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
                                    <p style={{fontSize: "1.1rem", fontWeight: 600}}>
                                        {modalResult.correct ? "정답!" : "오답!"}
                                    </p>
                                )}
                                <p style={{marginTop: "0.5rem", color: "#555"}}>{modalResult.message}</p>

                                {modalResult.accessUrl && modalResult.correct && (
                                    <div style={{marginTop: "1rem", fontSize: "0.9rem", wordBreak: "break-all"}}>
                                        접속 URL: <a href={modalResult.accessUrl} target="_blank"
                                                   rel="noreferrer">{modalResult.accessUrl}</a>
                                    </div>
                                )}

                                <button onClick={handleCloseModal} className={styles["submit-btn"]}>닫기</button>
                            </div>
                        </div>
                    )}

                    <div className={styles["qa-section"]}>
                        <h2 className={styles["qa-title"]}>Q&A</h2>
                        {isLoggedIn && (
                            <button
                                className={styles["submit-btn"]}
                                style={{marginBottom: '1rem', marginLeft: 'auto', display: 'block'}}
                                onClick={() => navigate("/community/qna/write")}
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
                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                                    <button
                                        className={styles["submit-btn"]}
                                        style={{width: "80px"}}
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
                                <div>🎉 First Blood!</div>
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
                        <p style={{fontWeight: 600, fontSize: "1.1rem", marginBottom: "3rem"}}>리뷰를 등록할까요?</p>
                        <div style={{display: "flex", justifyContent: "center", gap: "0.5rem"}}>
                            <button className={styles["submit-btn"]} onClick={() => {
                                handleCreateReview();
                                setIsReviewModalOpen(false);
                            }}>확인
                            </button>
                            <button className={styles["submit-btn"]} style={{backgroundColor: "#ddd", color: "#333"}}
                                    onClick={() => setIsReviewModalOpen(false)}>취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDeleteId !== null && (
                <div className={styles["modal-overlay"]} onClick={() => setConfirmDeleteId(null)}>
                    <div className={styles["modal-box"]} onClick={(e) => e.stopPropagation()}>
                        <p style={{fontWeight: 600, fontSize: "1.1rem", marginBottom: "3rem"}}>리뷰를 삭제할까요?</p>
                        <div style={{display: "flex", justifyContent: "center", gap: "0.5rem"}}>
                            <button
                                className={styles["submit-btn"]}
                                onClick={() => {
                                    if(confirmDeleteId) handleDeleteReview(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }}
                            >
                                확인
                            </button>
                            <button
                                className={styles["submit-btn"]}
                                style={{backgroundColor: "#ddd", color: "#333"}}
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
                        <p style={{fontWeight: 600, fontSize: "1.1rem"}}>리뷰가 수정되었습니다!</p>
                        <div style={{display: "flex", justifyContent: "center", marginTop: "1.5rem"}}>
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