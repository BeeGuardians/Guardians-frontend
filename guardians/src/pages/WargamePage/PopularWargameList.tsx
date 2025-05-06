import { Link } from "react-router-dom";

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
        <div
            style={{
                width: "330px",
                marginTop: "1rem",
                backgroundColor: "#fff",
                borderRadius: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
        >
            <h3
                style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "#333",
                }}
            >
                🔥 인기 워게임 TOP 10
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {popularWargames.map((wargame, index) => (
                    <li
                        key={wargame.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0.75rem 1rem",
                            borderRadius: "0.6rem",
                            marginBottom: "0.5rem",
                            backgroundColor: "#fafafa",
                            transition: "background 0.2s",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fff4e6")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fafafa")
                        }
                    >
                        <span
                            style={{
                                fontWeight: 800,
                                fontSize: "1rem",
                                marginRight: "0.8rem",
                                color: rankColors[index] || "#FFA94D",
                            }}
                        >
                            {index + 1}.
                        </span>
                        <Link
                            to={`/wargames/${wargame.id}`}
                            style={{
                                textDecoration: "none",
                                color: "#444",
                                fontSize: "0.95rem",
                                fontWeight: 600,
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
