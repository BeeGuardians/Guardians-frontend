import {Link} from "react-router-dom";

function PopularWargameList() {
    const popularWargames = [
        { id: 1, title: "SQL Injection 초급" },
        { id: 2, title: "XSS Basic" },
        { id: 3, title: "Forensic 입문" },
        { id: 4, title: "Reverse Engineering 101" },
        { id: 5, title: "System Exploit 초급" },
        { id: 6, title: "Crypto Baby" },
        { id: 7, title: "Webhacking 중급" },
        { id: 8, title: "Forensic 메모리덤프" },
        { id: 9, title: "XSS Stored" },
        { id: 10, title: "SQL Injection Blind" },
    ];

    const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // 금, 은, 동

    return (
        <div style={{
            width: "340px",
            backgroundColor: "transparent",
            // padding: "1rem 0",
        }}>
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
                        key={wargame.id}
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
                            to={`/wargame/${wargame.id}`}
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
