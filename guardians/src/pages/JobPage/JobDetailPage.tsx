import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../community/components/QnaDetailPage.module.css";

// 이미지 아이콘 import
import locationIcon from "../../assets/location2.png";
import moneyIcon from "../../assets/money.png";
import employeeIcon from "../../assets/employee.png";
import careerIcon from "../../assets/career.png";
import calendarIcon from "../../assets/calendar.png";
import company2Icon from "../../assets/company2.png";

interface ResJobDto {
    id: number;
    companyName: string;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    careerLevel: string;
    salary: string;
    deadline: string;
}

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<ResJobDto | null>(null);

    useEffect(() => {
        if (!id) return;
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${id}`, {
                withCredentials: true,
            })
            .then((res) => {
                setJob(res.data.result.data);
            })
            .catch((err) => {
                console.error("채용공고 상세 조회 실패:", err);
            });
    }, [id]);

    if (!job) return <div>로딩 중...</div>;

    const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                width: "22rem",
                minHeight: "1.8rem",
            }}
        >
            <img
                src={icon}
                alt={label}
                style={{ width: "1.1em", height: "1.1em", marginRight: "0.4rem" }}
            />
            <span style={{ fontSize: "1rem" }}>{label}:</span>
            <span style={{ marginLeft: "0.5rem", fontWeight: 500 }}>{value}</span>
        </div>
    );

    return (
        <div style={{ padding: "3rem 6vw", maxWidth: "900px", margin: "0 auto" }}>
            {/* 🔙 뒤로가기 버튼 */}
            <button
                className={styles.backBtn}
                onClick={() => navigate(-1)}
                style={{ marginBottom: "2rem" }}
            >
                ← 뒤로가기
            </button>

            {/* 🔶 상단 제목 + 로고 */}
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                <div
                    style={{
                        width: "10rem",
                        height: "9rem",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "0.5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "orange",
                    }}
                >
                    Logo
                </div>
                <div>
                    <h2 style={{ margin: "0 0 0.5rem 0" }}>{job.title}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "1.7rem" }}>
                        <img
                            src={company2Icon}
                            alt="회사"
                            style={{
                                width: "1em",
                                height: "1em",
                                verticalAlign: "middle",
                            }}
                        />
                        <p style={{ fontSize: "1..5rem", fontWeight: 500, margin: 0 }}>{job.companyName}</p>
                    </div>
                </div>
            </div>

            {/* 🔶 정보 섹션 */}
            <div
                style={{
                    backgroundColor: "rgba(243,243,243,0.66)",
                    padding: "2rem",
                    margin: "3rem 0 2.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    lineHeight: "1.7rem",
                    border: "1px solid #ddd",
                }}
            >
                <div style={{ display: "flex", gap: "3.5rem", marginBottom: "1.2rem" }}>
                    <InfoRow icon={locationIcon} label="근무 위치" value={job.location} />
                    <InfoRow icon={moneyIcon} label="연봉 조건" value={`${job.salary} 이상`} />
                </div>
                <div style={{ display: "flex", gap: "3.5rem", marginBottom: "1.2rem" }}>
                    <InfoRow icon={employeeIcon} label="고용 형태" value={job.employmentType} />
                    <InfoRow icon={careerIcon} label="경력 조건" value={job.careerLevel} />
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        width: "22rem",
                        minHeight: "1.8rem",
                        marginTop: "0.8rem",
                    }}
                >
                    <img src={calendarIcon} alt="마감일" style={{ width: "1.1em", height: "1.1em", marginRight: "0.4rem" }} />
                    <span style={{ fontSize: "1rem" }}>지원 마감일:</span>
                    <span style={{ marginLeft: "0.5rem", fontWeight: 500 }}>
                        {new Date(job.deadline).toLocaleDateString("ko-KR")}
                    </span>
                </div>
            </div>

            {/* 🔶 업무 소개 제목 */}
            <div
                style={{
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    marginBottom: "1rem",
                    color: "#333",
                }}
            >
                <span style={{ marginRight: "0.4rem" }}>📋</span>
                업무 소개
            </div>

            {/* ✅ 업무 설명 박스 */}
            <div
                style={{
                    backgroundColor: "rgba(243,243,243,0.66)",
                    padding: "2rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ddd",
                    marginBottom: "2.5rem",
                }}
            >
                <p style={{ whiteSpace: "pre-line", fontSize: "1rem", color: "#333" }}>
                    {job.description}
                </p>
            </div>
        </div>
    );
};

export default JobDetailPage;
