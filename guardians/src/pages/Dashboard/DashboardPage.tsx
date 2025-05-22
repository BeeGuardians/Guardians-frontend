import {useEffect, useState} from "react";
import axios from "axios";
import SolvedLineChart from "./SolvedLineChart";

type Badge = {
    id: number;
    name: string;
    description: string;
    iconUrl: string | null;
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
                setBadges(badgeRes.data.result.data);
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

                {/* ✅ 요약 카드 */}
                <div
                    style={{
                        display: "flex",
                        gap: "1.5rem",
                        marginBottom: "4vh",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
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
                                <div
                                    key={idx}
                                    style={{
                                        flex: "1 1 200px",
                                        padding: "1.5rem",
                                        borderRadius: "1rem",
                                        backgroundColor: "#fff",
                                        border: "1px solid #eee",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                        textAlign: "center",
                                    }}
                                >
                                    <div style={{fontSize: "2rem", fontWeight: "bold", color: item.color}}>
                                        {item.value}
                                    </div>
                                    <div style={{fontSize: "0.9rem", color: "#666", marginTop: "0.5rem"}}>
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* ✅ 내 뱃지 */}
                <div style={{marginBottom: "5vh"}}>
                    <h4 style={{fontSize: "1.1rem", marginBottom: "1.5rem"}}>내 뱃지</h4>
                    <div
                        style={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "1rem",
                            padding: "2rem",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(6, 1fr)",
                                gap: "1.5rem",
                            }}
                        >
                            {[...badges, {
                                id: 999,
                                name: "전설의 레전드",
                                description: "랭킹 1위에게 주어져요.",
                                iconUrl: null,
                                earned: false
                            }].map((badge) => (
                                <div
                                    key={badge.id}
                                    title={badge.name}
                                    style={{
                                        width: "60%",
                                        aspectRatio: "1",
                                        borderRadius: "50%",
                                        backgroundColor: "#f5f5f5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        overflow: "hidden",
                                        border: badge.earned ? "2px solid #FFA94D" : "2px dashed #ccc",
                                    }}
                                >
                                    <img
                                        src={
                                            badge.earned
                                                ? badge.iconUrl || "/badge/default-colored.png"
                                                : "/badge/default-gray.png"
                                        }
                                        alt={badge.name}
                                        style={{
                                            width: "80%",
                                            height: "80%",
                                            objectFit: "contain",
                                            filter: badge.earned ? "none" : "grayscale(100%) opacity(0.5)",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ✅ 차트 */}
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
                        <h4 style={{textAlign: "center", fontSize: "1.1rem", marginBottom: "1.5rem"}}>
                            &lt; 종합 역량 진단표 &gt;
                        </h4>
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
