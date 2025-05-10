import {useState} from "react";

interface UserRanking {
    rank: number;
    username: string;
    score: number;
    totalSolved: number;
}

interface RankingTableProps {
    data: UserRanking[];
}

const ITEMS_PER_PAGE = 20;

const RankingTable: React.FC<RankingTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const currentData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
            }}
        >
            <table
                style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                }}
            >
                <thead>
                <tr
                    style={{
                        textAlign: "left",
                        fontSize: "0.9rem",
                        color: "#555",
                    }}
                >
                    <th style={{ ...thStyle, width: "20%" }}>순위</th>
                    <th style={{ ...thStyle, width: "30%" }}>닉네임</th>
                    <th style={{ ...thStyle, width: "25%" }}>푼 문제</th>
                    <th style={{ ...thStyle, width: "25%" }}>점수</th>
                </tr>
                </thead>
                <tbody>
                {currentData.map((user) => (
                    <tr
                        key={user.rank}
                        style={{
                            backgroundColor: "white",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fcddb6")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "white")
                        }
                    >
                        <td style={tdStyle}>{user.rank}</td>
                        <td style={tdStyle}>{user.username}</td>
                        <td style={tdStyle}>{user.totalSolved}</td>
                        <td style={tdStyle}>{user.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이징 */}
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{
                            margin: "0 0.25rem",
                            padding: "0.4rem 0.75rem",
                            backgroundColor: currentPage === i + 1 ? "#FFC078" : "#f0f0f0",
                            color: currentPage === i + 1 ? "white" : "black",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

const thStyle = {
    padding: "0.75rem 1rem",
    fontWeight: 600,
    borderBottom: "2px solid #ddd",
    color: "#888",
    fontSize: "0.9rem",
};

const tdStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    textAlign: "left" as const,
};

export default RankingTable;
