import searchIcon from "../../assets/search.png";

function SearchBar() {
    return (
        <div style={{ position: "relative", width: "90%", marginBottom: "1.5rem" }}>
            <input
                type="text"
                placeholder="풀고 싶은 문제 검색"
                style={{
                    width: "100%",
                    padding: "0.5rem 3rem 0.5rem 1rem", // 오른쪽 여백 확보
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "1rem",
                }}
            />
            <button
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "-3rem",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    width: "2rem",
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end", // ✅ 오른쪽으로 밀어!
                    borderRadius: "50%",
                    pointerEvents: "auto",
                    paddingRight: "0.2rem", // ✅ 아이콘 더 끝에 딱 붙이기
                }}
            >
                    <img
                        src={searchIcon}
                        alt="검색"
                        style={{ width: "16px", height: "16px" }}
                    />

            </button>

        </div>
    );
}


export default SearchBar;
