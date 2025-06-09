import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {AiOutlineInfoCircle} from "react-icons/ai";

function PopularWargameList() {
    const [popularWargames, setPopularWargames] = useState<
        { wargameId: number; title: string; solveCount: number }[]
    >([]);

    const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // 금, 은, 동
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        axios
            // .get(`${import.meta.env.VITE_API_BASE_URL}/api/wargames/hot")
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
                <span style={{ fontSize: "1.6rem" }}>🔥</span>
                현재 핫한 워게임
                <div style={{ position: 'relative', marginLeft: '0.25rem', display: 'flex', alignItems: 'center' }}>
                    <AiOutlineInfoCircle
                        size={18}
                        color="#888"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        style={{ cursor: "pointer" }}
                    />
                    {showTooltip && (
                        <div style={{
                            position: "absolute",
                            bottom: "120%", // 아이콘 위로 툴팁이 뜨도록 설정
                            left: "50%",
                            transform: "translateX(-50%)", // 가운데 정렬
                            background: "#4d4d4d",
                            color: "#fff",
                            padding: "0.5rem 0.8rem",
                            borderRadius: "8px",
                            zIndex: 10,
                            fontSize: "0.85rem",
                            fontWeight: 300,
                            whiteSpace: "nowrap",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                        }}>
                            가장 많은 유저들이 선택하고 해결한 인기 워게임 랭킹입니다.
                        </div>
                    )}
                </div>
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
