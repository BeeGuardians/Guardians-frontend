import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import RankCard from "./RankCard";
import RankingTable from "./RankingTable";

interface UserRanking {
    rank: number;
    username: string;
    score: number;
    totalSolved: number;
    userProfileUrl: string;
}

function RankingPage() {
    const [top3, setTop3] = useState<UserRanking[]>([]);
    const [allUsers, setAllUsers] = useState<UserRanking[]>([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ranking`)
            .then((res) => {
                const data = res.data.result?.data ?? [];
                setTop3(data.slice(0, 3));
                setAllUsers(data);
            })
            .catch((err) => {
                console.error("❌ 랭킹 불러오기 실패:", err);
            });
    }, []);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            padding: "2rem 1rem",
        }}>
            <div style={{
                maxWidth: "1200px",
                width: "100%",
            }}>
                {/* 상단 설명 */}
                <h3 style={{ marginTop: "0rem", marginBottom: "1rem", fontWeight: 400, fontSize: "1rem", color: "#666" }}>
                    🏆 나의 순위는 몇 위? 최고 수치로 실력을 증명해보세요!
                </h3>

                <div style={{
                    backgroundColor: "#fffbe6",
                    border: "1px solid #ffe58f",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    marginBottom: "6rem",
                    color: "#664d03",
                    fontSize: "0.95rem",
                    lineHeight: "1.5rem",
                }}>
                    랭킹은 워게임에서 획득한 점수와 해결한 문제 수에 따라 자동 계산됩니다. <br />
                    다른 유저들과 실력을 비교하고, 더 높은 점수를 향해 도전해보세요! 💥
                </div>

                {/* 🥇 상위 3명 카드 */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "6.5rem",
                    marginBottom: "5rem",
                }}>
                    {top3.length >= 3 && (
                        <>
                            <div style={{ transform: "translateY(10px)", scale: "1.05" }}>
                                <RankCard {...top3[1]} />
                            </div>
                            <div style={{ transform: "translateY(0px)", scale: "1.15" }}>
                                <RankCard {...top3[0]} />
                            </div>
                            <div style={{ transform: "translateY(10px)", scale: "1.05" }}>
                                <RankCard {...top3[2]} />
                            </div>
                        </>
                    )}
                </div>

                {/* 🔍 검색창 */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
                    <SearchBar />
                </div>

                {/* 📊 전체 순위 테이블 */}
                <RankingTable data={allUsers} />
            </div>
        </div>
    );
}

export default RankingPage;
