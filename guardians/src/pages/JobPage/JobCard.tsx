// ✅ JobCard.tsx - 카드 간격 최적화 & 고정 너비 유지

interface JobCardProps {
    region: string;
    title: string;
    company: string;
    id: number;
}

    const JobCard = ({ region, title, company }: JobCardProps) => {
        return (
            <div
                style={{
                    flex: "1 1 calc(33% - 2rem)",
                    aspectRatio: "4 / 3",
                    borderRadius: "1rem",
                    backgroundColor: "#f3f3f3",
                    padding: "1rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#fff",
                        height: "50%",
                        borderRadius: "0.5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 700,
                        marginBottom: "0.75rem",
                    }}
                >
                    Logo
                </div>
                <div style={{ fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: "0.9rem", color: "#555" }}>{company}</div>
                <div style={{ fontSize: "0.9rem", color: "#555" }}>{region}</div>
            </div>
        );
    };

    export default JobCard;