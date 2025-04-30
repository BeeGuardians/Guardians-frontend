import searchIcon from "../../assets/search.png";

function SearchBar() {
    return (
        <div style={{ position: "relative", width: "300px" }}>
            <input
                type="text"
                placeholder="닉네임 검색"
                style={{
                    width: "90%",
                    padding: "0.5rem 0.5rem 0.5rem 1rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <img
                src={searchIcon}
                alt="검색"
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "0.75rem",
                    transform: "translateY(-50%)",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                }}
            />
        </div>
    );
}

export default SearchBar;
