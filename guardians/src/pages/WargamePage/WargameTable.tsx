import { useState } from "react";
import { useNavigate } from "react-router-dom";

type WargameRow = {
    id: number;
    title: string;
    categoryName: string;
    difficulty: string;
    solved: boolean;
};

function WargameTable({ data }: { data: WargameRow[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div style={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
        }}>
            <table style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 8px",
            }}>
                <thead>
                <tr style={{ textAlign: "left", fontSize: "0.9rem", color: "#555" }}>
                    <th style={thStyle}>상태</th>
                    <th style={thStyle}>문제</th>
                    <th style={thStyle}>분야</th>
                    <th style={thStyle}>난이도</th>
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
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcddb6"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
                        onClick={() => navigate(`/wargame/${row.id}`)}
                    >
                        <td style={{ ...tdStyle, color: "#0c8", fontWeight: 600 }}>
                            {row.solved ? "해결" : ""}
                        </td>
                        <td style={tdStyle}>{row.title}</td>
                        <td style={tdStyle}>{row.categoryName}</td>
                        <td style={tdStyle}>{row.difficulty}</td>
                    </tr>
                ))}
                </tbody>
            </table>

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
