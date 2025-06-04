import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BoardWrite.module.css";
import Modal from "./components/Modal.tsx";


interface BoardWriteProps {
    type: string;
}

const BoardWrite = ({ type }: BoardWriteProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [confirmType, setConfirmType] = useState<"submit" | "cancel" | null>(null);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!title.trim()) {
            setModalMessage("제목을 입력하세요.");
            setModalOpen(true);
            return;
        }

        if (!content.trim()) {
            setModalMessage("내용을 입력하세요.");
            setModalOpen(true);
            return;
        }

        setConfirmType("submit");
    };

    const handleCancel = () => {
        setConfirmType("cancel"); // 취소 전 확인 모달 띄움
    };

    const handleConfirm = () => {
        if (confirmType === "submit") {
            axios.post(`/api/boards?type=${type}`, {
                title,
                content
            }, {withCredentials: true})
                .then(() => {
                    navigate(`/community/${type.toLowerCase()}`);
                })
                .catch(err => {
                    const rawStatus = err.response?.data?.result?.status;
                    const status = typeof rawStatus === "string" ? parseInt(rawStatus) : rawStatus;
                    const message = err.response?.data?.result?.message || '게시글 등록에 실패했습니다.';
                    if (status === 400 && message) {
                        setModalMessage(message);
                    } else {
                        setModalMessage("게시글 등록에 실패했습니다.");
                    }
                    setModalOpen(true);
                });
        }

        if (confirmType === "cancel") {
            navigate(`/community/${type.toLowerCase()}`);
        }
        setConfirmType(null);
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.pageTitle}> 게시글 작성</h2>
            <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
            />
            <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={styles.textarea}
            />
            <div className={styles.btnGroup}>
                <button onClick={handleSubmit} className={styles.submitBtn}>등록</button>
                <button onClick={handleCancel} className={styles.cancelBtn}>취소</button>
            </div>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => setModalOpen(false)}
                confirmText="확인"
                message={modalMessage}
                showCancelButton={false}
            />
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => setModalOpen(false)}
                confirmText="확인"
                message={modalMessage}
                showCancelButton={false}
            />

            {/* 등록/취소 확인용 모달 */}
            <Modal
                isOpen={!!confirmType}
                onClose={() => setConfirmType(null)}
                onConfirm={handleConfirm}
                confirmText="예"
                cancelText="아니오"
                message={
                    confirmType === "submit"
                        ? "글을 등록하시겠습니까?"
                        : "글 작성을 취소하시겠습니까?"
                }
            />
        </div>
    );
};

export default BoardWrite;
