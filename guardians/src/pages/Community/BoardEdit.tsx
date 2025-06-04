import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./BoardWrite.module.css";
import Modal from "./components/Modal.tsx";

const BoardEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<string>('')

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalOnConfirm, setModalOnConfirm] = useState<() => void>(() => {});
    const [showCancelButton, setShowCancelButton] = useState(false);


    useEffect(() => {
        if (!id) return;
        axios.get(`/api/boards/${id}`, { withCredentials: true })
            .then(res => {
                const data = res.data.result.data;
                setTitle(data.title);
                setContent(data.content);
                setType(data.boardType.toLowerCase());
            });
    }, [id]);

    const handleSubmit = () => {
        axios.patch(`/api/boards/${id}`, {
            title,
            content
        }, { withCredentials: true })
            .then(() => {
                navigate(`/community/${type}`);
            })
            .catch(err => {
                console.error('게시글 수정 실패', err);
                alert('게시글 수정에 실패했습니다.');
            });
    };

    const handleSubmitClick = () => {
        if (!title || !content) {
            setModalMessage("제목과 내용을 모두 입력해주세요.");
            setModalOnConfirm(() => () => setShowModal(false));  // 확인 시 모달 닫기
            setShowCancelButton(false);  // 확인 버튼만
        } else {
            setModalMessage("정말 수정하시겠습니까?");
            setModalOnConfirm(() => handleSubmit);  // 확인 시 handleSubmit 호출
            setShowCancelButton(true);  // 확인/취소 버튼
        }
        setShowModal(true);  // 모달 열기
    };

    const handleCancel = () => {
        navigate(`/community/${type}`);
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.pageTitle}> 게시글 수정</h2>
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
                <button onClick={handleSubmitClick} className={styles.submitBtn}>수정</button>
                <button onClick={handleCancel} className={styles.cancelBtn}>취소</button>
            </div>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => {
                    modalOnConfirm();
                    setShowModal(false);
                }}
                message={modalMessage}
                showCancelButton={showCancelButton}
            />
        </div>
    );
};

export default BoardEdit;
