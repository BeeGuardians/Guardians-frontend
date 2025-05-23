import { useState, useEffect } from "react";
import Select from "react-select";
import resetIcon from "../../assets/reset.png";

type OptionType = {
    value: string;
    label: string;
};

type Filter = {
    category: string[];
    level: string[];
    status: string[];
    bookmarked: boolean;
};

const categoryOptions: OptionType[] = [
    { value: "Web", label: "웹" },
    { value: "Crypto", label: "암호" },
    { value: "Forensic", label: "포렌식" },
    { value: "BruteForce", label: "브루트포스" },
    { value: "SourceLeak", label: "소스리크" },
];

const levelOptions: OptionType[] = [
    { value: "EASY", label: "쉬움" },
    { value: "MEDIUM", label: "보통" },
    { value: "HARD", label: "어려움" },
];

const statusOptions: OptionType[] = [
    { value: "해결 완료", label: "해결 완료" },
    { value: "미해결", label: "미해결" },
];

const badgeColors: Record<string, string> = {
    category: "#0ea5e9",
    level: "#10b981",
    status: "#f59e0b",
};

function FilterBar({ onFilterChange }: { onFilterChange: (filters: Filter) => void }) {
    const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<OptionType[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<OptionType[]>([]);
    const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

    useEffect(() => {
        onFilterChange({
            category: selectedCategories.map(opt => opt.value),
            level: selectedLevels.map(opt => opt.value),
            status: selectedStatus.map(opt => opt.value),
            bookmarked: bookmarkedOnly,
        });
    }, [selectedCategories, selectedLevels, selectedStatus, bookmarkedOnly]);

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedStatus([]);
        setBookmarkedOnly(false);
    };

    const removeOption = (
        setter: React.Dispatch<React.SetStateAction<OptionType[]>>,
        value: string
    ) => {
        setter((prev) => prev.filter((opt) => opt.value !== value));
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
        return "#6b7280";
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem"}}>
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "5rem"  }}>
                    <label htmlFor="bookmarkedOnly" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <div style={{
                            position: "relative",
                            width: "42px",
                            height: "22px",
                            background: bookmarkedOnly ? "#ffc107" : "#ccc",
                            borderRadius: "9999px",
                            transition: "background-color 0.3s",
                        }}>
                            <div style={{
                                position: "absolute",
                                top: "2px",
                                left: bookmarkedOnly ? "22px" : "2px",
                                width: "18px",
                                height: "18px",
                                background: "white",
                                borderRadius: "50%",
                                transition: "left 0.2s",
                            }} />
                            <input
                                type="checkbox"
                                id="bookmarkedOnly"
                                checked={bookmarkedOnly}
                                onChange={() => setBookmarkedOnly(prev => !prev)}
                                style={{
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    position: "absolute",
                                }}
                            />
                        </div>
                        <span style={{ marginLeft: "0.5rem", fontSize: "0.9rem", color: "#333" }}>
                            나의 북마크
                        </span>
                    </label>
                </div>
            </div>
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
