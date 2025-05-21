// dashboard/SolvedLineChart.tsx

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface SolvedInfo {
    wargameId: number;
    title: string;
    category: string;
    score: number;
    solvedAt: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const parseLocalDate = (dateStr: string): Date => {
    if (!dateStr || !dateStr.includes("T")) {
        console.warn("Invalid date string:", dateStr);
        return new Date();
    }

    const [datePart, timePart] = dateStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
};


const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
};

const SolvedLineChart = () => {
    const { user } = useAuth();
    const userId = user?.id;

    const now = new Date();
    const currentYear = now.getFullYear();

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(5);
    const [solvedList, setSolvedList] = useState<SolvedInfo[]>([]);

    const handlePrevMonth = () => {
        if (month === 1) {
            setYear(prev => prev - 1);
            setMonth(12);
        } else {
            setMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year > currentYear || (year === currentYear && month >= currentMonth)) {
            return; // ✅ 미래 달로 넘어가지 않도록 막기
        }

        if (month === 12) {
            setYear(prev => prev + 1);
            setMonth(1);
        } else {
            setMonth(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (!userId) return;
        axios
            .get(`${API_BASE}/api/users/${userId}/solved`, { withCredentials: true })
            .then((res) => {
                const list: SolvedInfo[] = res.data.result.data.solvedList;
                console.log("📦 받아온 solvedList:", list.map((l) => l.solvedAt));
                setSolvedList(list);
            })
            .catch((err) => {
                console.error("문제 목록 불러오기 실패:", err);
            });
    }, [userId]);

    const weeklyData = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        solvedList.forEach((item) => {
            const date = parseLocalDate(item.solvedAt); // ✅ 변경
            if (date.getFullYear() !== year || date.getMonth() + 1 !== month) return;
            const week = getWeekOfMonth(date);
            if (week >= 1 && week <= 5) counts[week - 1]++;
        });
        return counts.map((count, i) => ({
            week: `${i + 1}주차`,
            count,
        }));
    }, [solvedList, year, month]);

    const label = `${year !== currentYear ? `${year}년 ` : ""}${month}월에 푼 문제 수`;

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <button onClick={handlePrevMonth}>〈</button>
                <span style={{ margin: "0 1rem", fontWeight: "bold" }}>{label}</span>
                <button onClick={handleNextMonth}>〉</button>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis allowDecimals={false} domain={[0, Math.max(...weeklyData.map(d => d.count), 5)]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#28a745"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#fff", stroke: "#000", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SolvedLineChart;