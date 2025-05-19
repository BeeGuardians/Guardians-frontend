import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

type WargameRow = {
    id: number;
    title: string;
    category: string;
    level: string;
    solved: boolean;
};
// 이 타입 추가
type RawWargameItem = {
    id: number;
    title: string;
    category: number;
    difficulty: string;
    solved: boolean;
};

function WargameTable() {
    const [data, setData] = useState<WargameRow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE}/api/wargames`)
            .then((res) => {
                const rawData = res.data.result.data;

                const categoryMap: Record<number, string> = {
                    1: "웹",
                    2: "리버싱",
                    3: "포렌식",
                    4: "암호",
                    5: "시스템",
                };

                const transformed: WargameRow[] = rawData.map((item: RawWargameItem) => ({
                    id: item.id,
                    title: item.title,
                    category: categoryMap[item.category] || "기타",
                    level: item.difficulty || "알 수 없음",
                    solved: item.solved,
                }));

                setData(transformed);
            })
            .catch((err) => {
                console.error("데이터 불러오기 실패:", err);
            });
    }, []);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div
            style={{
                backgroundColor: "white",
                paddingBottom: "1rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
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
                <tr style={{ textAlign: "left", fontSize: "0.9rem", color: "#555" }}>
                    <th style={{ ...thStyle, width: "10%" }}>상태</th>
                    <th style={{ ...thStyle, width: "55%" }}>문제</th>
                    <th style={{ ...thStyle, width: "15%" }}>분야</th>
                    <th style={{ ...thStyle, width: "20%" }}>난이도</th>
                </tr>
                </thead>
                <tbody>
                {currentData.map((row) => (
                    <tr
                        key={row.id}
                        style={{
                            backgroundColor: "white",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                            cursor: "pointer",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fcddb6")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
                        onClick={() => navigate(`/wargame/${row.id}`)}
                    >
                        <td style={{ ...tdStyle, color: "#0c8", fontWeight: 600 }}>
                            {row.solved ? "해결" : ""}
                        </td>
                        <td style={tdStyle}>{row.title}</td>
                        <td style={tdStyle}>{row.category}</td>
                        <td style={tdStyle}>{row.level}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이징 */}
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{
                            margin: "0 0.25rem",
                            padding: "0.4rem 0.75rem",
                            backgroundColor: currentPage === i + 1 ? "#FFC078" : "#f0f0f0",
                            color: currentPage === i + 1 ? "white" : "black",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

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

export default WargameTable;
