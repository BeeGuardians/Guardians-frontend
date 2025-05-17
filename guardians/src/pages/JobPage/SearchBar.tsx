import searchIcon from "../../assets/search.png"; // 🔍 돋보기 아이콘

// 🔸 컴포넌트 prop 타입 정의 (placeholder를 외부에서 전달받음)
type Props = {
    placeholder: string;
};

const SearchBar = ({ placeholder }: Props) => {
    return (
        // ✅ 전체 검색창 wrapper (relative 기준으로 아이콘 배치)
        <div
            style={{
                position: "relative",
                width: "40%", //검색창 길이
                marginBottom: "1.5rem",
            }}
        >
            {/* 🔹 입력창 */}
            <input
                type="text"
                placeholder={placeholder}
                style={{
                    width: "100%",
                    padding: "0.5rem 3rem 0.5rem 1rem", // 오른쪽은 아이콘 위치 확보
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />

            {/* 🔹 검색 아이콘 (입력창 안 오른쪽 끝에 위치) */}
            <img
                src={searchIcon}
                alt="검색"
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "-3rem", // ✅ input 내부 기준으로 오른쪽 끝에
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    pointerEvents: "none", // 클릭 막기
                }}
            />
        </div>
    );
};

export default SearchBar;