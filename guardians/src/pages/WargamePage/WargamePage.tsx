import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import WargameTable from "./WargameTable";
import ProfileCard from "./ProfileCard";
import PopularWargameList from "./PopularWargameList";

function WargamePage() {
    return (
        <div style={{ display: "flex", padding: "1.5rem" }}>
            {/* 왼쪽 메인 */}
            <div style={{ flex: 1.8, paddingRight: "2rem" }}>
                <h2>워게임</h2>
                <SearchBar />
                <FilterBar />
                <WargameTable />
            </div>

            {/* 오른쪽 사이드바 (프로필 + 인기문제) */}
            <div
                style={{
                    flex: 1,
                    paddingTop: "4.2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                }}
            >
                <ProfileCard />
                <PopularWargameList />
            </div>
        </div>
    );
}

export default WargamePage;
