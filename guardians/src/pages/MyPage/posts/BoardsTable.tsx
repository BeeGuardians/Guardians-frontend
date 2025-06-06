import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Board {
    boardId: number;
    title: string;
    content: string;
    boardType: string;
    createdAt: string;
    likeCount: number;
}

const categoryKorean: Record<string, string> = {
    FREE: "자유",
    INQUIRY: "문의",
    STUDY: "스터디",
};

const categoryColors: Record<string, string> = {
    자유: "#f0b429",
    스터디: "#d38df2",
    문의: "#46c5c0",
};

const BoardsTable = () => {
    const { user } = useAuth();
    const [boardData, setBoardData] = useState<Board[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchBoards = async () => {
            try {
                const res = await axios.get(`/api/users/${user.id}/boards`, {
                    withCredentials: true,
                });
                const posts = res.data?.result?.data?.boards ?? [];

                const sortedPosts = [...posts].sort(
                    (a: Board, b: Board) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setBoardData(sortedPosts);

            } catch (err) {
                console.error("게시글 불러오기 실패:", err);
                setBoardData([]);
            }
        };

        fetchBoards();
    }, [user]);

    const totalPages = Math.ceil(boardData.length / itemsPerPage);
    const currentData = boardData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div style={{ marginBottom: "3rem" }}>
            <div
                style={{
                    backgroundColor: "white",
                    padding: "1.5rem",
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
                    <tr style={{ fontSize: "0.9rem", color: "#555" }}>
                        <th style={{ ...thStyle, width: "15%", textAlign: "center" }}>번호</th>
                        <th style={{ ...thStyle, width: "35%", textAlign: "left" }}>제목</th>
                        <th style={{ ...thStyle, width: "15%", textAlign: "center" }}>분류</th>
                        <th style={{ ...thStyle, width: "15%", textAlign: "center" }}>추천수</th>
                        <th style={{ ...thStyle, width: "20%", textAlign: "center" }}>작성일</th>
                    </tr>
                    </thead>

                    <tbody>
                    {currentData.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center", padding: "3rem" }}>
                                작성한 게시글이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        currentData.map((board, idx) => (
                            <tr
                                key={board.boardId}
                                style={{
                                    backgroundColor: "white",
                                    borderBottom: "1px solid #eee",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 179, 71, 0.15)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                            >
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    {(currentPage - 1) * itemsPerPage + idx + 1}
                                </td>
                                <td
                                    style={{
                                        ...tdStyle,
                                        textAlign: "left",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        color: "#333",
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/community/${board.boardType.toLowerCase()}/${board.boardId}`
                                        )
                                    }
                                    title={board.title}
                                >
                                    {board.title}
                                </td>
                                <td
                                    style={{
                                        ...tdStyle,
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color:
                                            categoryColors[categoryKorean[board.boardType]] || "#555",
                                    }}
                                >
                                    {categoryKorean[board.boardType] || board.boardType}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    {board.likeCount}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    {board.createdAt.split("T")[0]}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>

                </table>
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx + 1}
                        style={{
                            margin: "0 0.25rem",
                            padding: "0.4rem 0.75rem",
                            backgroundColor:
                                currentPage === idx + 1 ? "#fcb24b" : "#e0e0e0",
                            color: currentPage === idx + 1 ? "white" : "#333",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            outline: "none",
                        }}
                        onClick={() => setCurrentPage(idx + 1)}
                    >
                        {idx + 1}
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
    textAlign: "left" as const,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "pointer",
};

const tdStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    textAlign: "center" as const,
};

export default BoardsTable;
