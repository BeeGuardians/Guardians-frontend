import { useState } from "react";
import { Link } from "react-router-dom"; // 페이지 이동을 위해 Link 컴포넌트를 사용합니다.
import styles from "./Footer.module.css";

// --- 추가: 모달 컴포넌트 ---
// 모달의 UI를 담당하는 재사용 가능한 컴포넌트를 만듭니다.
interface PolicyModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

const PolicyModal = ({ title, content, onClose }: PolicyModalProps) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{title}</h2>
                {/* 내용이 많고 줄바꿈이 필요하므로 pre 태그를 사용합니다. */}
                <pre className={styles.modalTextContent}>{content}</pre>
                <button className={styles.modalCloseButton} onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};


function Footer() {
    // --- 추가: 모달의 표시 여부를 관리할 상태(state) ---
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    // --- 추가: 모달에 표시될 약관 내용 ---
    const TERMS_CONTENT = `제1조 (목적)
이 약관은 가디언즈(이하 "회사")가 제공하는 모의 해킹 성장 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"라 함은 구현되는 단말기(PC, 모바일, 태블릿 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 가디언즈 관련 제반 서비스를 의미합니다.
2. "회원"이라 함은 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.

최종 수정일: 2025년 5월 20일`;

    const PRIVACY_CONTENT = `[개인정보 수집 및 이용 동의]
(주)가디언즈(이하 ‘회사’)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립·공개합니다.

1. 개인정보의 처리 목적
회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
 가. 홈페이지 회원 가입 및 관리
   회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리 등을 목적으로 개인정보를 처리합니다.

최종 수정일: 2025년 5월 20일`;

    return (
        <footer className={styles.footer}>
            <div className={styles.sectionWrapper}>
                <div className={styles.section}>
                    <h4>전체</h4>
                    {/* 일반 링크들은 react-router-dom의 Link 컴포넌트로 변경 */}
                    <Link to="/community/inquiry" className={styles.link}>문의 게시판</Link>
                    {/* --- 수정: a 태그를 span으로 바꾸고 onClick 이벤트로 모달을 띄웁니다 --- */}
                    <span className={styles.link} onClick={() => setShowTermsModal(true)}>
                        이용약관
                    </span>
                    <span className={styles.link} onClick={() => setShowPrivacyModal(true)}>
                        개인정보 처리방침
                    </span>
                </div>
                <div className={styles.section}>
                    <h4>워게임</h4>
                    <Link to="/wargame" className={styles.link}>전체 워게임</Link>
                    <Link to="/community/qna" className={styles.link}>워게임 Q&A</Link>
                </div>
                <div className={styles.section}>
                    <h4>랭킹</h4>
                    <Link to="/ranking" className={styles.link}>전체 랭킹</Link>
                </div>
                <div className={styles.section}>
                    <h4>커뮤니티</h4>
                    <Link to="/community/free" className={styles.link}>자유게시판</Link>
                    <Link to="/community/study" className={styles.link}>스터디모집</Link>
                    <Link to="/community/inquiry" className={styles.link}>문의 게시판</Link>
                </div>
                <div className={styles.section}>
                    <h4>학습</h4>
                    <Link to="/dashboard" className={styles.link}>내 대시보드</Link>
                    <Link to="/mypage" className={styles.link}>나의 기록</Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>Copyright © 2025 Guardians. All rights reserved.</p>
                <p>문의: honeyguardians@gmail.com</p>
            </div>

            {/* --- 추가: 상태에 따라 모달을 조건부로 렌더링 --- */}
            {showTermsModal && (
                <PolicyModal
                    title="이용약관"
                    content={TERMS_CONTENT}
                    onClose={() => setShowTermsModal(false)}
                />
            )}
            {showPrivacyModal && (
                <PolicyModal
                    title="개인정보 처리방침"
                    content={PRIVACY_CONTENT}
                    onClose={() => setShowPrivacyModal(false)}
                />
            )}
        </footer>
    );
}

export default Footer;