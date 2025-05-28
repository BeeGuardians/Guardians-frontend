import companyIcon from "../../assets/company.png";

interface JobCardProps {
    title: string;
    company: string;
    region: string;
    careerLevel: string;
    employmentType: string;
    deadline: string;
    sourceUrl: string;

}

const JobCard = ({
                     title,
                     company,
                     careerLevel,
                     employmentType,
                     sourceUrl
                 }: JobCardProps) => {


    return (
        <div
            style={{
                backgroundColor: "rgba(243,243,243,0.66)",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 0.25rem 0.625rem rgba(0, 0, 0, 0.04)",
                transition: "box-shadow 0.2s",
                flexDirection: "column",
                alignItems: "center",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 0.3rem 0.6rem rgba(255, 140, 0, 0.25)") // 주황빛
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0.25rem 0.625rem rgba(0, 0, 0, 0.04)")
            }
        >

            {/* 🔶 로고 */}
            <div
                style={{
                    width: "16rem",
                    height: "13rem",
                    justifyContent: "center",
                    alignItems: "center",
                    objectFit: "cover",
                }}
            >
                <img
                    src={sourceUrl}
                    alt="로고"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
            </div>

            {/* 🔶 아래 텍스트 정보 */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >

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
                                marginLeft: "0.3rem",

                            }}
                        />
                        {company}
                    </span>

                </div>
                {/* 🔸 직무 제목 */}
                <div
                    style={{
                        fontSize: "1.3rem",
                        fontWeight: 600,
                        textAlign: "left",
                        letterSpacing: "0.02em",
                        marginBottom: "1rem",
                        marginLeft: "0.3rem",

                    }}
                >
                    {title}
                </div>
                {/* 🔸 고용형태 + 경력 (이모지 제거하고 중간 점 추가) */}
                <div
                    style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        display: "flex",
                        gap: "0.6rem",
                        marginLeft: "0.3rem",

                    }}
                >
                    <span>{employmentType}, {careerLevel}</span>
                </div>
            </div>
        </div>
    );
};

export default JobCard;