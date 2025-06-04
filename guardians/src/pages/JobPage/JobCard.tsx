import companyIcon from "../../assets/company.png"; // 이 파일은 실제 경로에 존재해야 합니다.

interface JobCardProps {
    title: string;
    company: string;
    region: string;
    careerLevel: string;
    employmentType: string;
    deadline: string;
    sourceUrl: string; // 회사 로고 이미지 URL로 가정
}

const JobCard = ({
                     title,
                     company,
                     region,
                     careerLevel,
                     employmentType,
                     deadline,
                     sourceUrl,
                 }: JobCardProps) => {
    const tagStyle = {
        backgroundColor: "#f0f2f5",
        color: "#596773",
        padding: "0.25rem 0.5rem", // 태그 패딩 살짝 줄임
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: 500,
        display: 'inline-block',
    };

    const textInfoStyle = {
        fontSize: "0.8rem", // 폰트 크기 살짝 줄임
        color: "#555e68",
        marginBottom: "0.4rem", // 하단 마진 줄임
    };

    const iconStyle = {
        width: "0.9em", // 아이콘 크기 살짝 줄임
        height: "0.9em",
        opacity: 0.7,
        marginRight: "0.3rem",
    };

    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "1.2rem", // 카드 내부 패딩 줄임
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.07)",
                transition: "box-shadow 0.25s ease-out, transform 0.25s ease-out",
                display: 'flex',
                flexDirection: 'column',
                // height: '100%', // 제거하여 내용에 맞게 높이 조절
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 160, 0, 0.2)";
                e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.07)";
                e.currentTarget.style.transform = "translateY(0px)";
            }}
        >
            {/* 🖼️ 로고 영역 */}
            <div
                style={{
                    width: "100%",
                    height: "7rem", // 로고 영역 높이 줄임 (10rem -> 7rem)
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "1rem", // 하단 마진 줄임 (1.5rem -> 1rem)
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            >
                <img
                    src={sourceUrl}
                    alt={`${company} 로고`}
                    style={{
                        maxWidth: "80%",
                        maxHeight: "75%", // 로고가 차지하는 비율 살짝 늘림 (70% -> 75%)
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* 📝 텍스트 정보 영역 */}
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* 회사명 (아이콘 유지) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <img src={companyIcon} alt="회사" style={iconStyle} />
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "#343a40" }}> {/* 폰트 크기 살짝 줄임 */}
                        {company}
                    </span>
                </div>

                {/* 지역 정보 (텍스트만) */}
                <div style={{ ...textInfoStyle}}> {/* 하단 마진 조정 */}
                    <span style={{ color: "#555e68" }}>{region}</span>
                </div>

                {/* 직무 제목 */}
                <h3
                    style={{
                        fontSize: "1.1rem", // 폰트 크기 줄임 (1.2rem -> 1.1rem)
                        fontWeight: 700,
                        color: "#212529",
                        marginBottom: "0.75rem", // 하단 마진 줄임 (1rem -> 0.75rem)
                        lineHeight: 1.35,      // 줄 간격 미세 조정
                        minHeight: "calc(1.35em * 2)", // 2줄 높이 확보 (폰트 크기 및 줄간격에 맞춰짐)
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {title}
                </h3>

                {/* 태그: 고용형태 + 경력 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}> {/* 하단 마진 줄임, 태그 간격 줄임 */}
                    <span style={tagStyle}>{employmentType}</span>
                    <span style={tagStyle}>{careerLevel}</span>
                </div>

                {/* 마감일 정보 (텍스트만) */}
                <div style={{ ...textInfoStyle, marginTop: 'auto' }}> {/* textInfoStyle의 marginBottom이 적용됨 */}
                    <span style={{ color: "#777" }}>마감: {new Date(deadline).toLocaleDateString("ko-KR")}</span>
                </div>
            </div>
        </div>
    );
};

export default JobCard;