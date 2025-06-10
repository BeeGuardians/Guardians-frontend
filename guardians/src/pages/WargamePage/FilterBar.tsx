import { useState, useEffect } from "react";
import Select, {
    components,
    ValueContainerProps,
    MultiValueProps,
    GroupBase,
    CSSObjectWithLabel
} from "react-select";
import styles from "./FilterBar.module.css";
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
    { value: "SOLVED", label: "해결" },
    { value: "UNSOLVED", label: "미해결" },
];

const badgeColors: Record<string, string> = {
    category: "#0ea5e9",
    level: "#10b981",
    status: "#f59e0b",
};

const selectCommonProps = {
    menuPortalTarget: document.body,
    styles: {
        menuPortal: (base: CSSObjectWithLabel) => ({ ...base, zIndex: 9999 }),
    },
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
        MultiValue: (
            props: MultiValueProps<OptionType, true, GroupBase<OptionType>>
        ) => (
            <div style={{ display: "none" }}>
                <components.MultiValue {...props} />
            </div>
        ),

        ValueContainer: (
            props: ValueContainerProps<OptionType, true, GroupBase<OptionType>>
        ) => (
            <components.ValueContainer {...props}>
                <div
                    style={{
                        paddingLeft: "0.5rem",
                        color: "#aaa",
                        fontSize: "0.9rem",
                        position: "absolute",
                        pointerEvents: "none",
                    }}
                >
                    {placeholderText}
                </div>
                {props.children}
            </components.ValueContainer>
        )
    });

    const getBadgeColor = (option: OptionType): string => {
        if (categoryOptions.find(o => o.value === option.value)) return badgeColors.category;
        if (levelOptions.find(o => o.value === option.value)) return badgeColors.level;
        if (statusOptions.find(o => o.value === option.value)) return badgeColors.status;
        return "#6b7280";
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.filterContainer}>
                <div className={styles.selectWrapper}>
                    <Select<OptionType, true>
                        options={categoryOptions}
                        isMulti
                        value={selectedCategories}
                        onChange={(selected) => setSelectedCategories(selected as OptionType[])}
                        components={customComponents("카테고리 선택")}
                        placeholder=""
                        isSearchable={false}
                        {...selectCommonProps}
                    />
                </div>
                <div className={styles.selectWrapper}>
                    <Select<OptionType, true>
                        options={levelOptions}
                        isMulti
                        value={selectedLevels}
                        onChange={(selected) => setSelectedLevels(selected as OptionType[])}
                        components={customComponents("난이도 선택")}
                        placeholder=""
                        isSearchable={false}
                        {...selectCommonProps}
                    />
                </div>
                <div className={styles.selectWrapper}>
                    <Select<OptionType, true>
                        options={statusOptions}
                        isMulti
                        value={selectedStatus}
                        onChange={(selected) => setSelectedStatus(selected as OptionType[])}
                        components={customComponents("해결 여부")}
                        placeholder=""
                        isSearchable={false}
                        {...selectCommonProps}
                    />
                </div>
                <div className={styles.bookmarkToggle}>
                    <label htmlFor="bookmarkedOnly" className={styles.bookmarkLabel}>
                        <div className={`${styles.toggleSwitch} ${bookmarkedOnly ? styles.toggleSwitchOn : ''}`}>
                            <div className={`${styles.toggleKnob} ${bookmarkedOnly ? styles.toggleKnobOn : ''}`} />
                        </div>
                        <input
                            type="checkbox"
                            id="bookmarkedOnly"
                            checked={bookmarkedOnly}
                            onChange={() => setBookmarkedOnly(prev => !prev)}
                            className={styles.hiddenCheckbox}
                        />
                        <span className={styles.bookmarkText}>나의 북마크</span>
                    </label>
                </div>
            </div>

            <div className={styles.selectedFiltersContainer}>
                {[...selectedCategories, ...selectedLevels, ...selectedStatus].map(option => (
                    <div
                        key={option.value}
                        className={styles.filterBadge}
                        style={{ backgroundColor: getBadgeColor(option) }}
                    >
                        {option.label}
                        <button
                            className={styles.removeButton}
                            onClick={() => {
                                if (categoryOptions.find(o => o.value === option.value)) {
                                    removeOption(setSelectedCategories, option.value);
                                } else if (levelOptions.find(o => o.value === option.value)) {
                                    removeOption(setSelectedLevels, option.value);
                                } else {
                                    removeOption(setSelectedStatus, option.value);
                                }
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {(selectedCategories.length + selectedLevels.length + selectedStatus.length > 0) && (
                    <button onClick={resetFilters} className={styles.resetButton}>
                        <img
                            src={resetIcon}
                            alt="초기화"
                            className={styles.resetIcon}
                        />
                    </button>
                )}
            </div>
        </div>
    );
}

export default FilterBar;