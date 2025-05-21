import searchIcon from "../../assets/search.png";
import Modal from "../community/components/Modal.tsx";
import {useState} from "react";

interface SearchBarProps {
        onSearch: (keyword: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
        const [keyword, setKeyword] = useState('');
        const [modalOpen, setModalOpen] = useState(false);
        const [modalMessage, setModalMessage] = useState('');

        const handleSearch = () => {
                const trimmed = keyword.trim();
                if (trimmed.length > 0 && trimmed.length < 2) {
                        setModalMessage("검색어는 2자 이상 입력해주세요.");
                        setModalOpen(true);
                        return;
                }
                onSearch(trimmed);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') handleSearch();
        };

        return (
        <div style={{ position: "relative", width: "90%", marginBottom: "1.5rem" }}>
            <input
                type="text"
                placeholder="풀고 싶은 문제 검색"
                value={keyword}
                onChange={(e)=>setKeyword(e.target.value)}
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
                onClick={handleSearch}
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

                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={() => setModalOpen(false)}
                    confirmText="확인"
                    message={modalMessage}
                    showCancelButton={false}
                />
        </div>
    );
}


export default SearchBar;
