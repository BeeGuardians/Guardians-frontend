import { useEffect, useState } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import axios from "axios";

interface CategoryScore {
    category: string;
    normalizedScore: number;
}

interface RadarChartProps {
    userId: number;
}

const RadarChartComponent = ({ userId }: RadarChartProps) => {
    const [data, setData] = useState<CategoryScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios
            .get(`/api/users/${userId}/dashboard/radar`, { withCredentials: true })
            .then((res) => {
                setData(res.data.result.data);
            })
            .catch((err) => {
                setError(true);
                console.error("RadarChart 오류:", err);
            })
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <div>로딩 중...</div>;
    if (error || data.length === 0) return <div>데이터 없음 😢</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart
                cx="50%"
                cy="58%" // 아래로 조금 내림
                outerRadius="90%" // 기본보다 약간 축소
                data={data}
            >
                <PolarGrid stroke="#ddd" strokeDasharray="3 2" />
                <PolarAngleAxis
                    dataKey="category"
                    tick={{
                        fontSize: 13,
                        fill: "#666",
                        dy: 4, // 글자를 약간 아래로
                    }}
                    tickLine={false}
                />
                <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                    stroke="#ccc"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#fff8e1",
                        border: "1px solid #ffc078",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        color: "#333",
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}점`, "정규화 점수"]}
                />
                <Radar
                    name="정규화 점수"
                    dataKey="normalizedScore"
                    stroke="#ffa94d"
                    fill="#ffa94d"
                    fillOpacity={0.5}
                    dot={{ r: 4 }}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default RadarChartComponent;