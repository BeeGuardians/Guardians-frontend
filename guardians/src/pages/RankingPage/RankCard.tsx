import React from "react";

interface RankCardProps {
    rank: number;
    username: string;
    score: number;
    totalSolved: number;
    userProfileUrl: string;
    userId: string; // <-- userId도 prop으로 받아야 합니다.
    onClick: (userId: string) => void; // <-- 클릭 이벤트를 처리할 함수를 prop으로 받습니다.
}

const getTier = (score: number): string => {
    if (score >= 5000) return "Platinum";
    if (score >= 3500) return "Gold";
    if (score >= 2000) return "Silver";
    if (score >= 1000) return "Bronze";
    return "Bronze";
};

const RankCard: React.FC<RankCardProps> = ({
                                               rank,
                                               username,
                                               score,
                                               totalSolved,
                                               userProfileUrl,
                                               userId, // 추가된 prop
                                               onClick, // 추가된 prop
                                           }) => {
    return (
        <div
            style={{
                width: "200px",
                padding: "1rem",
                borderRadius: "12px",
                backgroundColor: "#fff",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                cursor: "pointer", // 클릭 가능함을 시각적으로 나타냅니다.
                transition: "transform 0.2s ease, box-shadow 0.2s ease", // 호버 효과 추가
            }}
            onClick={() => onClick(userId)} // 카드 전체 클릭 시 onClick 함수 호출
            onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
            }}
        >
            {/* 순위 텍스트 */}
            <div style={{fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.2rem"}}>
                {rank}위
            </div>

            {/* 🧑 프로필 이미지 */}
            <div
                style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto",
                    marginBottom: "1rem",
                    backgroundColor: "#ddd",
                }}
            >
                <img
                    src={userProfileUrl}
                    alt="profile"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                    onError={(e) => {
                        e.currentTarget.src = "/default-profile.png";
                    }}
                />
            </div>

            {/* 닉네임 */}
            <p style={{marginTop: '0.5rem', fontWeight: 'bold'}}>{username}</p>

            {/* 티어 뱃지 */}
            <div
                style={{
                    fontSize: "0.8rem",
                    color: "#888",
                    marginTop: "0.2rem",
                    backgroundColor: "#f0f0f0",
                    display: "inline-block",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                }}
            >
                {getTier(score)}
            </div>

            {/* 점수 및 푼 문제 수 */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.8rem',
                    padding: '0 0.5rem',
                    fontSize: '0.9rem',
                    marginBottom: "0.7rem",
                    color: '#555',
                }}
            >
                <div>
                    <div>{score.toLocaleString()}</div>
                    <div style={{fontSize: '0.8rem', color: '#999'}}>랭크 점수</div>
                </div>

                <div style={{
                    width: '1px',
                    backgroundColor: '#ccc',
                    margin: '0 1rem',
                }}/>

                <div>
                    <div>{totalSolved}</div>
                    <div style={{fontSize: '0.8rem', color: '#999'}}>푼 문제 수</div>
                </div>
            </div>
        </div>
    );
};

export default RankCard;