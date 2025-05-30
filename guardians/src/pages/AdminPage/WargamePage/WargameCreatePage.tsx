// src/pages/AdminPage/WargamePage/WargameCreatePage.tsx
// 기존 코드는 그대로 유지하고, URL 변경만 적용하면 됩니다.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const WargameCreatePage = () => {
    const navigate = useNavigate();
    const [wargameData, setWargameData] = useState({
        title: "",
        description: "",
        difficulty: "",
        score: "",
        categoryId: null,
        dockerImageUrl: "",
        fileUrl: "",
        flag: "",
    });

    const categoryOptions = [
        { value: 1, label: "웹" },
        { value: 2, label: "암호" },
        { value: 3, label: "포렌식" },
        { value: 4, label: "브루트포스" },
        { value: 5, label: "소스리스" },
    ];

    const difficultyOptions = [
        { value: "EASY", label: "EASY" },
        { value: "MEDIUM", label: "MEDIUM" },
        { value: "HARD", label: "HARD" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWargameData((prev) => ({ ...prev, [name]: value }));
    };


    type OptionType = {
        value: string | number;
        label: string;
    };

    const handleSelectChange = (field: string, selectedOption: OptionType | null) => {
        setWargameData((prev) => ({ ...prev, [field]: selectedOption?.value || "" }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // ✨ API 호출 부분은 이미 정확하게 구현되어 있습니다. ✨
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/wargames/admin`, wargameData, {
                withCredentials: true,
            });
            alert("워게임 등록 완료!");
            navigate("/admin/wargames"); // 등록 후 이동할 관리자 페이지
        } catch (err) {
            console.error("등록 실패:", err);
            alert("등록 실패. 다시 시도하세요.");
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <div className={styles.headerCard}>
                    <h2>🎮 워게임 등록</h2>
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        type="text"
                        name="title"
                        placeholder="문제 제목"
                        value={wargameData.title}
                        onChange={handleChange}
                        className={styles.titleInput}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="문제 설명"
                        value={wargameData.description}
                        onChange={handleChange}
                        className={styles.editContentArea}
                        required
                        style={{ resize: "none", height: "5rem" }}
                    />
                    <Select
                        options={difficultyOptions}
                        placeholder="난이도 선택"
                        value={difficultyOptions.find(opt => opt.value === wargameData.difficulty)}
                        onChange={(selected) => handleSelectChange("difficulty", selected)}
                        isClearable
                    />
                    <input
                        type="text"
                        name="score"
                        placeholder="점수"
                        value={wargameData.score}
                        onChange={handleChange}
                        className={styles.titleInput}
                        required
                    />
                    <Select
                        options={categoryOptions}
                        placeholder="카테고리 선택"
                        value={categoryOptions.find(opt => opt.value === wargameData.categoryId)}
                        onChange={(selected) => handleSelectChange("categoryId", selected)}
                        isClearable
                    />
                    <input
                        type="text"
                        name="dockerImageUrl"
                        placeholder="도커 이미지 URL"
                        value={wargameData.dockerImageUrl}
                        onChange={handleChange}
                        className={styles.titleInput}
                        required
                    />
                    <input
                        type="url"
                        name="fileUrl"
                        placeholder="문제 파일 URL"
                        value={wargameData.fileUrl}
                        onChange={handleChange}
                        className={styles.titleInput}
                        required
                    />
                    <input
                        type="text"
                        name="flag"
                        placeholder="플래그"
                        value={wargameData.flag}
                        onChange={handleChange}
                        className={styles.titleInput}
                        required
                    />
                    <button type="submit" className={styles.submitBtn}>
                        등록하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WargameCreatePage;