import { useState } from "react";
import styles from "./PostsPage.module.css";

const BoardsTable = () => {
    const boardData = [
        { id: 1, title: "궁금한건 못 참아", category: "자유", date: "2025-05-07", likes: 3, views: 20 },
        { id: 2, title: "웹프로그래밍 같이 공부해여", category: "스터디", date: "2025-05-05", likes: 5, views: 30 },
        { id: 3, title: "관리자에게 바란다", category: "문의", date: "2025-04-28", likes: 0, views: 10 },
        { id: 4, title: "커뮤니티 개선사항", category: "자유", date: "2025-04-20", likes: 1, views: 15 },
        { id: 5, title: "프론트엔드 모집", category: "스터디", date: "2025-04-18", likes: 2, views: 25 },
        { id: 6, title: "서버 속도 개선해주세요", category: "문의", date: "2025-04-15", likes: 0, views: 9 },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(boardData.length / itemsPerPage);

    const currentData = boardData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categoryColors: Record<string, string> = {
        자유: "#f0b429",
        스터디: "#d38df2",
        문의: "#46c5c0",
    };

    return (
        <div style={{ marginBottom: "3rem" }}>
            {/* ✅ 카드 형태의 테이블 외부 래퍼 */}
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
                    <tr
                        style={{
                            textAlign: "left",
                            fontSize: "0.9rem",
                            color: "#555",
                        }}
                    >
                        <th style={{ ...thStyle }}>#</th>
                        <th style={{ ...thStyle }}>제목</th>
                        <th style={{ ...thStyle }}>분류</th>
                        <th style={{ ...thStyle }}>작성일</th>
                        <th style={{ ...thStyle }}>추천수</th>
                        <th style={{ ...thStyle }}>조회수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.map((post) => (
                        <tr
                            key={post.id}
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
                            <td style={tdStyle}>{post.id}</td>
                            <td style={tdStyle}>{post.title}</td>
                            <td
                                style={{
                                    ...tdStyle,
                                    fontWeight: 600,
                                    color: categoryColors[post.category],
                                }}
                            >
                                {post.category}
                            </td>
                            <td style={tdStyle}>{post.date}</td>
                            <td style={tdStyle}>{post.likes}</td>
                            <td style={tdStyle}>{post.views}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ 페이지네이션 버튼 */}
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
