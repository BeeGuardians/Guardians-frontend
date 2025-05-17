import { useParams } from "react-router-dom";

// 🔹 JobPage와 동일한 더미 데이터
const dummyJobs = Array.from({ length: 20 }, (_, idx) => ({
    id: (idx + 1).toString(), // 문자열로 처리 (useParams는 string 반환)
    title: `000 직무 ${idx + 1}`,
    company: `00 회사 ${idx + 1}`,
    region: ["서울", "부산", "대전", "광주", "인천", "대구"][idx % 6],
}));

const JobDetailPage = () => {
    const { id } = useParams(); // URL에서 받은 id (문자열)

    // 해당 id와 일치하는 채용 정보 찾기
    const job = dummyJobs.find((job) => job.id === id);

    if (!job) {
        return <div style={{ padding: "2rem" }}>해당 채용 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <div
                        style={{
                            backgroundColor: "#f3f3f3",
                            width: "140px",
                            height: "140px",
                            borderRadius: "0.75rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: 700,
                        }}
                    >
                        Logo
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{job.title}</h2>
                        <p style={{ margin: "0.25rem 0", color: "#666" }}>{job.company}</p>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "2rem",
                        backgroundColor: "#f5f5f5",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                    }}
                >
                    <p><strong>지원 마감 :</strong> 미정</p>
                    <p><strong>근무 위치 :</strong> {job.region}</p>
                </div>

                <h3 style={{ marginTop: "2.5rem" }}>업무 소개</h3>
                <p style={{ lineHeight: 1.6, color: "#444" }}>
                    이 곳에는 추후 상세 업무 설명이 들어갑니다. 채용 공고 내용을 기반으로 연결될 예정입니다.
                </p>
            </div>
        </div>
    );
};

export default JobDetailPage;