interface UserRanking {
    rank: number;
    nickname: string;
    score: number;
    solvedCount: number;
}

interface RankingTableProps {
    data: UserRanking[];
}

const RankingTable: React.FC<RankingTableProps> = ({ data }) => {
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
            <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={thStyle}>순위</th>
                <th style={thStyle}>닉네임</th>
                <th style={thStyle}>점수</th>
                <th style={thStyle}>푼 문제 수</th>
            </tr>
            </thead>
            <tbody>
            {data.map((user) => (
                <tr key={user.rank} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    <td style={tdStyle}>{user.rank}</td>
                    <td style={tdStyle}>{user.nickname}</td>
                    <td style={tdStyle}>{user.score}</td>
                    <td style={tdStyle}>{user.solvedCount}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

const thStyle = {
    padding: "0.75rem",
    fontWeight: "bold",
    borderBottom: "2px solid #ccc",
};

const tdStyle = {
    padding: "0.5rem",
};

export default RankingTable;
