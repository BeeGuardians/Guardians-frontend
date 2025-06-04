import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const dummyData = [
    { date: "2025-05-01", score: 1200 },
    { date: "2025-05-04", score: 1550 },
    { date: "2025-05-07", score: 1800 },
    { date: "2025-05-10", score: 2200 },
    { date: "2025-05-13", score: 2500 },
    { date: "2025-05-16", score: 3000 },
];

const ScoreTrendChart = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
                <defs>
                    <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5C7CFA" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#5C7CFA" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="score"
                    stroke="rgb(255, 192, 120)"
                    strokeWidth={2}
                    dot={false}
                    fillOpacity={1}
                    fill="rgb(255, 192, 120)"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ScoreTrendChart;