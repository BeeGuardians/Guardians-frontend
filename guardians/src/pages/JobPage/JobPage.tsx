import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./SearchBar";
import JobFilterBar from "./JobFilterBar";
import JobCard from "./JobCard";
import styles from "./JobPage.module.css";

interface Job {
    jobId: number;
    title: string;
    companyName: string;
    location: string;
    employmentType: string;
    careerLevel: string;
    salary: string;
    deadline: string;
}

const ITEMS_PER_PAGE = 6; // ✅ 2×3 구조에 맞게 6개씩 표시

const JobPage = () => {
    const [jobList, setJobList] = useState<Job[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`)
            .then((res) => {
                setJobList(res.data.result?.data ?? []);
            })
            .catch((err) => {
                console.error("❌ 채용공고 불러오기 실패:", err);
            });
    }, []);

    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentJobs = jobList.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(jobList.length / ITEMS_PER_PAGE);

    const handleSearch = (keyword: string) => {
        axios
            .get(`/api/jobs`, { withCredentials: true })
            .then((res) => {
                const filtered = res.data.result.data.filter((job: Job) =>
                    job.companyName.includes(keyword)
                );
                setJobList(filtered);
                setCurrentPage(1);
            });
    };


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                {/* 상단 안내 */}
                <h3 className={styles.pageTitle}>🔐 보안 전문가로 나아갈 기회를 잡아보세요!</h3>
                <div className={styles.noticeBox}>
                    이 페이지는 보안 실무 능력을 채용 기회와 연결해주는 공간입니다. <br />
                    워게임을 통해 갈고닦은 실력으로, 실전 그 이상의 미래를 준비하세요. 🌈
                </div>

                <SearchBar onSearch={handleSearch} />
                <JobFilterBar />

                {/* 카드 영역 */}
                <div className={styles.cardGrid}>
                    {currentJobs.map((job) => (
                        <div
                            key={job.jobId}
                            onClick={() => navigate(`/job/${job.jobId}`)}
                            style={{ cursor: "pointer" }} // ✅ className 제거, 클릭만 유지
                        >
                            <JobCard
                                title={job.title}
                                company={job.companyName}
                                region={job.location}
                                careerLevel={job.careerLevel}
                                employmentType={job.employmentType}
                                deadline={job.deadline}
                            />
                        </div>
                    ))}
                </div>

                {/* 페이지네이션 */}
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                marginTop: "4rem",
                                marginBottom: "2rem",
                                marginLeft: "0.25rem",  // ✅ 여기 수정
                                marginRight: "0.25rem",
                                padding: "0.5rem 0.9rem",
                                backgroundColor: currentPage === i + 1 ? "#FFC078" : "#eee",
                                color: currentPage === i + 1 ? "white" : "black",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobPage;
