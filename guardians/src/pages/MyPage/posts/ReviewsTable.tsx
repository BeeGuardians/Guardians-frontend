import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Review {
    id: number;
    wargameTitle: string; // 이거 추가했다고 가정
    content: string;
    createdAt: string;
}

const ReviewsTable = () => {
    const { user } = useAuth();
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
                const reviews = res.data?.result?.data?.reviews ?? [];
                const sorted = [...reviews].sort(
                    (a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setReviewData(sorted);
            } catch (err) {
                console.error("리뷰 데이터를 불러오는 중 오류 발생:", err);
                setReviewData([]);
            }
        };

        fetchReviews();
    }, [user]);

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
                        tableLayout: "fixed",
                    }}
                >
                    <thead>
                    <tr style={{ fontSize: "0.9rem", color: "#555" }}>
                        <th style={{ ...thStyle, width: "10%", textAlign: "center" }}>번호</th>
                        <th style={{ ...thStyle, width: "30%", textAlign: "left" }}>워게임명</th>
                        <th style={{ ...thStyle, width: "40%", textAlign: "left" }}>리뷰 내용</th>
                        <th style={{ ...thStyle, width: "20%", textAlign: "center" }}>작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center", padding: "3rem" }}>
                                작성한 리뷰가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        currentData.map((review, idx) => (
                            <tr
                                key={review.id}
                                style={{
                                    backgroundColor: "white",
                                    borderBottom: "1px solid #eee",
                                    transition: "background-color 0.2s ease",
                                    cursor: "default",
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
                                    }}
                                    title={review.wargameTitle}
                                >
                                    {review.wargameTitle}
                                </td>
                                <td
                                    style={{
                                        ...tdStyle,
                                        textAlign: "left",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    title={review.content}
                                >
                                    {review.content}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    {review.createdAt.split("T")[0]}
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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

const tdStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
};

export default ReviewsTable;
