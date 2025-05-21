import searchIcon from "../../../assets/search.png";
import {useState} from "react";

interface SearchBarProps {
    onSearch: (keyword: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [keyword, setKeyword] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(keyword.trim());
        }
    };

    const handleClick = () => {
        onSearch(keyword.trim());
    };

    return (
        <div style={{ position: "relative", width: "80%"}}>
            <input
                type="text"
                placeholder="제목/내용 검색어를 입력해주세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    width: "100%",
                    padding: "0.5rem 3rem 0.5rem 1rem", // 오른쪽 여백 확보
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "1rem",
                }}
            />
            <button
                onClick={handleClick}
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
                    justifyContent: "flex-end",
                    borderRadius: "50%",
                    pointerEvents: "auto",
                    paddingRight: "0.2rem",
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
