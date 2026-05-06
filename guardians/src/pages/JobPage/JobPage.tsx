import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./SearchBar";
import JobFilterBar from "./JobFilterBar";
import JobCard from "./JobCard";
import styles from "./JobPage.module.css";
import resetIcon from "../../assets/reset.png";

interface Job {
    jobId: number;
    title: string;
    companyName: string;
    location: string;
    employmentType: string;
    careerLevel: string;
    salary: string;
    deadline: string;
    sourceUrl: string;

}

const ITEMS_PER_PAGE = 16;

const JobPage = () => {
    const [jobList, setJobList] = useState<Job[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [resetTrigger, setResetTrigger] = useState(false);


    const [fullJobList, setFullJobList] = useState<Job[]>([]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`)
            .then((res) => {
                setFullJobList(res.data.result?.data ?? []);
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
        const filtered = fullJobList.filter((job) =>
            job.companyName.includes(keyword)
        );
        setJobList(filtered);
        setCurrentPage(1);
    };
    const handleFilterChange = (filters: { type: string; employ: string; region: string }) => {
        const filtered = fullJobList.filter((job) => {
            const matchType = filters.type ? job.careerLevel === filters.type : true;
            const matchEmploy = filters.employ ? job.employmentType === filters.employ : true;
            const matchRegion = filters.region ? job.location === filters.region : true;
            return matchType && matchEmploy && matchRegion;
        });

        setJobList(filtered);
        setCurrentPage(1); // 첫 페이지로 리셋

    };

    const handleRefresh = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`)
            .then((res) => {
                const all = res.data.result?.data ?? [];
                setFullJobList(all);
                setJobList(all);
                setCurrentPage(1);
                setResetTrigger(true); // 트리거 발생
                setTimeout(() => setResetTrigger(false), 100); // 트리거 리셋
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
                {/* 필터바 + 새로고침 버튼 */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                    <JobFilterBar
                        onFilterChange={handleFilterChange}
                        resetTrigger={resetTrigger}
                    />
                    <button
                        className={styles.buttonFocus}
                        onClick={handleRefresh}
                    >
                        <img
                            src={resetIcon}
                            alt="새로고침"
                            className="resetIcon"

                            style={{
                                width: 20,
                                height: 20,
                                outline: 'none',
                                border: 'none',
                                background: 'transparent',

                            }}
                            tabIndex={-1}  // 포커스 방지
                        />
                    </button>

                </div>


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
                                sourceUrl={job.sourceUrl}
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
                                marginLeft: "0.25rem",
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
