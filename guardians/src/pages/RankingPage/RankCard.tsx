interface RankCardProps {
    rank: number;
    nickname: string;
    score: number;
    solvedCount: number;
}

const RankCard: React.FC<RankCardProps> = ({ rank, nickname, score, solvedCount }) => {
    return (
        <div
            style={{
                width: "200px",
                padding: "1rem",
                borderRadius: "12px",
                backgroundColor: "#fff", // ✅ 배경 통일
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
        >
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.2rem"}}>{rank}위</div>
            <div
                //원
                style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: "#ddd",
                    margin: "0 auto",
                    marginBottom: "1rem"
                }}
            />
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{nickname}</p>

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
                <div>
                    <div>{score.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>랭크 점수</div>
                </div>

                <div style={{
                    width: '1px',
                    backgroundColor: '#ccc',
                    margin: '0 1rem',
                }} />


                <div>
                    <div>{solvedCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>푼 문제 수</div>
                </div>
            </div>
        </div>
    );
}

export default RankCard;
