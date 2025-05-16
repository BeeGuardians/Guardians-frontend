import { useState } from "react";
import Select from "react-select";

type OptionType = { value: string; label: string };

const typeOptions = [
    { value: "신입", label: "신입" },
    { value: "경력", label: "경력" },
];

const salaryOptions = [
    { value: "3000", label: "3000만 이상" },
    { value: "5000", label: "5000만 이상" },
    { value: "7000", label: "7000만 이상" },
];

const regionOptions = [
    { value: "서울", label: "서울" },
    { value: "부산", label: "부산" },
    { value: "대전", label: "대전" },
];

const JobFilterBar = () => {
    const [type, setType] = useState<OptionType[]>([]);
    const [salary, setSalary] = useState<OptionType[]>([]);
    const [region, setRegion] = useState<OptionType[]>([]);

    const customComponents = (placeholderText: string) => ({
        MultiValue: () => null,
        ValueContainer: () => (
            <div style={{ paddingLeft: "0.5rem", color: "#aaa" }}>{placeholderText}</div>
        ),
    });

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ minWidth: "180px" }}>
                <Select
                    options={typeOptions}
                    isMulti
                    placeholder="지원 유형 선택"
                    value={type}
                    onChange={(selected) => setType(selected as OptionType[])}
                    components={customComponents("지원 유형 선택")}
                />
            </div>
            <div style={{ minWidth: "180px" }}>
                <Select
                    options={salaryOptions}
                    isMulti
                    placeholder="연봉 선택"
                    value={salary}
                    onChange={(selected) => setSalary(selected as OptionType[])}
                    components={customComponents("연봉 선택")}
                />
            </div>
            <div style={{ minWidth: "180px" }}>
                <Select
                    options={regionOptions}
                    isMulti
                    placeholder="지역 선택"
                    value={region}
                    onChange={(selected) => setRegion(selected as OptionType[])}
                    components={customComponents("지역 선택")}
                />
            </div>
        </div>
    );
};

export default JobFilterBar;