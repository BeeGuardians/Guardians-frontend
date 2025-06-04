// src/pages/AdminPage/JobPage/JobListPage.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import AdminSidebar from "../AdminSidebar"; // 경로 맞음
import ConfirmModal from "../Components/ConfirmModal"; // ConfirmModal 임포트
import InfoModal from "../Components/InfoModal";     // InfoModal 임포트

export interface ResJobDto {
    jobId: number;
    title: string;
    companyName: string;
    location: string;
    employmentType: string;
    deadline: string;
    careerLevel: string;
    sourceUrl: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const JobListPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [jobs, setJobs] = useState<ResJobDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 모달 관련 상태
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmActionId, setConfirmActionId] = useState<number | null>(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");


    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/jobs`, {
                withCredentials: true,
            });
            setJobs(res.data.result.data);
        } catch (err) {
            console.error("채용공고 목록 불러오기 실패:", err);
            setInfoMessage("채용공고 목록을 불러오는데 실패했습니다.");
            setShowInfoModal(true);
        }
    };

    // 삭제 확인 모달 열기
    const confirmDelete = (id: number) => {
        setConfirmActionId(id);
        setShowConfirmModal(true);
    };

    // 실제 삭제 로직
    const handleDelete = async () => {
        if (confirmActionId === null) return; // ID가 없으면 실행하지 않음

        try {
            await axios.delete(`${API_BASE}/api/jobs/${confirmActionId}`, {
                withCredentials: true,
            });
            setJobs(prev => prev.filter(job => job.jobId !== confirmActionId));
            setInfoMessage("삭제 완료되었습니다.");
            setShowInfoModal(true);
        } catch (err) {
            console.error("채용공고 삭제 실패:", err);
            setInfoMessage("삭제에 실패했습니다.");
            setShowInfoModal(true);
        } finally {
            setShowConfirmModal(false); // 확인 모달 닫기
            setConfirmActionId(null); // ID 초기화
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = jobs.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(jobs.length / itemsPerPage);

    return (
        <div style={{ paddingTop: "120px", paddingLeft: "2rem", paddingRight: "2rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                <AdminSidebar />

                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>📄 커리어 관리</h2>
                        <button
                            style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#ffa94d",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                color: "#fff",
                                fontWeight: 600,
                            }}
                            // ✨ 채용공고 생성 페이지로 이동 ✨
                            onClick={() => navigate("/admin/jobs/create")}
                        >
                            + 채용공고 생성
                        </button>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                        <colgroup>
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "30%" }} />
                            <col style={{ width: "40%" }} />
                            <col style={{ width: "20%" }} />
                        </colgroup>
                        <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>회사명</th>
                            <th style={thStyle}>공고 제목</th>
                            <th style={thStyle}>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((job, idx) => (
                            <tr key={job.jobId}>
                                <td style={tdStyle}>{startIndex + idx + 1}</td>
                                <td style={tdStyle}>{job.companyName}</td>
                                <td style={tdStyle}>{job.title}</td>
                                <td style={tdStyle}>
                                    <button
                                        // ✨ 삭제 확인 모달 띄우기 ✨
                                        onClick={() => confirmDelete(job.jobId)}
                                        style={{
                                            backgroundColor: "#ff6b6b",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "0.3rem 0.6rem",
                                            cursor: "pointer",
                                        }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    margin: "0 0.25rem",
                                    padding: "0.4rem 0.75rem",
                                    backgroundColor: currentPage === i + 1 ? "#ffa94d" : "#f5f5f5",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ✨ ConfirmModal 렌더링 ✨ */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleDelete} // 확인 시 실제 삭제 로직 호출
                message="정말 이 채용공고를 삭제하시겠습니까?"
            />

            {/* ✨ InfoModal 렌더링 ✨ */}
            <InfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                message={infoMessage}
            />
        </div>
    );
};

const thStyle = {
    padding: "0.75rem",
    textAlign: "left" as const,
    fontWeight: "bold",
    borderBottom: "1px solid #ccc",
    whiteSpace: "nowrap",
};

const tdStyle = {
    padding: "0.75rem",
    textAlign: "left" as const,
    borderBottom: "1px solid #eee",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

export default JobListPage;