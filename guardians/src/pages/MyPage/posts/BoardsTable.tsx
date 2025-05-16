import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

// ✅ 게시글 인터페이스
interface Board {
    id: number;
    title: string;
    content: string;
    boardType: string;
}

// ✅ 영어 → 한글 매핑
const categoryKorean: Record<string, string> = {
    FREE: "자유",
    INQUIRY: "문의",
    STUDY: "스터디",
};

// ✅ 한글 → 색상 매핑
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

    useEffect(() => {
        if (!user) return;

        const fetchBoards = async () => {
            try {
                const res = await axios.get(`/api/users/${user.id}/boards`, {
                withCredentials: true,
            });

            const boards = res.data?.result?.data ?? [];
            setBoardData(boards);
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
                }}
            >
                <thead>
                <tr style={{ textAlign: "left", fontSize: "0.9rem", color: "#555" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>제목</th>
                    <th style={thStyle}>분류</th>
                    <th style={thStyle}>작성일</th>
                    <th style={thStyle}>추천수</th>
                    <th style={thStyle}>조회수</th>
                </tr>
                </thead>
                <tbody>
                {currentData.length === 0 ? (
                    <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>
                            작성한 게시글이 없습니다.
                        </td>
                    </tr>
                ) : (
                    currentData.map((board, idx) => (
                        <tr key={board.id} style={{ backgroundColor: "white" }}>
                            <td style={tdStyle}>{(currentPage - 1) * itemsPerPage + idx + 1}</td> {/* 순번 */}
                            <td style={tdStyle}>{board.title}</td> {/* 제목 */}
                            <td
                                style={{
                                    ...tdStyle,
                                    fontWeight: 600,
                                    color: categoryColors[categoryKorean[board.boardType]] || "#555",
                                }}
                            >
                                {categoryKorean[board.boardType] || board.boardType}
                            </td> {/* 분류 */}
                            <td style={tdStyle}>-</td> {/* 작성일 (현재 DTO에 없음) */}
                            <td style={tdStyle}>-</td> {/* 추천수 (현재 DTO에 없음) */}
                            <td style={tdStyle}>-</td> {/* 조회수 (현재 DTO에 없음) */}
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
};

const tdStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    textAlign: "left" as const,
};

export default BoardsTable;