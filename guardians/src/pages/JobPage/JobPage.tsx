import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import JobFilterBar from "./JobFilterBar";
import JobCard from "./JobCard";

// 🔹 더미 데이터 (20개)
const dummyJobs = Array.from({ length: 20 }, (_, idx) => ({
    id: idx + 1,
    title: `000 직무 ${idx + 1}`,
    company: `00 회사 ${idx + 1}`,
    region: ["서울", "부산", "대전", "광주", "인천", "대구"][idx % 6],
}));

const ITEMS_PER_PAGE = 9;

const JobPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // 🔸 현재 페이지의 job slice
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentJobs = dummyJobs.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(dummyJobs.length / ITEMS_PER_PAGE);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem 1rem",
                backgroundColor: "#fafafa",
                minHeight: "100vh",
            }}
        >
            <div style={{ maxWidth: "1200px", width: "100%" }}>
                {/* 상단 안내 멘트 */}
                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: "1rem",
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: "#666",
                    }}
                >
                    🔐 보안 전문가로 나아갈 기회를 잡아보세요!
                </h3>

                {/* 노란 안내 박스 */}
                <div
                    style={{
                        backgroundColor: "#fffbe6",
                        border: "1px solid #ffe58f",
                        borderRadius: "0.75rem",
                        padding: "1.5rem",
                        marginBottom: "3vh",
                        color: "#664d03",
                        fontSize: "0.95rem",
                        lineHeight: "1.5rem",
                    }}
                >
                    이 페이지는 보안 실무 능력을 채용 기회와 연결해주는 공간입니다. <br />
                    워게임을 통해 갈고닦은 실력으로, 실전 그 이상의 미래를 준비하세요. 🌈
                </div>

                <SearchBar placeholder="회사명 검색" />
                <JobFilterBar />

                {/* 카드 리스트 (3x3 그리드) */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "2rem",
                        marginTop: "2rem",
                    }}
                >
                    {currentJobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => navigate(`/job/${job.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <JobCard
                                id={job.id}
                                region={job.region}
                                title={job.title}
                                company={job.company}
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
                                margin: "0 0.25rem",
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