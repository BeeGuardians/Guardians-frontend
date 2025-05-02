import SearchBar from "./SearchBar";
import RankCard from "./RankCard";
import RankingTable from "./RankingTable";

const dummyTop3 = [
    { rank: 1, nickname: "정현", score: 7000, solvedCount: 380 },
    { rank: 2, nickname: "ChatGPT", score: 6800, solvedCount: 360 },
    { rank: 3, nickname: "...", score: 6400, solvedCount: 340 },
];

const dummyOthers = [
    { rank: 1, nickname: "정현", score: 7000, solvedCount: 380 },
    { rank: 2, nickname: "ChatGPT", score: 6800, solvedCount: 360 },
    { rank: 3, nickname: "...", score: 6400, solvedCount: 340 },
    { rank: 4, nickname: "user1", score: 6000, solvedCount: 280 },
    { rank: 5, nickname: "user2", score: 5800, solvedCount: 260 },
    { rank: 6, nickname: "user3", score: 5400, solvedCount: 240 },
    { rank: 7, nickname: "user4", score: 5000, solvedCount: 180 },
    { rank: 8, nickname: "user5", score: 4800, solvedCount: 160 },
    { rank: 9, nickname: "user6", score: 4400, solvedCount: 140 }
];

function RankingPage() {
    return (
        <div style={{ padding: "2rem 10rem" }}>
            {/* 상단 타이틀 */}
            <h3
                style={{
                    marginTop: "0rem",
                    marginBottom: "1rem",
                    fontWeight: 400,
                    fontSize: "1rem",
                    color: "#666",
                }}
            >
                🏆 나의 순위는 몇 위? 최고 수치로 실력을 증명해보세요!
            </h3>

            {/* 설명 카드 */}
            <div
                style={{
                    backgroundColor: "#fffbe6",
                    border: "1px solid #ffe58f",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    marginBottom: "6rem",
                    color: "#664d03",
                    fontSize: "0.95rem",
                    lineHeight: "1.5rem",
                }}
            >
                랭킹은 워게임에서 획득한 점수와 해결한 문제 수에 따라 자동 계산됩니다. <br />
                다른 유저들과 실력을 비교하고, 더 높은 점수를 향해 도전해보세요! 💥
            </div>

            {/* TOP 3 카드 정렬 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "6.5rem",
                    marginBottom: "5rem",
                }}
            >
                {/* 2등 - 왼쪽 */}
                <div style={{ transform: "translateY(10px)", scale: "1.05" }}>
                    <RankCard {...dummyTop3[1]} />
                </div>

                {/* 1등 - 가운데, 더 큼 */}
                <div style={{ transform: "translateY(0px)", scale: "1.15" }}>
                    <RankCard {...dummyTop3[0]} />
                </div>

                {/* 3등 - 오른쪽 */}
                <div style={{ transform: "translateY(10px)", scale: "1.05" }}>
                    <RankCard {...dummyTop3[2]} />
                </div>
            </div>

            {/* 검색창 */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
                <SearchBar />
            </div>

            {/* 전체 순위 테이블 */}
            <RankingTable data={dummyOthers} />
        </div>
    );
}

export default RankingPage;
