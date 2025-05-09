import { useEffect, useState } from "react";
import axios from "axios";

function ProfileCard() {
    const [info, setInfo] = useState({
        nickname: "",
        profileImageUrl: "",
        score: 0,
        rank: 0,
        solvedCount: 0,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await axios.get("/api/users/me", { withCredentials: true });
                const userId = profileRes.data.result.data.id;
                const nickname = profileRes.data.result.data.username;
                const profileImageUrl = profileRes.data.result.data.profileImageUrl;

                const statsRes = await axios.get(`/api/users/${userId}/stats`);
                const { score, rank, solvedCount } = statsRes.data.result.data;

                setInfo({ nickname, profileImageUrl, score, rank, solvedCount });
            } catch (err) {
                setError("프로필 정보를 불러오지 못했습니다.");
                console.error("ProfileCard Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div style={{ padding: "1rem" }}>⏳ 로딩 중...</div>;
    }

    if (error) {
        return <div style={{ padding: "1rem", color: "red" }}>{error}</div>;
    }

    return (
        <div
            style={{
                width: "360px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "white",
            }}
        >
            {/* 상단 닉네임 */}
            <div
                style={{
                    padding: "1rem",
                    borderBottom: "1px solid #ccc",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <span style={{ color: "#1a73e8", marginRight: "0.25rem" }}>{info.nickname}</span>
            </div>

            {/* 프사 + 정보 */}
            <div
                style={{
                    padding: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* 프사 */}
                <img
                    src={info.profileImageUrl}
                    alt="프로필"
                    style={{
                        marginLeft: "1rem",
                        width: "110px",
                        height: "110px",
                        borderRadius: "50%",
                        border: "1px solid gray",
                        objectFit: "cover",
                        flexShrink: 0,
                    }}
                />

                {/* 정보 */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        marginRight: "2rem",
                    }}
                >
                    {[
                        { label: "점수", value: `${info.score}점` },
                        { label: "랭킹", value: `${info.rank}위` },
                        { label: "해결", value: `${info.solvedCount}개` },
                    ].map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                minWidth: "110px",
                            }}
                        >
                            <span style={{ color: "#888", fontSize: "0.85rem" }}>{item.label}</span>
                            <span style={{ fontWeight: 600, fontSize: "1rem" }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
