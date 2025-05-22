import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SolvedLineChart from "./SolvedLineChart";

type Badge = {
    id: number;
    name: string;
    description: string;
    trueIconUrl: string | null;
    falseIconUrl: string | null;
    earned: boolean;
};

const DashboardPage = () => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [userInfo, setUserInfo] = useState<{
        nickname: string;
        profileImageUrl: string;
        score: number;
        rank: number;
        solvedCount: number;
    } | null>(null);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const descriptionRef = useRef<HTMLDivElement | null>(null);

    // 외부 클릭 시 말풍선 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                descriptionRef.current &&
                !descriptionRef.current.contains(event.target as Node)
            ) {
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
        const fetchData = async () => {
            try {
                const profileRes = await axios.get("/api/users/me", {withCredentials: true});
                const userId = profileRes.data.result.data.id;
                const nickname = profileRes.data.result.data.username;
                const profileImageUrl = profileRes.data.result.data.profileImageUrl;

                const statsRes = await axios.get(`/api/users/${userId}/stats`);
                const {score, rank, solvedCount} = statsRes.data.result.data;
                setUserInfo({nickname, profileImageUrl, score, rank, solvedCount});

                const badgeRes = await axios.get(`/api/users/${userId}/badges`);
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

    return (
        <div style={{display: "flex", justifyContent: "center", padding: "2rem 1rem"}}>
            <div style={{maxWidth: "1200px", width: "100%"}}>
                <h3 style={{marginTop: 0, marginBottom: "1rem", fontWeight: 400, fontSize: "1rem", color: "#666"}}>
                    📊 내 성장과 성과를 한 눈에 확인해보세요!
                </h3>

                {/* 설명 박스 */}
                <div style={{
                    backgroundColor: "#fffbe6",
                    border: "1px solid #ffe58f",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    marginBottom: "3vh",
                    color: "#664d03",
                    fontSize: "0.95rem",
                    lineHeight: "1.5rem"
                }}>
                    대시보드는 사용자 활동을 기반으로 배지와 역할을 시각화하는 공간입니다. <br/>
                    획득한 보상과 활동 데이터를 바탕으로, 학습 현황을 종합적으로 파악해보세요! 💎
                </div>

                {/* 요약 카드 */}
                <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    marginBottom: "4vh",
                    flexWrap: "wrap",
                    justifyContent: "space-between"
                }}>
                    {isLoading ? (
                        <div>로딩 중...</div>
                    ) : error || !userInfo ? (
                        <div style={{color: "red"}}>데이터를 불러오지 못했어요 😢</div>
                    ) : (
                        <>
                            {[
                                {label: "내 랭킹", value: `${userInfo.rank}위`, color: "#228be6"},
                                {label: "내 점수", value: userInfo.score, color: "#40c057"},
                                {label: "내가 푼 문제 수", value: userInfo.solvedCount, color: "#FFA94D"},
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    flex: "1 1 200px",
                                    padding: "1.5rem",
                                    borderRadius: "2rem",
                                    backgroundColor: "#fff",
                                    border: "1px solid #eee",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                    textAlign: "center"
                                }}>
                                    <div style={{
                                        fontSize: "2rem",
                                        fontWeight: 600,
                                        color: item.color
                                    }}>{item.value}</div>
                                    <div style={{
                                        fontSize: "0.9rem",
                                        color: "#666",
                                        marginTop: "0.5rem"
                                    }}>{item.label}</div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* 뱃지 영역 */}
                <div style={{marginBottom: "5vh"}}>
                    <h4 style={{fontSize: "1.1rem", marginBottom: "1.5rem"}}>내 뱃지</h4>
                    <div style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "1rem",
                        padding: "2rem"
                    }}>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 1fr)",
                            gap: "1.3rem",
                            placeItems: "center"
                        }}>
                            {badges.map((badge) => (
                                <div key={badge.id} title={badge.name} style={{
                                    width: "70%",
                                    aspectRatio: "1",
                                    borderRadius: "50%",
                                    backgroundColor: "#f5f5f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    // border: badge.earned ? "5px solid #40c057" : "5px dashed #ccc"
                                }}>
                                    <img
                                        src={
                                            badge.earned
                                                ? badge.trueIconUrl || "/badge/default-colored.png"
                                                : badge.falseIconUrl || "/badge/default-gray.png"
                                        }
                                        alt={badge.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            filter: badge.earned ? "none" : "grayscale(100%) opacity(0.5)"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-end", marginTop: "2rem"}}>

                        </div>
                        {/* 버튼 + 설명 말풍선 */}
                        <div
                            ref={descriptionRef}
                            style={{ position: "relative", display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                            {isDescriptionOpen && (
                                <div style={{
                                    position: "absolute",
                                    bottom: "100%", // 버튼 위로
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
                                    zIndex: 10
                                }}>
                                    {/* 꼬리 */}
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: "1rem",
                                        width: 0,
                                        height: 0,
                                        borderLeft: "8px solid transparent",
                                        borderRight: "8px solid transparent",
                                        borderTop: "8px solid #fffaf3",
                                        filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.05))"
                                    }} />

                                    {badges.map((badge) => (
                                        <div key={badge.id} style={{ marginBottom: "0.5rem" }}>
                                            <strong>{badge.name}:</strong> {badge.description}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 버튼 */}
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                style={{
                                    padding: "0.5rem 1rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "999px",
                                    backgroundColor: "#fdf3e7",
                                    cursor: "pointer",
                                    fontSize: "0.9rem"
                                }}
                            >
                                {isDescriptionOpen ? "뱃지 설명 닫기" : "뱃지란?"}
                            </button>
                        </div>

                    </div>
                </div>

                {/* 차트 */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2rem",
                    justifyContent: "space-between",
                    marginBottom: "5vh"
                }}>
                    <div style={{flex: 1, minWidth: "300px"}}>
                        <h4 style={{textAlign: "center", fontSize: "1.1rem", marginBottom: "1.5rem"}}>
                            &lt; 종합 역량 진단표 &gt;
                        </h4>
                        <div style={{
                            height: "40vh",
                            backgroundColor: "#fafafa",
                            border: "1px dashed #ccc",
                            borderRadius: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                            fontSize: "1rem"
                        }}>
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
