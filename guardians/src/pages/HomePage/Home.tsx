function Home() {
    return (
        <div style={{ padding: "0", margin: "0" }}>
            {/* 배경색이 전체 너비로 적용되는 상단 Hero 영역 */}
            <div
                style={{
                    backgroundColor: "#f9c37b",
                    paddingTop: 80,              // 상단 여백 제거
                    paddingBottom: "13rem",    // 하단만 여백 유지
                    marginTop: "-6rem",        // ❗ 강제 상단 여백 제거 (부모 여백 무력화용)
                    color: "#000",
                    width: "100vw",            // 전체 너비 강제 적용
                    height: "30vh",
                    position: "relative",
                    left: "calc(-100vw + 100%)", // 중앙 기준으로 왼쪽 이동
                }}
            >
                {/* 상단 제목 영역 */}
                <h1
                    style={{
                        fontSize: "4.5rem",        // 큰 글씨
                        fontWeight: "bold",        // 굵은 텍스트
                        marginTop: "6rem",
                        marginBottom: "1rem",      // 아래쪽 간격
                        marginLeft: "5rem"
                }}
                >
                    모의해킹플랫폼 <br />
                    <span style={{ fontWeight: "400" }}>
                        Guardians를 소개합니다.
                    </span>
                </h1>

                {/* 설명 문구 영역 */}
                <p
                    style={{
                        fontSize: "2rem",        // 중간 크기 텍스트
                        color: "#555",             // 회색 계열 텍스트
                        marginTop: "2rem",         // 위쪽 간격
                        marginLeft: "5rem"
                }}
                >
                    배우고, 도전하고, 성장하세요. <br />
                    <span
                        style={{
                            color: "#9c5e25",       // 갈색 계열 강조
                            fontWeight: 600,        // 강조 굵기
                        }}
                    >
                        당신의 실력을 수호하는 공간, Guardians.
                    </span>
                </p>


            </div>
        </div>
            );
}

export default Home;
