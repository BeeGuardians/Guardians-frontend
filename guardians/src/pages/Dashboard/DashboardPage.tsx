import {useEffect, useRef, useState} from "react";
import axios from "axios";
import SolvedLineChart from "./SolvedLineChart";
import "react-circular-progressbar/dist/styles.css";
import {motion} from "framer-motion";

// 뱃지 타입
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
    const [isTierInfoOpen, setIsTierInfoOpen] = useState(false);
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    const tierRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (descriptionRef.current && !descriptionRef.current.contains(event.target as Node)) {
                setIsDescriptionOpen(false);
            }
        };

        if (isDescriptionOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDescriptionOpen]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await axios.get("/api/users/me", {withCredentials: true});
                const userId = profileRes.data.result.data.id;
                const nickname = profileRes.data.result.data.username;
                const profileImageUrl = profileRes.data.result.data.profileImageUrl;
                const tier = profileRes.data.result.data.tier;

                const statsRes = await axios.get(`/api/users/${userId}/stats`);
                const {score, rank, solvedCount} = statsRes.data.result.data;

                setUserInfo({nickname, profileImageUrl, score, rank, solvedCount, tier});

                const badgeRes = await axios.get(`/api/users/${userId}/badges`);
                const sorted = badgeRes.data.result.data.sort((a: Badge, b: Badge) => a.id - b.id);
                setBadges([
                    ...sorted,
                    {
                        id: 999,
                        name: "전설의 레전드",
                        description: "랭킹 1위에게 주어져요.",
                        trueIconUrl: null,
                        falseIconUrl:
                            "https://s3-guardians-dev.s3.ap-northeast-2.amazonaws.com/badges/false_Legend+of+Legend.png",
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
        return <div style={{textAlign: "center", padding: "2rem"}}>로딩 중...</div>;
    }

    if (error || !userInfo) {
        return <div style={{color: "red", textAlign: "center", padding: "2rem"}}>데이터를 불러오지 못했어요 😢</div>;
    }

    const getBarColor = (key: string): string => {
        return key === "랭킹" ? "#228be6" : key === "점수" ? "#40c057" : "#FFA94D";
    };

    const stats = [
        {
            label: "랭킹",
            value: userInfo?.rank || 0,
            percent: userInfo?.rank === 1 ? 100 : 100 - (userInfo?.rank || 0) * 3,
            suffix: "위",
        },
        {
            label: "점수",
            value: userInfo?.score || 0,
            percent: Math.min((userInfo?.score || 0) / 50, 100),
            suffix: "점",
        },
        {
            label: "문제",
            value: userInfo?.solvedCount || 0,
            percent: Math.min((userInfo?.solvedCount || 0) * 10, 100),
            suffix: "개",
        },
    ];

    return (
        <div style={{display: "flex", justifyContent: "center", padding: "2rem 1rem"}}>
            <div style={{maxWidth: "1200px", width: "100%"}}>
                <h3 style={{marginTop: 0, marginBottom: "1rem", fontWeight: 400, fontSize: "1rem", color: "#666"}}>
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
                    대시보드는 사용자 활동을 기반으로 배지와 역할을 시각화하는 공간입니다. <br/>
                    획득한 보상과 활동 데이터를 바탕으로, 학습 현황을 종합적으로 파악해보세요! 💎
                </div>

                {/* 요약 카드 */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                        padding: "2rem",
                        backgroundColor: "#fff",
                        border: "1px solid #eee",
                        borderRadius: "1.5rem",
                        marginBottom: "4vh",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                >
                    {/* 프로필 + 티어 */}
                    <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                        <img
                            src={userInfo?.profileImageUrl || "/default-profile.png"}
                            alt="프로필"
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #FFA94D",
                            }}
                        />
                        <div>
                            <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                                <span style={{fontSize: "1.2rem", fontWeight: 600}}>{userInfo?.nickname}</span>
                                <img
                                    src={`/badges/${String(userInfo?.tier)}.png`}
                                    alt="티어 뱃지"
                                    style={{width: "28px", height: "28px"}}
                                />
                            </div>
                            <div style={{fontSize: "0.85rem", color: "#888"}}>{userInfo?.tier} 티어</div>
                        </div>
                    </div>

                    {/* 통계 + 프로그래스 */}
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "space-around",
                            textAlign: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                        }}
                    >
                        {userInfo &&
                            stats.map((item) => (
                                <div key={item.label} style={{ width: "220px", textAlign: "center" }}>
                                    <div style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.95rem" }}>
                                        {item.value} {item.suffix} ({item.label})
                                    </div>
                                    <div
                                        style={{
                                            backgroundColor: "#e9ecef",
                                            borderRadius: "8px",
                                            height: "30px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: getBarColor(item.label),
                                                width: `${item.percent}%`,
                                                height: "100%",
                                                transition: "width 0.5s ease-in-out",
                                            }}
                                        />
                                    </div>
                                </div>

                            ))}
                    </div>

                    <div ref={tierRef} style={{position: "relative", textAlign: "center"}}>
                        <button
                            onClick={() => setIsTierInfoOpen(!isTierInfoOpen)}
                            style={{
                                marginTop: "1rem",
                                backgroundColor: "#fdf3e7",
                                border: "1px solid #ccc",
                                borderRadius: "999px",
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                            }}
                        >
                            티어 기준표 보기
                        </button>

                        {isTierInfoOpen && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-100%",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "360px",
                                    backgroundColor: "#fffaf3",
                                    border: "1px solid #eee",
                                    borderRadius: "0.75rem",
                                    padding: "1rem",
                                    fontSize: "0.85rem",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                }}
                            >
                                <div style={{marginBottom: "0.5rem", fontWeight: 600}}>🎖 티어 기준</div>
                                <ul style={{paddingLeft: "1rem", margin: 0, textAlign: "left"}}>
                                    <li>PLATINUM: 5000점 이상</li>
                                    <li>GOLD: 3000 ~ 4999점</li>
                                    <li>SILVER: 2000 ~ 2999점</li>
                                    <li>BRONZE: ~1999점</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* 뱃지 영역 */}
                <div style={{marginBottom: "5vh"}}>
                    <h4 style={{fontSize: "1.1rem", marginBottom: "1.5rem"}}>내 뱃지</h4>
                    <div
                        style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "1rem",
                            padding: "2rem"
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(6, 1fr)",
                                gap: "1.3rem",
                                placeItems: "center",
                            }}
                        >
                            {badges.map((badge) => (
                                <div
                                    key={badge.id}
                                    title={badge.name}
                                    style={{
                                        width: "70%",
                                        aspectRatio: "1",
                                        borderRadius: "50%",
                                        backgroundColor: "#f5f5f5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={badge.earned ? badge.trueIconUrl || "/badge/default-colored.png" : badge.falseIconUrl || "/badge/default-gray.png"}
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

                        {/* 말풍선 */}
                        <div
                            ref={descriptionRef}
                            style={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "1rem"
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

                                    <div style={{
                                        marginBottom: "0.75rem",
                                        color: "#333",
                                        borderBottom: "2px solid #eee",
                                        padding: "0.2rem"
                                    }}>
                                        <strong style={{fontSize: "1.1rem"}}>🎖 뱃지란?</strong>
                                        <br/>문제를 풀면서 얻는 <strong>도전과 성취의 증표</strong>예요.
                                        <br/>각각의 뱃지는 특정 조건을 달성했을 때 <strong>자동으로 지급</strong>돼요.
                                    </div>

                                    {badges.map((badge) => (
                                        <div key={badge.id} style={{marginBottom: "0.5rem"}}>
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

                {/* 차트 */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "2rem",
                        justifyContent: "space-between",
                        marginBottom: "5vh",
                    }}
                >
                    <div style={{flex: 1, minWidth: "300px"}}>
                        <h4 style={{textAlign: "center", fontSize: "1.1rem", marginBottom: "1.5rem"}}>&lt; 종합 역량
                            진단표 &gt;</h4>
                        <div
                            style={{
                                height: "40vh",
                                backgroundColor: "#fafafa",
                                border: "1px dashed #ccc",
                                borderRadius: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "1rem",
                            }}
                        >
                            [레이더 차트 영역]
                        </div>
                    </div>

                    <div style={{flex: 1, minWidth: "300px", height: "40vh"}}>
                        <SolvedLineChart/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
