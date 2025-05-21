import searchIcon from "../../assets/search.png";
import {useState} from "react";
import Modal from "../community/components/Modal.tsx";

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
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClick = () => {
        handleSearch();
    };

    return (
        <div style={{ position: "relative", width: "300px" }}>
            <input
                type="text"
                placeholder="닉네임 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    width: "90%",
                    padding: "0.5rem 0.5rem 0.5rem 1rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
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
