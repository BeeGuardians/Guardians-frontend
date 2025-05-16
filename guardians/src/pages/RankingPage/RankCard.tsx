// RankCard 컴포넌트 props 타입 정의
interface RankCardProps {
    rank: number;         // 순위
    username: string;     // 사용자 이름
    score: number;        // 점수
    totalSolved: number;  // 푼 문제 수
    userProfileUrl: string;
}

// 랭킹 카드 UI 컴포넌트
const RankCard: React.FC<RankCardProps> = ({ rank, username, score, totalSolved, userProfileUrl }) => {
    return (
        <div
            style={{
                width: "200px",                // 카드 너비
                padding: "1rem",              // 카드 내부 여백
                borderRadius: "12px",         // 모서리 둥글게
                backgroundColor: "#fff",      // 배경 흰색
                textAlign: "center",          // 가운데 정렬
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // 그림자 효과
            }}
        >
            {/* 순위 텍스트 */}
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.2rem" }}>
                {rank}위
            </div>

            {/* 🧑 프로필 이미지 (없으면 회색 원) */}
            <div
                style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto",
                    marginBottom: "1rem",
                    backgroundColor: "#ddd", // 이미지 없을 때 대비
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
                        e.currentTarget.src = "/default-profile.png"; // 기본 이미지 경로 설정
                    }}
                />
            </div>

            {/* 사용자 이름 표시 */}
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{username}</p>

            {/* 📊 점수 및 푼 문제 수 영역 */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    padding: '0 0.5rem',
                    fontSize: '0.9rem',
                    marginBottom: "0.7rem",
                    color: '#555',
                }}
            >
                {/* 점수 표시 */}
                <div>
                    <div>{score.toLocaleString()}</div> {/* 1000단위 쉼표 */}
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>랭크 점수</div>
                </div>

                {/* 수직 구분선 */}
                <div style={{
                    width: '1px',
                    backgroundColor: '#ccc',
                    margin: '0 1rem',
                }} />

                {/* 푼 문제 수 */}
                <div>
                    <div>{totalSolved}</div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>푼 문제 수</div>
                </div>
            </div>
        </div>
    );
}

export default RankCard;