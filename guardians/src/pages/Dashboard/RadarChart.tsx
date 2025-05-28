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
                cy="54%" // 아래로 조금 내림
                outerRadius="90%" // 기본보다 약간 축소
                data={data}
            >
                <PolarGrid stroke="#ddd" strokeDasharray="3 2" />
                <PolarAngleAxis
                    dataKey="category"
                    tick={{
                        fontSize: 14,
                        fill: "#666",
                    }}
                    tickLine={false}
                />
                <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                    stroke="#ccc"
                />
                <Radar
                    name="정규화 점수"
                    dataKey="normalizedScore"
                    stroke="#4c6ef5"         // 푸른 계열 선
                    fill="#4c6ef5"
                    fillOpacity={0.4}
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: "#e8f0fe",     // 연한 파랑 배경
                        border: "1px solid #a5d8ff",    // 밝은 파랑 테두리
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        color: "#1c1c1c",               // 텍스트 컬러 (어두운 회색)
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}점`, "정규화 점수"]}
                />

            </RadarChart>
        </ResponsiveContainer>
    );
};

export default RadarChartComponent;