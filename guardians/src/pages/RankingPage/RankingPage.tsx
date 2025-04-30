import React from "react";
import SearchBar from "../WargamePage/SearchBar";
import RankCard from "./RankCard";

const RankingPage: React.FC = () => {
    return (
        <div style={{ padding: "2rem" }}>
            <h2>RankingPage 테스트</h2>

            {/* 닉네임 검색창 */}
            <SearchBar />

            {/* 순위 카드 3개 */}
            <div style={{ display: "flex", gap: "1rem" }}>
                <RankCard rank={1} nickname="Guardian123" score={6200} solvedCount={300} />
                <RankCard rank={2} nickname="Guardian456" score={5200} solvedCount={200} />
                <RankCard rank={3} nickname="Guardian789" score={4500} solvedCount={100} />
            </div>
        </div>
    );
};

export default RankingPage;
