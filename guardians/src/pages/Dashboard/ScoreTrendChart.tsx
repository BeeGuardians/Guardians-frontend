import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";

interface ScoreTrend {
    date: string;         // e.g., "2025-06-09"
    earnedScore: number;
}

const ScoreTrendChart = ({ userId }: { userId: number }) => {
    const [data, setData] = useState<ScoreTrend[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null); // 🔹 Hover 상태

    useEffect(() => {
        axios
            .get(`/api/users/${userId}/dashboard/score-trend`, { withCredentials: true })
            .then((res) => {
                const sorted = res.data.result.data.sort(
                    (a: ScoreTrend, b: ScoreTrend) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                setData(sorted);
            })
            .catch((err) => {
                console.error("점수 추이 불러오기 실패:", err);
            });
    }, [userId]);

    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth(); // 0-based
    const filteredData = data.filter((item) => {
        const date = new Date(item.date);
        return (
            date.getFullYear() === currentYear &&
            date.getMonth() === currentMonth
        );
    });

    const handlePrevMonth = () => {
        const prev = new Date(selectedDate);
        prev.setMonth(prev.getMonth() - 1);
        setSelectedDate(prev);
    };

    const handleNextMonth = () => {
        const next = new Date(selectedDate);
        next.setMonth(next.getMonth() + 1);
        if (next > new Date()) return;
        setSelectedDate(next);
    };

    const chartTitle = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`;

    const arrowButtonStyle = (type: "prev" | "next"): React.CSSProperties => ({
        background: "none",
        border: "none",
        borderBottom: `1px solid ${hoveredButton === type ? "#ffa94d" : "#ccc"}`,
        fontSize: "1rem",
        color: hoveredButton === type ? "#ffa94d" : "#333",
        cursor: "pointer",
        padding: "0.5rem 0.8rem",
        lineHeight: 1,
        transition: "all 0.2s",
        outline: "none",
    });

    return (
        <div style={{ width: "100%", position: "relative" }}>
            {/* 🔸 월 이동 네비게이션 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <button
                    onClick={handlePrevMonth}
                    style={arrowButtonStyle("prev")}
                    onMouseEnter={() => setHoveredButton("prev")}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    ❮
                </button>

                <span style={{ fontSize: "1rem", color: "#666" }}>{chartTitle}</span>

                <button
                    onClick={handleNextMonth}
                    style={arrowButtonStyle("next")}
                    onMouseEnter={() => setHoveredButton("next")}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    ❯
                </button>
            </div>

            {/* 🔸 차트 또는 안내 메시지 */}
            {filteredData.length > 0 ? (
                <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
                    <div
                        style={{
                            minWidth: `${filteredData.length * 3.5}rem`,
                            height: "20rem",
                            paddingLeft: "1rem",
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={filteredData.map((item) => ({
                                    ...item,
                                    date: item.date.slice(5),
                                }))}
                                margin={{ top: 15, right: 20, left: -15, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickMargin={10} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="earnedScore"
                                    fill="#ffa94d"
                                    radius={[4, 4, 0, 0]}
                                    barSize={22}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        height: "20rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#999",
                        fontSize: "1rem",
                    }}
                >
                    해당 월에는 풀이한 문제가 없습니다 😢
                </div>
            )}
        </div>
    );
};

export default ScoreTrendChart;