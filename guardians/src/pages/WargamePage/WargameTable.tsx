import { useState } from "react";

function WargameTable() {
  const data = Array.from({ length: 54 }, (_, i) => ({
    title: `문제 ${i + 1}`,
    category: "웹",
    level: i % 3 === 0 ? "쉬움" : i % 3 === 1 ? "보통" : "어려움",
    solved: i % 2 === 0,
  }));

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
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
            <th style={{ ...thStyle, width: "55%" }}>문제</th> {/* ✅ 제일 길게 */}
            <th style={{ ...thStyle, width: "15%" }}>분야</th>
            <th style={{ ...thStyle, width: "20%" }}>난이도</th>
          </tr>
          </thead>
          <tbody>
          {currentData.map((row, idx) => (
              <tr
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    borderRadius: "6px",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fcddb6")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
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
