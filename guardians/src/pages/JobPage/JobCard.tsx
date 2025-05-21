import companyIcon from "../../assets/company.png";
import locationIcon from "../../assets/location.png";

interface JobCardProps {
    title: string;
    company: string;
    region: string;
    careerLevel: string;
    employmentType: string;
    deadline: string;
}

const JobCard = ({
                     title,
                     company,
                     region,
                     careerLevel,
                     employmentType,
                     deadline,
                 }: JobCardProps) => {
    const getDday = (dateStr: string) => {
        const today = new Date();
        const deadlineDate = new Date(dateStr);
        const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 ? `D-${diff}` : "마감됨";
    };

    return (
        <div
            style={{
                backgroundColor: "rgba(243,243,243,0.66)",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 0.25rem 0.625rem rgba(0, 0, 0, 0.04)",
                transition: "box-shadow 0.2s",
                display: "flex",
                gap: "1.25rem",
                height: "11.5rem",
                alignItems: "center",
                border: "1px solid rgba(200, 200, 200, 0.5)", // ✅ 테두리 추가
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 0.3rem 0.6rem rgba(255, 140, 0, 0.25)") // 주황빛
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0.25rem 0.625rem rgba(0, 0, 0, 0.04)")
            }
        >
            {/* 🔶 좌측 상단 D-Day 표시 */}
            <div
                style={{
                    position: "absolute",
                    top: "0.7rem",
                    right: "1rem",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "#bdbdbd",
                }}
            >
                {getDday(deadline)}
            </div>

            {/* 🔶 왼쪽 로고 */}
            <div
                style={{
                    marginTop: "1.1rem",
                    marginLeft: "1.1rem",
                    width: "8rem",
                    height: "8rem",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "0.5rem",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "orange",
                }}
            >
                Logo
            </div>

            {/* 🔶 오른쪽 텍스트 정보 */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                {/* 🔸 직무 제목 */}
                <div
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textAlign: "left",
                        letterSpacing: "0.02em",
                        marginBottom: "1.8rem",
                    }}
                >
                    {title}
                </div>

                {/* 🔸 회사명 + 지역 한 줄 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem", // ✅ 줄 간격 확대
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: "#222",
                        }}
                    >
                        <img
                            src={companyIcon}
                            alt="회사"
                            style={{
                                width: "1.05em",
                                height: "1.05em",
                                verticalAlign: "middle",
                                marginTop: "-1px",
                            }}
                        />
                        {company}
                    </span>

                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.1rem",
                            fontSize: "0.9rem",
                            color: "#555",
                        }}
                    >
                        <img
                            src={locationIcon}
                            alt="지역"
                            style={{
                                width: "1.05em",
                                height: "1.05em",
                                verticalAlign: "middle",
                                marginTop: "-1px",
                            }}
                        />
                        {region}
                    </span>
                </div>

                {/* 🔸 고용형태 + 경력 (이모지 제거하고 중간 점 추가) */}
                <div
                    style={{
                        fontSize: "0.9rem",
                        color: "#555",
                        display: "flex",
                        gap: "0.6rem",
                        marginLeft: "0.15rem",
                    }}
                >
                    <span>{employmentType}</span>
                    <span style={{ color: "#ccc" }}>·</span>
                    <span>{careerLevel}</span>
                </div>
            </div>
        </div>
    );
};

export default JobCard;