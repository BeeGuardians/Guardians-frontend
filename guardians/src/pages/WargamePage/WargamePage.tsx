import { useState, useEffect, useMemo } from "react";
import axios from "axios";
// import styles from "./WargamePage.module.css"; // CSS 모듈 임포트를 제거합니다.
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import WargameTable from "./WargameTable";
import ProfileCard from "./ProfileCard";
import PopularWargameList from "./PopularWargameList";
import TopLikedWargameSlider from "./TopLikedWargameSlider";

// --- 인터페이스 정의 ---
interface Challenge {
    id: number;
    title: string;
    categoryName: string;
    difficulty: string;
    solved: boolean;
    bookmarked: boolean;
    likeCount: number;
    score: number;
}

// --- 상수 정의 ---
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// --- 아이콘 컴포넌트 ---
const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
    <svg
        height="20"
        width="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        focusable="false"
        style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
            fill: '#495057'
        }}
    >
        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.533 0.481-1.141 0.446-1.574 0l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z"></path>
    </svg>
);


// --- 카테고리 데이터 및 설명 컴포넌트 ---
const categoryDescriptions = [
    {
        label: "웹",
        description: "웹 애플리케이션의 취약점을 찾아 공격하는 유형입니다. (예: SQL Injection, XSS)"
    },
    {
        label: "암호",
        description: "암호화된 텍스트나 암호 시스템의 약점을 분석하여 원본 메시지를 찾아내는 유형입니다."
    },
    {
        label: "포렌식",
        description: "주어진 파일이나 디스크 이미지, 메모리 덤프 등에서 숨겨진 정보나 단서를 찾는 유형입니다."
    },
    {
        label: "브루트포스",
        description: "가능한 모든 경우의 수를 무차별적으로 대입하여 암호나 키를 알아내는 공격 기법입니다."
    },
    {
        label: "소스리크",
        description: "유출된 소스코드를 분석하여 숨겨진 취약점이나 중요한 정보를 찾아내는 유형입니다."
    }
];

const CategoryDescriptions = () => {
    return (
        <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {categoryDescriptions.map((cat, index) => (
                    <div key={index} style={{ backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '12px', padding: '1rem' }}>
                        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#333' }}>{cat.label}</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>{cat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- 메인 페이지 컴포넌트 ---
function WargamePage() {
    const [wargames, setWargames] = useState<Challenge[]>([]);
    const [filters, setFilters] = useState({
        category: [] as string[],
        level: [] as string[],
        status: [] as string[],
        bookmarked: false,
    });
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [showCategoryDesc, setShowCategoryDesc] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE}/api/wargames`, { withCredentials: true })
            .then((res) => {
                setWargames(res.data.result.data);
            })
            .catch((err) => {
                console.error("워게임 목록 불러오기 실패:", err);
            });
    }, []);

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
    };

    const filteredWargames = useMemo(() => {
        return wargames.filter((w) => {
            const categoryMatch =
                filters.category.length === 0 || filters.category.includes(w.categoryName);
            const levelMatch =
                filters.level.length === 0 || filters.level.includes(w.difficulty);
            const statusMatch =
                filters.status.length === 0 ||
                filters.status.includes(w.solved ? "SOLVED" : "UNSOLVED");
            const bookmarkedMatch =
                !filters.bookmarked || w.bookmarked === true;
            const keywordMatch =
                searchKeyword.trim().length === 0 ||
                w.title.toLowerCase().includes(searchKeyword.toLowerCase());

            return categoryMatch && levelMatch && statusMatch && bookmarkedMatch && keywordMatch;
        });
    }, [wargames, filters, searchKeyword]);

    const topLikedWargames = useMemo(() => {
        return [...wargames]
            .sort((a, b) => b.likeCount - a.likeCount)
            .slice(0, 10);
    }, [wargames]);

    return (
        <div style={{ padding: "2rem 1rem", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "2rem", maxWidth: "1200px", width: "100%" }}>
                <div style={{ flex: 2.8, paddingRight: "1rem" }}>
                    <h3
                        style={{
                            marginTop: "0rem",
                            marginBottom: "1rem",
                            fontWeight: 400,
                            fontSize: "1rem",
                            color: "#666",
                        }}
                    >
                        😎 취약점을 찾아내고, 문제를 해결하세요!
                    </h3>

                    <div
                        style={{
                            backgroundColor: "#fffbe6",
                            border: "1px solid #ffe58f",
                            borderRadius: "0.75rem",
                            padding: "1.25rem",
                            marginBottom: "2rem",
                            color: "#664d03",
                            fontSize: "0.95rem",
                            lineHeight: "1.5rem",
                        }}
                    >
                        워게임은 실전과 유사한 문제를 풀며 보안 역량을 키울 수 있는 환경입니다. <br />
                        취약점을 찾아내고 문제를 해결하면서, 재미있게 공부해보세요! 💪
                    </div>

                    <SearchBar onSearch={handleSearch} />
                    <FilterBar onFilterChange={setFilters} />

                    <div style={{
                        margin: '1.5rem 0',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        transition: 'background-color 0.2s ease',
                    }}>
                        <div
                            onClick={() => setShowCategoryDesc(prev => !prev)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            style={{
                                padding: '1rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: '#495057',
                                display: 'flex',
                                borderRadius: '10px',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: showCategoryDesc ? '1px solid #e9ecef' : 'none',
                            }}
                        >
                            <span>어떤 워게임을 풀어볼까요?</span>
                            <ChevronIcon isExpanded={showCategoryDesc} />
                        </div>

                        {/* --- ✨✨✨ CSS 모듈 대신 인라인 스타일로 애니메이션 구현 --- ✨✨✨ */}
                        <div style={{
                            maxHeight: showCategoryDesc ? '500px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.4s ease-in-out'
                        }}>
                            <div style={{ padding: '0 1rem' }}>
                                <CategoryDescriptions />
                            </div>
                        </div>
                    </div>

                    <TopLikedWargameSlider challenges={topLikedWargames} />

                    <WargameTable data={filteredWargames} />
                </div>

                <div
                    style={{
                        flex: 1,
                        paddingTop: "2.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                    }}
                >
                    <ProfileCard />
                    <PopularWargameList />
                </div>
            </div>
        </div>
    );
}

export default WargamePage;