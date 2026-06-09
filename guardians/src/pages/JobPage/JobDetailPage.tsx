import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

// 아이콘 import는 그대로 유지합니다. 실제 파일이 경로에 있다고 가정합니다.
import locationIcon from "../../assets/location2.png";
import moneyIcon from "../../assets/money.png";
import employeeIcon from "../../assets/employee.png";
import careerIcon from "../../assets/career.png";
import calendarIcon from "../../assets/calendar.png";

interface ApiJobDto {
    jobId: string;
    companyName: string;
    title: string;
    description?: string;
    location: string;
    employmentType: string;
    careerLevel: string;
    salary?: string;
    deadline: string;
    sourceUrl?: string;
}

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
    sourceUrl?: string;
}

const JobDetailPage = () => {
    const { id: currentJobIdString } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [job, setJob] = useState<ResJobDto | null>(null);
    const [allJobs, setAllJobs] = useState<ResJobDto[]>([]);
    const [otherCompanyJobs, setOtherCompanyJobs] = useState<ResJobDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // 오류 상태 추가

    // 1. 전체 채용공고 목록을 한 번만 불러오기
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, { // API 경로 확인
                withCredentials: true,
            })
            .then((res) => {
                if (res.data && res.data.result && Array.isArray(res.data.result.data)) {
                    const mappedJobs = res.data.result.data.map((apiJob: ApiJobDto) => ({
                        id: parseInt(apiJob.jobId, 10),
                        companyName: apiJob.companyName,
                        title: apiJob.title,
                        description: apiJob.description || "", // 목록 API에 없을 경우 대비
                        location: apiJob.location,
                        employmentType: apiJob.employmentType,
                        careerLevel: apiJob.careerLevel,
                        salary: apiJob.salary || "회사내규에 따름", // 목록 API에 없을 경우 대비
                        deadline: apiJob.deadline,
                        sourceUrl: apiJob.sourceUrl,
                    }));
                    setAllJobs(mappedJobs);
                } else {
                    console.error("전체 채용공고 목록 API 응답 형식이 올바르지 않습니다.", res.data);
                    setAllJobs([]); // 빈 배열로 설정하여 오류 방지
                }
            })
            .catch((err) => {
                console.error("전체 채용공고 목록 조회 실패:", err);
                setError("전체 채용공고 목록을 불러오는 데 실패했습니다.");
            });
    }, []); // 마운트 시 한 번만 실행

    // 2. 현재 보고 있는 채용공고 상세 정보 불러오기
    useEffect(() => {
        if (!currentJobIdString) {
            setJob(null);
            setIsLoading(false);
            setError("유효하지 않은 접근입니다.");
            return;
        }

        setIsLoading(true);
        setError(null); // 이전 오류 상태 초기화

        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${currentJobIdString}`, {
                withCredentials: true,
            })
            .then((res) => {
                const jobDataFromServer = res.data.result?.data || res.data.data || res.data;
                if (jobDataFromServer) {
                    // 상세 API 응답의 ID 필드명을 확인해야 합니다 (jobId 인지 id 인지).
                    // 여기서는 ResJobDto에 따라 'id' 필드가 숫자형으로 온다고 가정하거나, jobId를 id로 매핑합니다.
                    const numericId = jobDataFromServer.id ?
                        (typeof jobDataFromServer.id === 'string' ? parseInt(jobDataFromServer.id, 10) : jobDataFromServer.id) :
                        (jobDataFromServer.jobId ? parseInt(jobDataFromServer.jobId, 10) : parseInt(currentJobIdString, 10));

                    setJob({
                        ...jobDataFromServer,
                        id: numericId,
                        // salary와 description은 상세 API에서 제공된다고 가정
                        salary: jobDataFromServer.salary || "회사내규에 따름",
                        description: jobDataFromServer.description || "상세 정보가 없습니다."
                    });
                } else {
                    setJob(null);
                    setError("해당 채용 정보를 찾을 수 없습니다.");
                }
            })
            .catch((err) => {
                console.error(`채용공고 상세 조회 실패 (ID: ${currentJobIdString}):`, err);
                setJob(null);
                setError("채용 정보를 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [currentJobIdString]);

    // 3. 현재 공고 또는 전체 공고 목록이 변경될 때, 동일 회사 다른 공고 필터링
    useEffect(() => {
        if (job && job.id && job.companyName && allJobs.length > 0) {
            const currentJobNumericId = job.id; // 이미 숫자형이라고 가정 (위에서 처리)
            const filtered = allJobs.filter(
                (j) => j.companyName === job.companyName && j.id !== currentJobNumericId
            );
            setOtherCompanyJobs(filtered);
        } else {
            setOtherCompanyJobs([]); // 조건 미충족 시 빈 배열로 초기화
        }
    }, [job, allJobs]);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#555' }}>
                로딩 중...
            </div>
        );
    }

    if (error) { // 오류 발생 시 오류 메시지 표시
        return (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#d9534f' }}>
                {error}
            </div>
        );
    }

    if (!job) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#d9534f' }}>
                채용 정보를 표시할 수 없습니다.
            </div>
        );
    }

    return (
        <div style={{ padding: "3rem 6vw", maxWidth: "1000px", margin: "0 auto", fontFamily: 'sans-serif', backgroundColor: "#f9f9f9" }}>
            {/* 뒤로가기 버튼 */}
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

            {/* Hero Section */}
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
                    {/* 회사 로고 이미지가 있다면 job.sourceUrl 사용 가능 */}
                    {/* <img src={job.sourceUrl} alt={job.companyName} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> */}
                    {job.companyName.charAt(0).toUpperCase()}
                </div>
                <h1 style={{ fontSize: "2.4rem", fontWeight: "700", color: "#2c3e50", marginBottom: "0.7rem" }}>
                    {job.title}
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#555e68" }}>{job.companyName}</p>
            </div>

            {/* Key Information Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", marginBottom: "3rem", justifyContent: "center" }}>
                {[
                    { icon: locationIcon, label: "근무 위치", value: job.location },
                    { icon: moneyIcon, label: "연봉 조건", value: `${job.salary || '회사내규에 따름'}` }, // 이상 제거, 기본값 사용
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

            {/* 업무 소개 */}
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

            {/* 🚀 이 회사의 다른 채용 중인 포지션 섹션 */}
            {otherCompanyJobs.length > 0 && (
                <div style={{ marginTop: '3.5rem', borderTop: '1px solid #e0e0e0', paddingTop: '2.5rem', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2c3e50', marginBottom: '1.5rem' }}>
                        {job.companyName}의 다른 채용 중인 포지션
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {otherCompanyJobs.map((otherJob) => (
                            <div
                                key={otherJob.id}
                                style={{
                                    padding: '1.2rem',
                                    backgroundColor: '#fff',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 3px 7px rgba(0,0,0,0.08)',
                                    border: '1px solid #e9ecef',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 3px 7px rgba(0,0,0,0.08)";
                                }}
                            >
                                <Link to={`/job/${otherJob.id}`} style={{ textDecoration: 'none' }}
                                      onClick={() => { // 다른 공고 클릭 시 현재 job 상태 초기화 및 로딩 시작 (선택적)
                                          setJob(null);
                                          setIsLoading(true);
                                          // setOtherCompanyJobs([]); // 필요에 따라 이전 목록 초기화
                                      }}
                                >
                                    <h4
                                        style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#FFB74D',
                                            marginBottom: '0.6rem',
                                            wordBreak: 'keep-all'
                                        }}
                                    >
                                        {otherJob.title}
                                    </h4>
                                </Link>
                                <p style={{ fontSize: '0.9rem', color: '#555e68', margin: '0.3rem 0' }}>
                                    <span style={{color: '#333', fontWeight: 500}}>지역:</span> {otherJob.location}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#555e68', margin: '0.3rem 0' }}>
                                    <span style={{color: '#333', fontWeight: 500}}>경력:</span> {otherJob.careerLevel}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#555e68', margin: '0.3rem 0' }}>
                                    <span style={{color: '#333', fontWeight: 500}}>고용형태:</span> {otherJob.employmentType}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.7rem' }}>
                                    마감일: {new Date(otherJob.deadline).toLocaleDateString("ko-KR")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 지원하기 버튼 */}
            <div style={{ textAlign: 'center', marginTop: '3rem', paddingBottom: '2rem' }}>
                <button
                    style={{
                        backgroundColor: '#FFB74D',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.3rem',
                        padding: '0.9rem 2.5rem',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                        boxShadow: "0 2px 4px rgba(255, 183, 77, 0.4)"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFA726';
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