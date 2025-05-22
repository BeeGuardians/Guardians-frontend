import searchIcon from "../../assets/search.png";
import {useState} from "react";
import Modal from "../community/components/Modal.tsx"; // 🔍 돋보기 아이콘

interface SearchBarProps {
    onSearch: (keyword: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
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
        if (e.key === "Enter") {
            handleSearch();
        }
    };


    return (
        <div
            style={{
                position: "relative",
                width: "42%", //검색창 길이
                marginBottom: "1.5rem",
            }}
        >
            <input
                type="text"
                placeholder="회사명을 입력해주세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    width: "100%",
                    padding: "0.5rem 3rem 0.5rem 1rem", // 오른쪽은 아이콘 위치 확보
                    border: "1px solid #ccc",
                    borderRadius: "6px",
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
                    padding: 0,
                    cursor: "pointer",
                }}
            >
                <img
                    src={searchIcon}
                    alt="검색"
                    style={{
                        width: "16px",
                        height: "16px",
                    }}
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
};

export default SearchBar;