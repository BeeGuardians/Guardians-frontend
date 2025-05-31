import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import locationIcon from "../../assets/location2.png";
import moneyIcon from "../../assets/money.png";
import employeeIcon from "../../assets/employee.png";
import careerIcon from "../../assets/career.png";
import calendarIcon from "../../assets/calendar.png";

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
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<ResJobDto | null>(null);

    useEffect(() => {
        if (!id) return;
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${id}`, {
                withCredentials: true,
            })
            .then((res) => {
                setJob(res.data.result?.data || res.data.data || res.data);
            })
            .catch((err) => {
                console.error("채용공고 상세 조회 실패:", err);
            });
    }, [id]);

    if (!job) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem' }}>
                로딩 중...
            </div>
        );
    }

    return (
        <div style={{ padding: "3rem 6vw", maxWidth: "1000px", margin: "0 auto", fontFamily: 'sans-serif', backgroundColor: "#f9f9f9" }}>
            {/* 🔙 뒤로가기 버튼 (수정됨) */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    fontSize: '1.4rem',
                    color: '#888',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    marginBottom: "2rem",
                }}
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
            >
                ←
            </button>

            <div style={{ textAlign: "center", marginBottom: "3.5rem", padding: "2rem 0", background: "linear-gradient(to bottom, #ffffff, #f0f4f8)", borderRadius: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)"  }}>
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#007bff",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        margin: "0 auto 1.5rem",
                        boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)"
                    }}
                >
                    {job.companyName.charAt(0).toUpperCase()}
                </div>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "700", color: "#2c3e50", marginBottom: "0.7rem" }}>
                    {job.title}

                </h1>
                <p style={{ fontSize: "1.2rem", color: "#555e68" }}>{job.companyName}</p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", marginBottom: "3rem", justifyContent: "center" }}>
                {[
                    { icon: locationIcon, label: "근무 위치", value: job.location },
                    { icon: moneyIcon, label: "연봉 조건", value: `${job.salary} 이상` },
                    { icon: employeeIcon, label: "고용 형태", value: job.employmentType },
                    { icon: careerIcon, label: "경력 조건", value: job.careerLevel },
                    { icon: calendarIcon, label: "지원 마감일", value: new Date(job.deadline).toLocaleDateString("ko-KR") }
                ].map((item, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: "#fff",
                            border: "1px solid #e0e0e0",
                            borderRadius: "0.4rem",
                            padding: "1rem 1.3rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                            flex: "1 1 200px",
                            minWidth: "200px",
                            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.08)";
                        }}
                    >
                        <img src={item.icon} alt={item.label} style={{ width: "1.3rem", height: "1.3rem", opacity: 0.75 }} />
                        <div>
                            <span style={{ fontSize: "0.85rem", color: "#777", display: "block", marginBottom:"0.2rem" }}>{item.label}</span>
                            <span style={{ fontSize: "1rem", fontWeight: "600", color: "#333" }}>{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#2c3e50", marginBottom: "1.2rem", borderBottom: "2px solid #FFB74D", paddingBottom: "0.5rem" }}>
                    <span style={{ marginRight: "0.5rem" }}>📋</span>
                    업무 소개
                </h3>
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "2rem",
                        borderRadius: "0.4rem",
                        border: "1px solid #e0e0e0",
                        lineHeight: "1.7rem",
                        color: "#34495e",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.06)",
                        whiteSpace: "pre-line",
                        fontSize: "1rem",
                    }}
                >
                    {job.description}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                    style={{
                        backgroundColor: '#FFB74D', // 예쁜 옅은 주황색
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.3rem',
                        padding: '0.9rem 2.5rem',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                        boxShadow: "0 2px 4px rgba(255, 183, 77, 0.4)" // 주황색 계열 그림자
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFA726'; // 호버 시 조금 더 진한 주황색
                        e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFB74D';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onClick={() => alert('준비중입니다.')}
                >
                    이 포지션에 지원하기
                </button>
            </div>
        </div>
    );
};

export default JobDetailPage;