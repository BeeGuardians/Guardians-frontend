import { useState } from "react";

interface UserRanking {
    rank: number;
    username: string;
    score: number;
    totalSolved: number;
    userProfileUrl: string;
    userId: string;
}

interface RankingTableProps {
    data: UserRanking[];
    handleUserClick: (targetUserId: string) => Promise<void>;
}

const ITEMS_PER_PAGE = 20;

const RankingTable: React.FC<RankingTableProps> = ({ data, handleUserClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const currentData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getTier = (score: number): string => {
        if (score >= 5000) return "Platinum";
        if (score >= 3000) return "Gold";
        if (score >= 2000) return "Silver";
        if (score >= 1000) return "Bronze";
        return "Bronze";
    };

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
                    tableLayout: "fixed",
                }}
            >
                <thead>
                <tr
                    style={{
                        textAlign: "center",
                        fontSize: "0.9rem",
                        color: "#555",
                    }}
                >
                    <th style={{ ...thStyle, width: "15%" }}>순위</th>
                    <th style={{ ...thStyle, width: "35%" }}>닉네임</th>
                    <th style={{ ...thStyle, width: "10%" }}>티어</th>
                    <th style={{ ...thStyle, width: "20%" }}>푼 문제</th>
                    <th style={{ ...thStyle, width: "20%" }}>점수</th>
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
                            cursor: "pointer", // 클릭 가능함을 나타냄
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fcddb6")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "white")
                        }
                        onClick={() => handleUserClick(user.userId)}
                    >
                        <td style={tdStyle}>{user.rank}</td>
                        <td style={{ ...tdStyle, display: "flex", alignItems: "left", gap: "1rem", justifyContent: "left", marginLeft:"7rem" }}>
                            <img
                                src={user.userProfileUrl}
                                alt="profile"
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />
                            <span>{user.username}</span>
                        </td>
                        <td style={tdStyle}>
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        backgroundColor: "#f5f5f5",
                                        padding: "0.2rem 0.5rem",
                                        borderRadius: "8px",
                                        color: "#555",
                                    }}
                                >
                                    {getTier(user.score)}
                                </span>
                        </td>
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
    textAlign: "center" as const,
};

export default RankingTable;