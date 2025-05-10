// src/pages/Mypage/posts/ReviewsTable.tsx
import { useState } from "react";

const ReviewsTable = () => {
    const reviewData = [
        { id: 1, title: "WarGame_Title00", content: "유익한 시간이었습니다^^", date: "2025-05-07" },
        { id: 2, title: "WarGame_Title20", content: "문제가 너무 어려워서 못 품 ㅠㅠ", date: "2025-05-03" },
        { id: 3, title: "WarGame_Title44", content: "식은 죽 먹기구만", date: "2025-04-29" },
        { id: 4, title: "WarGame_Title22", content: "문제 별루임 --", date: "2025-04-20" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(reviewData.length / itemsPerPage);
    const currentData = reviewData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    <tr
                        style={{
                            textAlign: "left",
                            fontSize: "0.9rem",
                            color: "#555",
                        }}
                    >
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>워게임명</th>
                        <th style={thStyle}>리뷰 내용</th>
                        <th style={thStyle}>작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.map((review) => (
                        <tr
                            key={review.id}
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
                            <td style={tdStyle}>{review.id}</td>
                            <td style={tdStyle}>{review.title}</td>
                            <td style={tdStyle}>{review.content}</td>
                            <td style={tdStyle}>{review.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Pagination */}
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx + 1}
                        style={{
                            margin: "0 0.25rem",
                            padding: "0.4rem 0.75rem",
                            backgroundColor: currentPage === idx + 1 ? "#fcb24b" : "#e0e0e0",
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

export default ReviewsTable;
