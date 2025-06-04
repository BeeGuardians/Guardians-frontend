import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaRegCalendarAlt } from "react-icons/fa";

interface SolvedInfo {
    wargameId: number;
    title: string;
    category: string;
    score: number;
    solvedAt: string;
}

type DailySolvedCount = {
    dayLabel: string;
    count: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const getWeekRange = (date: Date) => {
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((day + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
};

const getDayLabel = (date: Date) => dayLabels[date.getDay()];

const getISOWeekNumberInMonth = (date: Date): { year: number; month: number; week: number } => {
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((monday.getDay() + 6) % 7));
    const thursday = new Date(monday);
    thursday.setDate(monday.getDate() + 3);
    const targetMonth = thursday.getMonth();
    const targetYear = thursday.getFullYear();

    const firstOfMonth = new Date(targetYear, targetMonth, 1);
    while (firstOfMonth.getDay() !== 4) {
        firstOfMonth.setDate(firstOfMonth.getDate() + 1);
    }
    const firstWeekMonday = new Date(firstOfMonth);
    firstWeekMonday.setDate(firstOfMonth.getDate() - 3);

    const diff = monday.getTime() - firstWeekMonday.getTime();
    const weekNumber = Math.floor(diff / (7 * 86400000)) + 1;

    return {
        year: targetYear,
        month: targetMonth + 1,
        week: weekNumber,
    };
};

const SolvedLineChart = () => {
    const { user } = useAuth();
    const userId = user?.id;
    const [solvedList, setSolvedList] = useState<SolvedInfo[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
        };
        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCalendar]);

    useEffect(() => {
        if (!userId) return;
        axios
            .get(`${API_BASE}/api/users/${userId}/solved`, { withCredentials: true })
            .then((res) => {
                setSolvedList(res.data.result.data.solvedList);
            })
            .catch((err) => {
                console.error("문제 목록 불러오기 실패:", err);
            });
    }, [userId]);

    const weeklyData: DailySolvedCount[] = useMemo(() => {
        const { start } = getWeekRange(selectedDate);
        const dailyCountMap: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dailyCountMap[getDayLabel(date)] = 0;
        }

        solvedList.forEach((item) => {
            const date = new Date(item.solvedAt);
            const { start, end } = getWeekRange(selectedDate);
            if (date >= start && date <= end) {
                const label = getDayLabel(date);
                if (label in dailyCountMap) {
                    dailyCountMap[label]++;
                }
            }
        });

        return Object.entries(dailyCountMap).map(([dayLabel, count]) => ({
            dayLabel,
            count,
        }));
    }, [solvedList, selectedDate]);

    const handlePrevWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    const handleNextWeek = () => {
        const now = new Date();
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 7);
        if (nextDate > now) return;
        setSelectedDate(nextDate);
    };

    const { month, year, week } = getISOWeekNumberInMonth(selectedDate);
    const weekTitle = `${year !== new Date().getFullYear() ? `${year}년 ` : ""}${month}월 ${week}주차`;

    // ❗ 버튼 스타일: 얇고 작게, 밑줄만 있는 심플한 형태
    const arrowButtonStyle = (type: "prev" | "next"): React.CSSProperties => ({
        background: "none",
        border: "none",
        borderBottom: `1px solid ${hoveredButton === type ? "#ffa94d" : "#ccc"}`,
        fontSize: "1rem", // 작게 줄임
        color: hoveredButton === type ? "#ffa94d" : "#333",
        cursor: "pointer",
        padding: "0.5rem 0.8rem",
        lineHeight: 1,
        transition: "all 0.2s",
        outline: "none", // ✅ 포커스 시 까만 테두리 제거
    });

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* 상단 네비게이션 영역 */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <button
                    onClick={handlePrevWeek}
                    style={arrowButtonStyle("prev")}
                    onMouseEnter={() => setHoveredButton("prev")}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    ❮
                </button>

                <span
                    style={{
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: "#666",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                    onClick={() => setShowCalendar((prev) => !prev)}
                >
                    {weekTitle}
                    <FaRegCalendarAlt size={16} />
                </span>

                <button
                    onClick={handleNextWeek}
                    style={arrowButtonStyle("next")}
                    onMouseEnter={() => setHoveredButton("next")}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    ❯
                </button>

                {showCalendar && (
                    <div
                        ref={calendarRef}
                        style={{
                            position: "absolute",
                            top: "2.5rem",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 999,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Calendar
                            locale="ko-KR"
                            onChange={(date) => {
                                setSelectedDate(date as Date);
                                setShowCalendar(false);
                            }}
                            value={selectedDate}
                            formatDay={(_, date) => String(date.getDate())}
                            maxDate={new Date()}  // ✅ 오늘 날짜까지만 선택 가능
                        />
                    </div>
                )}
            </div>

            {/* 그래프 */}
            <div
                style={{
                    height: "85%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={weeklyData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dayLabel" tickMargin={10} />
                        <YAxis allowDecimals={false} tickMargin={10} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="rgb(255, 192, 120)"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#fff", stroke: "rgb(255, 192, 120)", strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SolvedLineChart;
