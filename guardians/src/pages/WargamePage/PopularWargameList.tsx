import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PopularWargameList() {
    const [popularWargames, setPopularWargames] = useState<
        { wargameId: number; title: string; solveCount: number }[]
    >([]);

    const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // 금, 은, 동

    useEffect(() => {
        axios
            .get("/api/wargames/hot")
            .then((res) => {
                setPopularWargames(res.data.result.data || []);
            })
            .catch((err) => {
                console.error("🔥 핫 워게임 로딩 실패:", err);
            });
    }, []);

    return (
        <div
            style={{
                width: "340px",
                backgroundColor: "transparent",
            }}
        >
            <h3
                style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "#ff6b00",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                }}
            >
                <span style={{ fontSize: "1.6rem" }}>🔥</span> 현재 핫한 워게임
            </h3>

            <ul style={{ padding: 0, margin: 0 }}>
                {popularWargames.map((wargame, index) => (
                    <li
                        key={wargame.wargameId}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0.75rem",
                            borderRadius: "0.6rem",
                            marginBottom: "0.4rem",
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease-in-out",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fff5e8")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.6)")
                        }
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                backgroundColor: rankColors[index] || "#FFA94D",
                                color: "#fff",
                                fontWeight: "bold",
                                textAlign: "center",
                                lineHeight: "28px",
                                marginRight: "0.8rem",
                                fontSize: "0.9rem",
                            }}
                        >
                            {index + 1}
                        </span>
                        <Link
                            to={`/wargame/${wargame.wargameId}`}
                            style={{
                                textDecoration: "none",
                                color: "#333",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                            }}
                        >
                            {wargame.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PopularWargameList;
