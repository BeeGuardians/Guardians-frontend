import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import WargameTable from "./WargameTable";
import ProfileCard from "./ProfileCard";
import PopularWargameList from "./PopularWargameList";

interface Challenge {
    id: number;
    title: string;
    categoryName: string;
    difficulty: string;
    solved: boolean;
    bookmarked : boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function WargamePage() {
    const [wargames, setWargames] = useState<Challenge[]>([]);
    const [filters, setFilters] = useState({
        category: [] as string[],
        level: [] as string[],
        status: [] as string[],
        bookmarked: false,
    });
    const [searchKeyword, setSearchKeyword] = useState<string>("");

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
        setSearchKeyword(keyword); // 필터링에 사용될 키워드 상태 업데이트
    };

    const filteredWargames = useMemo(() => {
        return wargames.filter((w) => {
            const categoryMatch =
                filters.category.length === 0 || filters.category.includes(w.categoryName);
            const levelMatch =
                filters.level.length === 0 || filters.level.includes(w.difficulty);
            const statusMatch =
                filters.status.length === 0 ||
                filters.status.includes(w.solved ? "풀었음" : "못 풀었음");
            const bookmarkedMatch =
                !filters.bookmarked || w.bookmarked === true;
            const keywordMatch =
                searchKeyword.trim().length === 0 ||
                w.title.toLowerCase().includes(searchKeyword.toLowerCase());

            return categoryMatch && levelMatch && statusMatch && bookmarkedMatch && keywordMatch;
        });
    }, [wargames, filters, searchKeyword]);

    return (
        <div style={{
            padding: "2rem 1rem",
            display: "flex",
            justifyContent: "center",
        }}>
            <div style={{
                display: "flex",
                gap: "2rem",
                maxWidth: "1200px",
                width: "100%",
            }}>
                {/* 왼쪽 메인 */}
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
                    <WargameTable data={filteredWargames} />
                </div>

                {/* 오른쪽 사이드바 */}
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
