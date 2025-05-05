function UserInfoCard() {
    return (
        <div
            style={{
                width: "360px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "white",
            }}
        >
            {/* 상단 닉네임 */}
            <div
                style={{
                    padding: "1rem",
                    borderBottom: "1px solid #ccc",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <span style={{ color: "#1a73e8", marginRight: "0.25rem" }}>Guardians123</span>
            </div>

            {/* 프사 + 정보 */}
            <div
                style={{
                    padding: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* 프사 */}
                <div
                    style={{
                        width: "100px", // ✅ 프사 크기 줄임
                        height: "100px",
                        backgroundColor: "#aaa",
                        borderRadius: "50%",
                        border: "1px solid black",
                        flexShrink: 0,
                    }}
                ></div>

                {/* 정보 */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginLeft: "1rem",
                    }}
                >
                    {/* 각 정보 항목 */}
                    {[
                        { label: "점수", value: "1000점" },
                        { label: "랭킹", value: "00위" },
                        { label: "해결", value: "00개" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                minWidth: "120px", // ✅ 좌우 라인 길이 맞춰줌
                            }}
                        >
                            <span style={{ color: "#888", fontSize: "0.85rem" }}>{item.label}</span>
                            <span style={{ fontWeight: 600, fontSize: "1rem" }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserInfoCard;
