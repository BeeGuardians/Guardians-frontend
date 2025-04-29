import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import WargameTable from "./WargameTable";
import ProfileCard from "./ProfileCard.tsx";

function WargamePage() {
    return (
        <div style={{ display: "flex", padding: "1.5rem" }}>
            {/* 왼쪽 메인 */}
            <div style={{ flex: 1.8, paddingRight: "2rem" }}>
                <h2>워게임</h2>
                <SearchBar /> {/* ✅ 여기 추가 */}
                {/* 필터바 */}
                <FilterBar />
                {/* 문제 테이블 */}
                <WargameTable />
            </div>

            {/* 오른쪽 프로필 카드 */}
            <div style={{ flex: 1, paddingTop: "4.2rem" }}>
                {/* 프로필 카드 */}
                <ProfileCard />
            </div>
        </div>
    );
}

export default WargamePage;
