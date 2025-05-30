// src/pages/AdminPage/JobPage/JobCreatePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// InfoModal 임포트 추가
import InfoModal from "../Components/InfoModal";


const JobCreatePage = () => {
    const navigate = useNavigate();
    // 모달 상태 추가
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");

    const [jobData, setJobData] = useState({
        title: "",
        companyName: "",
        location: "",
        employmentType: "",
        deadline: "",
        careerLevel: "",
        sourceUrl: "",
        description: "",
        salary: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJobData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // ✨ 채용공고 등록 API 호출 ✨
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, jobData, {
                withCredentials: true,
            });
            setInfoMessage("채용공고가 등록되었습니다!"); // alert 대신 InfoModal 사용
            setShowInfoModal(true);
            navigate("/admin/jobs");  // 등록 후 관리자 채용공고 목록으로 이동
        } catch (err) {
            console.error("채용공고 등록 실패:", err);
            setInfoMessage("채용공고 등록에 실패했습니다. 다시 시도해주세요."); // alert 대신 InfoModal 사용
            setShowInfoModal(true);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.headerCard}>
                    <h2>📝 채용공고 등록</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        <input
                            type="text"
                            name="title"
                            placeholder="채용공고 제목"
                            value={jobData.title}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        />
                        <input
                            type="text"
                            name="companyName"
                            placeholder="회사 이름"
                            value={jobData.companyName}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="근무 위치"
                            value={jobData.location}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        />
                        <select
                            name="employmentType"
                            value={jobData.employmentType}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        >
                            <option value="">고용 형태 선택</option>
                            <option value="정규직">정규직</option>
                            <option value="계약직">계약직</option>
                        </select>
                        <select
                            name="careerLevel"
                            value={jobData.careerLevel}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        >
                            <option value="">경력 조건 선택</option>
                            <option value="신입">신입</option>
                            <option value="경력">경력</option>
                            <option value="무관">무관</option>
                        </select>
                        <input
                            type="date"
                            name="deadline"
                            placeholder="지원 마감일"
                            value={jobData.deadline}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        />
                        <input
                            type="url"
                            name="sourceUrl"
                            placeholder="공고 원문 URL"
                            value={jobData.sourceUrl}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        />
                        <input
                            type="text"
                            name="salary"
                            placeholder="연봉 조건 (예: 3000만원 이상)"
                            value={jobData.salary}
                            onChange={handleChange}
                            className={styles.titleInput}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="업무 소개"
                            value={jobData.description}
                            onChange={handleChange}
                            className={styles.editContentArea}
                            required
                        />
                    </div>
                    <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
            {/* ✨ InfoModal 렌더링 ✨ */}
            <InfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                message={infoMessage}
            />
        </div>
    );
};

export default JobCreatePage;