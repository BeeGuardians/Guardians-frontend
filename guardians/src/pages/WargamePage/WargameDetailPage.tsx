import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Wargame = {
    id: string | undefined;
    title: string;
    category: string;
    difficulty: string;
    createdAt: string;
    description: string;
};

function WargameDetailPage() {
    const { id } = useParams();
    const [wargame, setWargame] = useState<Wargame | null>(null);
    const [flag, setFlag] = useState("");

    useEffect(() => {
        // 가라데이터 세팅
        const mockData: Wargame = {
            id,
            title: "🔐 SQL Injection 초급",
            category: "Web",
            difficulty: "Easy",
            createdAt: "2025-05-01",
            description:
                "로그인 페이지에 SQL 인젝션 취약점이 존재합니다.\n관리자 권한으로 로그인해보세요!\n\n예시: `' OR '1'='1`",
        };
        setWargame(mockData);
    }, [id]);

    const submitFlag = () => {
        if (flag === "FLAG{sql_injection_success}") {
            alert("✅ 정답입니다! 고생했어요~");
        } else {
            alert("❌ 틀렸습니다! 다시 도전해보세요!");
        }
    };

    if (!wargame) return <p>로딩 중...</p>;

    return (
        <div style={{ padding: "3rem 10rem", fontFamily: "Pretendard, sans-serif" }}>
            <h1 style={{ fontWeight: 700 }}>{wargame.title}</h1>
            <div style={{ color: "#999", marginBottom: "1rem" }}>
                카테고리: {wargame.category} | 난이도: {wargame.difficulty} | 작성일: {wargame.createdAt}
            </div>

            <div
                style={{
                    backgroundColor: "#f9f9f9",
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #ddd",
                    marginBottom: "2rem",
                    lineHeight: "1.75rem",
                    whiteSpace: "pre-line",
                }}
            >
                {wargame.description}
            </div>

            <div>
                <input
                    type="text"
                    placeholder="플래그를 입력하세요"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    style={{
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #ccc",
                        marginRight: "1rem",
                        width: "300px",
                    }}
                />
                <button
                    onClick={submitFlag}
                    style={{
                        backgroundColor: "#FFA94D",
                        border: "none",
                        padding: "0.75rem 1.25rem",
                        borderRadius: "0.5rem",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    플래그 제출
                </button>
            </div>
        </div>
    );
}

export default WargameDetailPage;
