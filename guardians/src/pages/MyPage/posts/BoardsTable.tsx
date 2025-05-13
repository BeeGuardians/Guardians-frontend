import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PostsPage.module.css";
import { useAuth } from "../../../context/AuthContext"; // ✅ AuthContext에서 사용자 정보 가져옴

// ✅ DTO 기반 인터페이스
interface BoardItem {
    boardId: number;
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

const categoryColors: Record<string, string> = {
    자유: "#f0b429",
    스터디: "#d38df2",
    문의: "#46c5c0",
};

const BoardsTable = () => {
    const { user } = useAuth(); // ✅ 로그인된 사용자 정보
    const [boardData, setBoardData] = useState<BoardItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!user) return; // ❗️user 없으면 아무것도 안함

        axios
            .get(`/api/users/${user.id}/boards`, { withCredentials: true }) // ✅ user.id 기반 요청
            .then((res) => {
                setBoardData(res.data.result.data.posts);
            })
            .catch((err) => {
                console.error("게시글 데이터 불러오기 실패", err);
            });
    }, [user]); // ✅ user 정보가 바뀌면 재요청

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
                    {currentData.map((post, index) => {
                        const category = categoryKorean[post.boardType] || post.boardType;
                        return (
                            <tr
                                key={post.boardId}
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
                                <td style={tdStyle}>
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td style={tdStyle}>{post.title}</td>
                                <td
                                    style={{
                                        ...tdStyle,
                                        fontWeight: 600,
                                        color: categoryColors[category],
                                    }}
                                >
                                    {category}
                                </td>
                                <td style={tdStyle}>-</td> {/* 작성일 없음 */}
                                <td style={tdStyle}>-</td> {/* 추천수 없음 */}
                                <td style={tdStyle}>-</td> {/* 조회수 없음 */}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx + 1}
                        className={`${styles.paginationButton} ${
                            currentPage === idx + 1 ? styles.activePage : ""
                        }`}
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