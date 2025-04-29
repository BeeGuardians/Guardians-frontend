import { Link } from "react-router-dom";

function PopularWargameList() {
    // 임시 popular 워게임 리스트
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

    return (
        <div>
            <h3 style={{ fontSize: "1.4rem", marginLeft: "0.5rem", marginBottom: "1rem", fontWeight: 700 }}>
                🔥 인기 워게임 TOP 10
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {popularWargames.map((wargame, index) => (
                    <li key={wargame.id} style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.75rem", marginLeft: "1rem" }}>
                        <Link
                            to={`/wargames/${wargame.id}`} // ✅ 링크 경로도 수정!
                            style={{
                                textDecoration: "none",
                                fontSize: "0.95rem",
                            }}
                        >
                            {index + 1}. {wargame.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PopularWargameList;
