import { useState } from "react";
import Select from "react-select";
import resetIcon from "../../assets/reset.png";

const categoryOptions = [
    { value: "웹", label: "웹" },
    { value: "시스템", label: "시스템" },
    { value: "리버싱", label: "리버싱" },
    { value: "포렌식", label: "포렌식" },
];

const levelOptions = [
    { value: "쉬움", label: "쉬움" },
    { value: "보통", label: "보통" },
    { value: "어려움", label: "어려움" },
];

const statusOptions = [
    { value: "풀었음", label: "풀었음" },
    { value: "못 풀었음", label: "못 풀었음" },
];

type OptionType = {
    value: string;
    label: string;
};

const badgeColors: Record<string, string> = {
    category: "#0ea5e9", // 파랑
    level: "#10b981",    // 초록
    status: "#f59e0b",   // 주황
};

function FilterBar() {
    const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<OptionType[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<OptionType[]>([]);

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedStatus([]);
    };

    const removeOption = (setter: any, value: string) => {
        setter((prev: OptionType[]) => prev.filter(opt => opt.value !== value));
    };

    const customComponents = (placeholderText: string) => ({
        MultiValue: () => null,
        ValueContainer: () => (
            <div style={{ paddingLeft: "0.5rem", color: "#aaa" }}>{placeholderText}</div>
        ),
    });

    const getBadgeColor = (option: OptionType): string => {
        if (categoryOptions.find(o => o.value === option.value)) return badgeColors.category;
        if (levelOptions.find(o => o.value === option.value)) return badgeColors.level;
        if (statusOptions.find(o => o.value === option.value)) return badgeColors.status;
        return "#6b7280"; // default gray
    };

    return (
        <div>
            {/* 드롭다운 */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ minWidth: "180px" }}>
                    <Select<OptionType, true>
                        options={categoryOptions}
                        isMulti
                        placeholder="분야 선택"
                        value={selectedCategories}
                        onChange={(selected) => setSelectedCategories(selected as OptionType[])}
                        components={customComponents("분야 선택")}
                    />
                </div>
                <div style={{ minWidth: "180px" }}>
                    <Select<OptionType, true>
                        options={levelOptions}
                        isMulti
                        placeholder="난이도 선택"
                        value={selectedLevels}
                        onChange={(selected) => setSelectedLevels(selected as OptionType[])}
                        components={customComponents("난이도 선택")}
                    />
                </div>
                <div style={{ minWidth: "180px" }}>
                    <Select<OptionType, true>
                        options={statusOptions}
                        isMulti
                        placeholder="해결 여부"
                        value={selectedStatus}
                        onChange={(selected) => setSelectedStatus(selected as OptionType[])}
                        components={customComponents("해결 여부")}
                    />
                </div>
            </div>

            {/* 선택된 필터들 + 초기화 버튼 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
                {[...selectedCategories, ...selectedLevels, ...selectedStatus].map(option => (
                    <div
                        key={option.value}
                        style={{
                            backgroundColor: getBadgeColor(option),
                            color: "white",
                            padding: "0.2rem 0.6rem",
                            fontSize: "0.7rem",
                            borderRadius: "9999px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {option.label}
                        <button
                            onClick={() => {
                                if (categoryOptions.find(o => o.value === option.value)) {
                                    removeOption(setSelectedCategories, option.value);
                                } else if (levelOptions.find(o => o.value === option.value)) {
                                    removeOption(setSelectedLevels, option.value);
                                } else {
                                    removeOption(setSelectedStatus, option.value);
                                }
                            }}
                            style={{
                                marginLeft: "0.5rem",
                                background: "transparent",
                                border: "none",
                                color: "white",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* 초기화 버튼 */}
                {(selectedCategories.length + selectedLevels.length + selectedStatus.length > 0) && (
                    <button
                        onClick={resetFilters}
                        style={{
                            background: "transparent",
                            padding: "0.1rem 0.75rem",
                            border: "none",
                            borderRadius: "9999px",
                            cursor: "pointer",
                            fontSize: "0.5rem",
                        }}
                    >
                        <img
                            src={resetIcon}
                            alt="초기화"
                            style={{ width: "18px", height: "18px" }}
                        />
                    </button>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
