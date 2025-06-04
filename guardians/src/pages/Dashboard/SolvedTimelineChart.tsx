import { useEffect, useState } from "react";
import axios from "axios";

interface SolvedItem {
    category: string;
    name: string;
    date: string; // yyyy-MM-dd 형식
}

interface Props {
    userId?: number;
}

const SolvedTimeline = ({ userId }: Props) => {
    const [data, setData] = useState<SolvedItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        if (!userId) return;
        axios
            .get(`/api/users/${userId}/dashboard/timeline`, { withCredentials: true })
            .then((res) => {
                const fetched = res.data.result.data as SolvedItem[];
                setData(fetched);

                const sortedDates = Array.from(new Set(fetched.map(item => item.date)))
                    .sort((a, b) => b.localeCompare(a));

                if (sortedDates.length > 0) {
                    setSelectedDate(sortedDates[0]);
                }
            })
            .catch((err) => console.error("SolvedTimeline 오류:", err));
    }, [userId]);

    const uniqueDates = Array.from(new Set(data.map(item => item.date)))
        .sort((a, b) => b.localeCompare(a));

    const filteredItems = selectedDate
        ? data.filter(item => item.date === selectedDate)
        : [];

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const pagedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (data.length === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "22.2rem",
                    color: "#999",
                    fontSize: "1rem",
                }}
            >
                풀이 기록이 없습니다 😢
            </div>
        );
    }

    return (
        <div style={{ display: "flex" }}>
            {/* 🎯 타임라인 */}
            <div
                style={{
                    width: "6.25rem",
                    height: "22.2rem",
                    overflowY: "auto",
                    direction: "rtl",
                    boxSizing: "border-box",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        direction: "ltr",
                        padding: "1rem 0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "50%",
                            width: "2px",
                            backgroundColor: "#ddd",
                            transform: "translateX(-50%)",
                            zIndex: 0,
                        }}
                    />
                    {uniqueDates.map((date) => (
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
                                zIndex: 1,
                            }}
                        >
                            <div
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        selectedDate === date ? "rgb(255, 192, 120)" : "#ccc",
                                    marginBottom: 6,
                                }}
                                title={date}
                            />
                            <div
                                style={{
                                    fontSize: "0.75rem",
                                    color: selectedDate === date ? "rgb(255, 192, 120)" : "#888",
                                }}
                            >
                                {(() => {
                                    const currentYear = new Date().getFullYear().toString();
                                    const [year, month, day] = date.split("-");
                                    return year !== currentYear
                                        ? `${year.slice(2)}-${month}-${day}`
                                        : `${month}-${day}`;
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 📋 문제 테이블 */}
            <div style={{ flex: 1, padding: "0.5rem" }}>
                {selectedDate && (
                    <div>
                        {pagedItems.length > 0 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                                <thead>
                                <tr style={{ backgroundColor: "#f5f5f5" }}>
                                    <th
                                        style={{
                                            padding: "0.6rem",
                                            border: "0.5px solid #eee",
                                            fontWeight: "normal",
                                            textAlign: "center",
                                            width: "40%",
                                        }}
                                    >
                                        카테고리
                                    </th>
                                    <th
                                        style={{
                                            padding: "0.6rem",
                                            border: "0.5px solid #eee",
                                            fontWeight: "normal",
                                            textAlign: "center",
                                            width: "60%",
                                        }}
                                    >
                                        워게임명
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {pagedItems.map((item, idx) => (
                                    <tr key={`${item.name}-${idx}`}>
                                        <td
                                            style={{
                                                padding: "0.6rem",
                                                border: "1px solid #eee",
                                                textAlign: "center",
                                            }}
                                        >
                                            {item.category}
                                        </td>
                                        <td
                                            style={{
                                                padding: "0.6rem",
                                                border: "1px solid #eee",
                                                textAlign: "center",
                                            }}
                                        >
                                            {item.name}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>해당 날짜에 풀이한 문제가 없습니다.</p>
                        )}

                        {totalPages > 1 && (
                            <div style={{ marginTop: "2rem", textAlign: "center" }}>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        style={{
                                            margin: "0px 0.25rem",
                                            padding: "0.4rem 0.75rem",
                                            backgroundColor:
                                                i + 1 === currentPage ? "rgb(255, 192, 120)" : "#f0f0f0",
                                            color: i + 1 === currentPage ? "white" : "#333",
                                            border: "none",
                                            outline: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontWeight: "bold",
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