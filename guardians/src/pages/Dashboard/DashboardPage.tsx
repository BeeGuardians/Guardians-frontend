import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SolvedLineChart from "./SolvedLineChart";
import "react-circular-progressbar/dist/styles.css";
import RadarChart from "./RadarChart";
import SolvedTimelineChart from "./SolvedTimelineChart";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface Badge {
    id: number;
    name: string;
    description: string;
    trueIconUrl: string | null;
    falseIconUrl: string | null;
    earned: boolean;
}

const DashboardPage = () => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [userInfo, setUserInfo] = useState<{
        id: number;
        nickname: string;
        profileImageUrl: string;
        score: number;
        rank: number;
        solvedCount: number;
        tier: string;
    } | null>(null);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isTierDescriptionOpen, setIsTierDescriptionOpen] = useState(false);
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    const tierDescriptionRef = useRef<HTMLDivElement | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (descriptionRef.current && !descriptionRef.current.contains(event.target as Node)) {
                setIsDescriptionOpen(false);
            }
        };
        if (isDescriptionOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDescriptionOpen]);

    useEffect(() => {
        const handleTierClickOutside = (event: MouseEvent) => {
            if (tierDescriptionRef.current && !tierDescriptionRef.current.contains(event.target as Node)) {
                setIsTierDescriptionOpen(false);
            }
        };
        if (isTierDescriptionOpen) {
            document.addEventListener("mousedown", handleTierClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleTierClickOutside);
        };
    }, [isTierDescriptionOpen]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await axios.get("/api/users/me", { withCredentials: true });
                const userData = profileRes.data.result.data;

                const statsRes = await axios.get(`/api/users/${userData.id}/stats`);
                const statsData = statsRes.data.result.data;

                setUserInfo({
                    id: userData.id,
                    nickname: userData.username,
                    profileImageUrl: userData.profileImageUrl,
                    score: statsData.score,
                    rank: statsData.rank,
                    solvedCount: statsData.solvedCount,
                    tier: statsData.tier,
                });

                const badgeRes = await axios.get(`/api/users/${userData.id}/badges`);
                const sorted = badgeRes.data.result.data.sort((a: Badge, b: Badge) => a.id - b.id);
                setBadges([
                    ...sorted,
                    {
                        id: 999,
                        name: "전설의 레전드",
                        description: "랭킹 1위에게 주어져요.",
                        trueIconUrl: null,
                        falseIconUrl: "https://s3-guardians-dev.s3.ap-northeast-2.amazonaws.com/badges/false_Legend+of+Legend.png",
                        earned: false,
                    },
                ]);
            } catch (err) {
                setError(true);
                console.error("DashboardPage Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);



    if (isLoading) {
        return <div style={{ textAlign: "center", padding: "2rem" }}>로딩 중...</div>;
    }

    if (error || !userInfo) {
        return <div style={{ color: "red", textAlign: "center", padding: "2rem" }}>데이터를 불러오지 못했어요 😢</div>;
    }

    const getBarColor = (key: string): string => {
        return key === "랭킹" ? "#228be6" : key === "점수" ? "#40c057" : "#FFA94D";
    };

    const stats = [
        { label: "랭킹", value: userInfo.rank, percent: userInfo.rank === 1 ? 100 : 100 - userInfo.rank * 3, suffix: "위" },
        { label: "점수", value: userInfo.score, percent: Math.min(userInfo.score / 50, 100), suffix: "점" },
        { label: "문제", value: userInfo.solvedCount, percent: Math.min(userInfo.solvedCount * 10, 100), suffix: "개" },
    ];

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem" }}>
            <div style={{ maxWidth: "1200px", width: "100%" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1rem", fontWeight: 400, fontSize: "1rem", color: "#666" }}>
                    📊 내 성장과 성과를 한 눈에 확인해보세요!
                </h3>

                {/* 소개 설명 박스 */}
                <div
                    style={{
                        backgroundColor: "#fffbe6",
                        border: "1px solid #ffe58f",
                        borderRadius: "0.75rem",
                        padding: "1.5rem",
                        marginBottom: "3vh",
                        color: "#664d03",
                        fontSize: "0.95rem",
                        lineHeight: "1.5rem",
                    }}
                >
                    대시보드는 사용자 활동을 기반으로 배지와 역할을 시각화하는 공간입니다. <br />
                    획득한 보상과 활동 데이터를 바탕으로 학습 현황을 종합적으로 파악해보세요! 💎
                </div>

                {/* 카드 그룹 */}
                <div style={{ display: "flex", gap: "2rem", alignItems: "stretch", marginBottom: "4vh" }}>
                    {/* 내 정보 카드 */}
                    <div style={{ flex: 5, display: "flex", flexDirection: "column", position: "relative" }}>
                        <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem", fontWeight: 500 }}>내 정보</h4>
                        <div
                            style={{
                                backgroundColor: "#fff",
                                padding: "2rem",
                                borderRadius: "1.5rem",
                                border: "1px solid #eee",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "100px"}}>
                                    <img
                                        src={userInfo.profileImageUrl || "/default-profile.png"}
                                        alt="프로필"
                                        style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #FFA94D",
                                            marginBottom: "0.5rem",
                                        }}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                                        <img src={`/badges/${userInfo.tier}.png`} alt="티어" style={{ width: 24, height: 24 }} />
                                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>{userInfo.nickname}</span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                                    {stats.map((item) => (
                                        <div
                                            key={item.label}
                                            style={{
                                                backgroundColor: "#fffdf6",
                                                padding: "0.75rem",
                                                borderRadius: "1rem",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                            }}
                                        >
                                            {/* 점수 항목에만 아이콘 추가 */}
                                            <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: 6, display: "flex", alignItems: "center", gap: "0.3rem", position: "relative" }}>
                                                {item.label}
                                                {item.label === "점수" && (
                                                    <>
                                                        <AiOutlineInfoCircle
                                                            size={15}
                                                            color="#888"
                                                            style={{ cursor: "pointer" }}
                                                            onMouseEnter={() => setShowTooltip(true)}
                                                            onMouseLeave={() => setShowTooltip(false)}
                                                        />
                                                        {showTooltip && (
                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "100%",
                                                                    left: "0",
                                                                    marginTop: "0.4rem",
                                                                    background: "#4d4d4d",
                                                                    color: "#fff",
                                                                    padding: "0.5rem 0.75rem",
                                                                    borderRadius: "8px",
                                                                    fontSize: "0.8rem",
                                                                    whiteSpace: "nowrap",
                                                                    zIndex: 999,
                                                                }}
                                                            >
                                                                • BRONZE : 2000점 미만<br /><br />
                                                                • SILVER : 2000점 이상<br /><br />
                                                                • GOLD : 3000점 이상<br /><br />
                                                                • PLATINUM : 5000점 이상
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                                                {item.value}
                                                <span style={{ fontSize: "0.9rem", marginLeft: 4 }}>{item.suffix}</span>
                                            </div>
                                            <div
                                                style={{
                                                    backgroundColor: "#fff",
                                                    borderRadius: 20,
                                                    height: 16,
                                                    border: "2px solid #eee",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        backgroundColor: getBarColor(item.label),
                                                        width: `${item.percent}%`,
                                                        height: "100%",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 내 뱃지 카드 */}
                    <div style={{ flex: 5, display: "flex", flexDirection: "column" }}>
                        <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem", fontWeight: 500 }}>내 뱃지</h4>
                        <div
                            style={{
                                backgroundColor: "#fff",
                                padding: "1.5rem",
                                borderRadius: "1.5rem",
                                border: "1px solid #eee",
                                flex: 1,
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(6, 1fr)",
                                    columnGap: "1rem",
                                    rowGap: "1.4rem",
                                    placeItems: "center",
                                    marginTop: "0.8rem"
                                }}
                            >
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        title={badge.name}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50%",
                                            backgroundColor: "#f5f5f5",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            transition: "transform 0.25s ease",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                                        }}
                                    >
                                        <img
                                            src={
                                                badge.earned
                                                    ? badge.trueIconUrl ?? "/badge/default-colored.png"
                                                    : badge.falseIconUrl ?? "/badge/default-gray.png"
                                            }
                                            alt={badge.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                filter: badge.earned ? "none" : "grayscale(100%) opacity(0.5)",
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div
                                ref={descriptionRef}
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: "0rem",
                                }}
                            >
                                {isDescriptionOpen && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "100%",
                                            right: 0,
                                            marginBottom: "0.75rem",
                                            backgroundColor: "#fffaf3",
                                            border: "1px solid #eee",
                                            borderRadius: "0.75rem",
                                            padding: "1rem",
                                            fontSize: "0.85rem",
                                            lineHeight: "1.4rem",
                                            color: "#444",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                            width: "450px",
                                            zIndex: 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                right: "1rem",
                                                width: 0,
                                                height: 0,
                                                borderLeft: "8px solid transparent",
                                                borderRight: "8px solid transparent",
                                                borderTop: "8px solid #fffaf3",
                                                filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.05))",
                                            }}
                                        />
                                        <div style={{ marginBottom: "0.75rem", color: "#333", borderBottom: "2px solid #eee", padding: "0.2rem" }}>
                                            <strong style={{ fontSize: "1.1rem" }}>🎖 뱃지란?</strong>
                                            <br />
                                            문제를 풀면서 얻는 <strong>도전과 성취의 증표</strong>예요.
                                            <br />
                                            각각의 뱃지는 특정 조건을 달성했을 때 <strong>자동으로 지급</strong>돼요.
                                        </div>
                                        {badges.map((badge) => (
                                            <div key={badge.id} style={{ marginBottom: "0.5rem" }}>
                                                <strong>{badge.name}:</strong> {badge.description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "999px",
                                        backgroundColor: "#fdf3e7",
                                        cursor: "pointer",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {isDescriptionOpen ? "뱃지 설명 닫기" : "뱃지란?"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* 종합 활동 리포트 제목 */}
                <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem", fontWeight: 500, marginTop: "3rem" }}>
                    종합 활동 리포트
                </h4>

                {/* 차트 영역 전체 카드로 감싸기 */}
                <div
                    style={{
                        backgroundColor: "rgba(13,66,128,0.04)",
                        border: "1px solid #eee",
                        borderRadius: "1.5rem",
                        padding: "2rem",
                        marginTop: 0,
                    }}
                >

                    {/* 상단 2개 차트 */}
                    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                        {/* 종합 역량 진단표 */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <div style={{ fontSize: "1rem", fontWeight: 500, color: "#666", marginBottom: "0.75rem" }}>
                                • 역량 진단표
                            </div>
                            <div style={{
                                backgroundColor: "#fff",
                                border: "1px solid #eee",
                                borderRadius: "0.5rem",
                                padding: "1.5rem",
                                height: "40vh",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}>
                                {userInfo && <RadarChart userId={userInfo.id} />}
                            </div>
                        </div>

                        {/* 내가 푼 문제 수 */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <div style={{ fontSize: "1rem", fontWeight: 500, color: "#666", marginBottom: "0.75rem" }}>
                                • 내가 푼 문제 수
                            </div>
                            <div style={{
                                backgroundColor: "#fff",
                                border: "1px solid #eee",
                                borderRadius: "0.5rem",
                                padding: "1.5rem",
                                height: "40vh",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}>
                                <SolvedLineChart />
                            </div>
                        </div>
                    </div>

                    {/* 하단 2개 차트 */}
                    <div
                        style={{
                            display: "flex",
                            gap: "2rem",
                            flexWrap: "wrap",
                            marginTop: "2rem",
                        }}
                    >
                        {/* 타임라인 */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <div style={{ fontSize: "1rem", fontWeight: 500, color: "#666", marginBottom: "0.75rem" }}>
                                • 타임라인
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #eee",
                                    borderRadius: "0.5rem",
                                    padding: "1.5rem",
                                    height: "40vh",
                                    overflowX: "auto",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                }}
                            >
                                {userInfo && <SolvedTimelineChart userId={userInfo.id} />}
                            </div>
                        </div>

                        {/* 랭킹 변화 추이 */}
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <div style={{ fontSize: "1rem", fontWeight: 500, color: "#666", marginBottom: "0.75rem" }}>
                                • 랭킹 변화 추이 (예정)
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #eee",
                                    borderRadius: "0.5rem",
                                    padding: "1.5rem",
                                    height: "40vh",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#ccc",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                }}
                            >
                                {/* 내용은 예정 */}
                                준비 중입니다
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
    );
};

export default DashboardPage;