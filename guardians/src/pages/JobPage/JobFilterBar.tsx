import {useEffect, useState} from "react";
import Select from "react-select";

type OptionType = { value: string; label: string };

const typeOptions = [
    { value: "신입", label: "신입" },
    { value: "경력", label: "경력" },
    { value: "무관", label: "무관" },
];

const employOptions = [
    { value: "정규직", label: "정규직" },
    { value: "계약직", label: "계약직" },
];

const regionOptions = [
    { value: "서울", label: "서울" },
    { value: "부산", label: "부산" },
    { value: "대전", label: "대전" },
    { value: "광주", label: "광주" },
    { value: "인천", label: "인천" },
    { value: "대구", label: "대구" },

];


interface JobFilterBarProps {
    onFilterChange: (filters: {
        type: string;
        employ: string;
        region: string;
    }) => void;
    resetTrigger: boolean;
}

const JobFilterBar = ({ onFilterChange, resetTrigger }: JobFilterBarProps) => {
    const [type, setType] = useState<OptionType | null>(null);
    const [employ, setEmploy] = useState<OptionType | null>(null);
    const [region, setRegion] = useState<OptionType | null>(null);

    useEffect(() => {
        onFilterChange({
            type: type?.value || "",
            employ: employ?.value || "",
            region: region?.value || "",
        });
    }, [type, employ, region]);

    useEffect(() => {
        if (resetTrigger) {
            setType(null);
            setEmploy(null);
            setRegion(null);
            onFilterChange({ type: "", employ: "", region: "" });
        }
    }, [resetTrigger]);


    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
            <div style={{ minWidth: "180px" }}>
                <Select
                    options={typeOptions}
                    placeholder="지원 유형 선택"
                    value={type}
                    onChange={(selected) => setType(selected)}
                />
            </div>
            <div style={{ minWidth: "180px" }}>
                <Select
                    options={employOptions}
                    placeholder="근로기간 선택"
                    value={employ}
                    onChange={(selected) => setEmploy(selected)}
                />
            </div>
            <div style={{ minWidth: "180px" }}>
                <Select
                    options={regionOptions}
                    placeholder="지역 선택"
                    value={region}
                    onChange={(selected) => setRegion(selected)}
                />
            </div>
        </div>
    );
};

export default JobFilterBar;