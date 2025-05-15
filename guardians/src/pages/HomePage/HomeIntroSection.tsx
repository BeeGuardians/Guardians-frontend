import {useAuth} from "../../context/AuthContext";
import {motion} from "framer-motion";
import dev1 from "../../assets/dev1.png";
import dev2 from "../../assets/dev2.png";
import dev3 from "../../assets/dev3.png";


function HomeIntroSection() {
    const {user} = useAuth();
    const isLoggedIn = !!user;

    const concerns = [
        {
            img: dev3,
            alt: "user1",
            text: "보안? 해킹? 도대체 어떻게 시작해야 될지...",
            align: "left"
        },
        {
            img: dev2,
            alt: "user2",
            text: "PC에 환경 세팅하기가 너무 복잡해요...!",
            align: "right"
        },
        {
            img: dev1,
            alt: "user3",
            text: "실습할 공간이 없는데... 어디서 해보지?",
            align: "left"
        }
    ];
    return (
        <div style={{ backgroundColor: "#FFF7E8", padding: "5rem 10vw" }}>
            <motion.h3
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.7 }}
                style={{ fontSize: "2rem", marginBottom: "8rem", fontWeight: "650", color: "#333", textAlign: "center" }}
            >
                🤔 이런 고민, 해보신 적 있으신가요?
            </motion.h3>

            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ marginBottom: "10rem" }}
            >
                {concerns.map(({ img, alt, text, align }, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            display: "flex",
                            flexDirection: align === "right" ? "row-reverse" : "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "3rem",
                            width: "100%",
                            maxWidth: "980px",
                            margin: "0 auto"
                        }}
                    >
                        <img
                            src={img}
                            alt={alt}
                            style={{
                                width: "140px",
                                height: "140px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                backgroundColor: "#f1f3f5",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                            }}
                        />
                        <div
                            style={{
                                background: "#fff",
                                padding: "1.5rem 2rem",
                                borderRadius: "20px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                                fontSize: "1.15rem",
                                color: "#333",
                                position: "relative",
                                maxWidth: "520px",
                                lineHeight: "1.8"
                            }}
                        >
                            “{text}”
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    [align === "right" ? "right" : "left"]: "-12px",
                                    transform: "translateY(-50%)",
                                    width: 0,
                                    height: 0,
                                    borderTop: "12px solid transparent",
                                    borderBottom: "12px solid transparent",
                                    borderLeft: align === "right" ? "none" : "12px solid #fff",
                                    borderRight: align === "right" ? "12px solid #fff" : "none",
                                }}
                            />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            <motion.h3
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{
                    fontSize: "2rem",
                    marginBottom: "4rem",
                    fontWeight: "650",
                    color: "#333",
                    textAlign: "center"
                }}
            >
                👨‍💻 보안, 더는 어렵지 않아요. 가디언즈가 도와드릴게요!
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{
                    fontSize: "1.1rem",
                    color: "#444",
                    lineHeight: "2",
                    marginBottom: "0rem",
                    maxWidth: "50rem",
                    whiteSpace: "pre-line",
                    textAlign: "center",
                    margin: "0 auto"
                }}
            >
                <strong>가디언즈</strong>는 단순한 문제 풀이가 아닌
                실제 서비스처럼 동작하는 <strong>컨테이너 기반 워게임 환경</strong>을 제공합니다.<br />
                클릭 한 번이면 <strong>나만의 실습 환경</strong>이 바로 생성되고
                설치나 복잡한 설정 없이 <strong>브라우저만으로 해킹 실습</strong>이 가능합니다.<br />
                입문자부터 전문가까지,
                누구나 사용할 수 있도록 <strong>최적화된 환경</strong>을 제공합니다.
                <br />
                <br />
                    <span
                        style={{
                            color: "#ff922b",
                            fontWeight: 650,
                            fontSize: "1.8rem",
                            display: "inline-block",
                            marginTop: "1.5rem",
                            marginBottom: "5.5rem",
                        }}
                    >
                      지금, 당신의 보안 여정을 시작해보세요!
                    </span>
            </motion.p>

            {/* 기능 강조 섹션 */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                    visible: {
                        transition: { staggerChildren: 0.2 }
                    }
                }}
                style={{
                    display: "flex",
                    gap: "3rem",
                    flexWrap: "wrap"
                }}
            >
                {[
                    {
                        title: "⚔️ 실전과 같은 문제",
                        desc: "단순한 퀴즈가 아닙니다. 실제 서비스 환경에서 발생할 수 있는 취약점을 기반으로 구성된 워게임을 제공합니다.",
                        color: "#3B82F6"
                    },
                    {
                        title: "🏆 랭킹과 성과",
                        desc: "문제를 해결하면 점수가 오르고 랭킹이 반영됩니다. 정해진 조건을 달성하면 뱃지도 얻을 수 있어요!",
                        color: "#845ef7"
                    },
                    {
                        title: "🌱 성장 기반 시스템",
                        desc: "나의 문제풀이 이력, 성취율, 학습 로그까지 대시보드에서 한눈에. 성장을 숫자로 체감해보세요.",
                        color: "#20c997"
                    }
                ].map((item, i) => (
                    <motion.div
                        key={item.title}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        style={{
                            flex: "1",
                            minWidth: "250px",
                            background: "#fff",
                            padding: "2rem",
                            borderRadius: "12px",
                            boxShadow: "0 0 15px rgba(0,0,0,0.05)",
                            border: "1px solid #eee"
                        }}
                    >
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: item.color }}>
                            {item.title}
                        </h3>
                        <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.6" }}>{item.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* 사용자 후기 섹션 */}
            <div style={{marginTop: "10rem"}}>
                <motion.h3
                    initial={{opacity: 0, y: 40}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}
                    style={{
                        fontSize: "2rem",
                        marginBottom: "3rem",
                        fontWeight: 650,
                        color: "#333",
                        textAlign: "center",
                    }}
                >
                    💬 가디언즈 유저들의 생생한 후기!
                </motion.h3>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                    variants={{
                        visible: {
                            transition: {staggerChildren: 0.25}
                        }
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                        maxWidth: "800px",
                        margin: "0 auto",
                    }}
                >
                    {[
                        {
                            quote: "가디언즈 덕분에 보안 공부가 진짜 재밌어졌어요!",
                            author: "– gda1441, 대학생"
                        },
                        {
                            quote: "처음엔 어려웠지만, 성장하는 게 눈에 보여서 계속 하게 돼요.",
                            author: "– 냥냥이2, 취준생"
                        },
                        {
                            quote: "대시보드 기능이 진짜 미쳤어요. 내 실력 곡선이 보여요.",
                            author: "– 나홍박사님을아세요, 직장인"
                        },
                        {
                            quote: "다른 플랫폼과 비교 불가. 랭킹 시스템이 몰입감 최고!",
                            author: "– 햌엌, CTF 마니아"
                        }
                    ].map(({quote, author}, idx) => (
                        <motion.blockquote
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1 }
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{
                                backgroundColor: "#FFFDF9",
                                border: "1px solid #ffe1ba",
                                padding: "2rem",
                                borderRadius: "16px",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                                fontSize: "1.05rem",
                                color: "#444",
                                fontStyle: "normal",
                                position: "relative",
                                width: "100%",
                                transition: "transform 0.3s ease",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}>
                                <p style={{
                                    lineHeight: "1.8",
                                    fontWeight: 400,
                                    margin: 0,
                                    fontSize: "1.1rem"
                                }}>
                                    “{quote}”
                                </p>
                                <div style={{
                                    textAlign: "right",
                                    color: "#FFA94D",
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                }}>
                                    {author}
                                </div>
                            </div>

                            {/* 말풍선 느낌 꼬리 - 선택사항 */}
                            <div style={{
                                position: "absolute",
                                bottom: "-10px",
                                left: "2rem",
                                width: 0,
                                height: 0,
                                borderLeft: "10px solid transparent",
                                borderRight: "10px solid transparent",
                                borderTop: "10px solid #FFFDF9",
                            }} />
                        </motion.blockquote>
                    ))}
                </motion.div>
            </div>

            {/* CTA 버튼 */}
            <motion.div
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 1.2, duration: 0.6}}
                style={{
                    marginTop: "6rem",
                    padding: "3rem",
                    background: "#FFF7E8",
                    borderRadius: "16px",
                    // border: "1px solid #ffe8cc",
                    // boxShadow: "0 12px 24px rgba(255,169,77,0.1)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0rem",
                }}
            >
                <motion.h4
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 1.3}}
                    style={{
                        fontSize: "1.8rem",
                        fontWeight: "650",
                        color: "#333",
                    }}
                >
                    지금 바로 출발해보세요!
                </motion.h4>

                <motion.p
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 1.5}}
                    style={{
                        fontSize: "1.05rem",
                        maxWidth: "520px",
                        color: "#555",
                        lineHeight: "1.1",
                        marginBottom: "3.5rem",
                    }}
                >
                    실습으로 배우고, 성장하고, 증명하는 <strong>진짜 여정</strong>이 시작됩니다.
                </motion.p>

                <motion.button
                    whileHover={{scale: 1.05, y: -2, boxShadow: "0 12px 30px rgba(255,169,77,0.4)"}}
                    animate={{scale: [1, 1.02, 1]}}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    onClick={() => window.location.href = isLoggedIn ? "/dashboard" : "/signup"}
                    style={{
                        backgroundColor: "#ffa94d",
                        color: "white",
                        padding: "1rem 2.4rem",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "1.2rem",
                        fontWeight: 650,
                        boxShadow: "0 8px 20px rgba(255,169,77,0.3)",
                        cursor: "pointer",
                    }}
                >
                    {isLoggedIn ? "내 대시보드로 🧭" : "회원가입하고 시작하기 🚀"}
                </motion.button>
            </motion.div>

        </div>
    );
}

export default HomeIntroSection;
