import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Review {
    id: number;
    content: string;
    createdAt: string;
    // title?: string; // 워게임명은 현재 DTO에 없으므로 주석 처리
}

const ReviewsTable = () => {
    const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
    const [reviewData, setReviewData] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!user) return;

        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/api/users/${user.id}/reviews`, {
                    withCredentials: true,
                });
                setReviewData(res.data.result.data.reviews);
            } catch (err) {
                console.error("리뷰 데이터를 불러오는 중 오류 발생:", err);
            }
        };

        fetchReviews();
    }, [user]);

    const formatDateTime = (isoString: string) => {
        return isoString.replace("T", " ").slice(0, 16); // 예: "2025-05-01 10:15"
    };

    const totalPages = Math.ceil(reviewData.length / itemsPerPage);
    const currentData = reviewData.slice(
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
                    <tr
                        style={{
                            textAlign: "left",
                            fontSize: "0.9rem",
                            color: "#555",
                        }}
                    >
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>워게임명</th> {/* ❗️현재 표시 불가 */}
                        <th style={thStyle}>리뷰 내용</th>
                        <th style={thStyle}>작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.map((review, idx) => (
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
                            <td style={tdStyle}>
                                {(currentPage - 1) * itemsPerPage + idx + 1}
                            </td>
                            <td style={tdStyle}>-</td> {/* 워게임명 없음 */}
                            <td style={tdStyle}>{review.content}</td>
                            <td style={tdStyle}>{formatDateTime(review.createdAt)}</td>
                        </tr>
                    ))}
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

export default ReviewsTable;
