import SearchBar from "./RankingPage/SearchBar";
import RankCard from "./RankingPage/RankCard";
import RankingTable from "./RankingPage/RankingTable";

const dummyTop3 = [
    { rank: 1, nickname: "정현", score: 7000, solvedCount: 380 },
    { rank: 2, nickname: "ChatGPT", score: 6800, solvedCount: 360 },
    { rank: 3, nickname: "...", score: 6400, solvedCount: 340 },
];

const dummyOthers = [
    { rank: 1, nickname: "정현", score: 7000, solvedCount: 380 },
    { rank: 2, nickname: "ChatGPT", score: 6800, solvedCount: 360 },
    { rank: 3, nickname: "...", score: 6400, solvedCount: 340 },
];

function Ranking() {
    return (
        //헤더랑 여백설정
        <div style={{ margin:0, padding: 0}}>

            {/* 검색창 오른쪽 정렬 */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "3rem", marginRight: "12rem"}}>
                <SearchBar />
            </div>

            {/* 상위 3개 카드 중앙 정렬 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "5rem", marginBottom: "2rem",marginRight: "10rem" }}>
                {dummyTop3.map((user) => (
                    <RankCard key={user.rank} {...user} />
                ))}
            </div>

            {/* 하위 순위 테이블 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "5rem", marginBottom: "2rem",marginRight: "10rem" }}>
                <RankingTable data={dummyOthers} />
            </div>
        </div>
    );
}

export default Ranking;
