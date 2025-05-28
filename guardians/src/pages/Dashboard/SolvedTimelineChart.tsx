import { useEffect, useState } from "react";
import axios from "axios";

interface SolvedItem {
    category: string;
    name: string;
    date: string; // yyyy-MM-dd
}

interface Props {
    userId?: number;
}

const SolvedTimeline = ({ userId }: Props) => {
    const [data, setData] = useState<SolvedItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!userId) return;
        axios
            .get(`/api/users/${userId}/dashboard/timeline`, { withCredentials: true })
            .then((res) => setData(res.data.result.data))
            .catch((err) => console.error("SolvedTimeline 오류:", err));
    }, [userId]);

    const uniqueDates = Array.from(new Set(data.map((item) => item.date))).sort();
    const filteredItems = selectedDate ? data.filter((item) => item.date === selectedDate) : [];
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const pagedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div style={{ display: "flex", gap: "2rem" }}>
            {/* 🎯 왼쪽: 타임라인 + 스크롤 */}
            <div
                style={{
                    height: "250px",
                    width: "80px",
                    overflowY: "auto",
                    borderRight: "1px solid #eee",
                    padding: "1rem 0.5rem",
                    position: "relative",
                }}
            >
                {/* 세로선 */}
                <div style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    backgroundColor: "#ddd",
                    transform: "translateX(-50%)",
                }} />

                {/* 날짜 동그라미 목록 */}
                {uniqueDates.map((date, index) => (
                    <div
                        key={date}
                        onClick={() => {
                            setSelectedDate(date);
                            setCurrentPage(1);
                        }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginBottom: "2rem",
                            cursor: "pointer",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <div
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                backgroundColor: selectedDate === date ? "#4c6ef5" : "#ccc",
                                marginBottom: 6,
                            }}
                            title={date}
                        />
                        <div
                            style={{
                                fontSize: "0.75rem",
                                color: selectedDate === date ? "#4c6ef5" : "#888",
                            }}
                        >
                            {date.slice(5)}
                        </div>
                    </div>
                ))}
            </div>

            {/* 📋 오른쪽: 문제 테이블 */}
            <div style={{ flex: 1 }}>
                {selectedDate && (
                    <div>
                        {pagedItems.length > 0 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                <tr style={{ backgroundColor: "#f5f5f5" }}>
                                    <th style={{ padding: "0.5rem", border: "1px solid #eee" }}>카테고리</th>
                                    <th style={{ padding: "0.5rem", border: "1px solid #eee" }}>문제명</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pagedItems.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: "0.5rem", border: "1px solid #eee" }}>{item.category}</td>
                                        <td style={{ padding: "0.5rem", border: "1px solid #eee" }}>{item.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>해당 날짜에 풀이한 문제가 없습니다.</p>
                        )}

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        style={{
                                            margin: "0 4px",
                                            padding: "0.3rem 0.7rem",
                                            border: i + 1 === currentPage ? "1px solid #4c6ef5" : "1px solid #ccc",
                                            backgroundColor: i + 1 === currentPage ? "#e8f0fe" : "white",
                                            cursor: "pointer",
                                            borderRadius: 4,
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolvedTimeline;
