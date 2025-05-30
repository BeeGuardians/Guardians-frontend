import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import styles from "./BoardWrite.module.css";
import Modal from "../Community/components/Modal.tsx";

type Wargame = {
    id: number;
    title: string;
};

type Question = {
    id: number;
    title: string;
    content: string;
    wargameId: number;
    wargameTitle: string;
};

const QnaEdit = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selected, setSelected] = useState<Wargame | null>(null);

    const navigate = useNavigate();

    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalOnConfirm, setModalOnConfirm] = useState<() => void>(() => {});
    const [showCancelButton, setShowCancelButton] = useState(false);


    useEffect(() => {
        axios.get(`/api/qna/questions/${id}`)
            .then(res => {
                const data: Question = res.data.result.data;
                setTitle(data.title);
                setContent(data.content);
                setSelected({ id: data.wargameId, title: data.wargameTitle });
            })
            .catch(err => {
                console.error("질문 상세 불러오기 실패", err);
            });
    }, [id, navigate]);

    const handleSubmitClick = () => {
        if (!title || !content || !selected) {
            setModalMessage("제목, 내용, 워게임을 모두 입력해주세요.");
            setModalOnConfirm(() => () => setShowModal(false));
            setShowCancelButton(false);
            setShowModal(true);
            return;
        }

        setModalMessage("질문을 수정하시겠습니까?");
        setModalOnConfirm(() => handleSubmit);
        setShowCancelButton(true);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            await axios.patch(`/api/qna/questions/${id}`, {
                title,
                content,
                wargameId: selected!.id
            }, { withCredentials: true });
           navigate("/community/qna");
        } catch (err) {
            console.error('질문 수정 실패', err);
        }
    };

    const handleCancel = () => {
        navigate("/community/qna");
    };

    return (
        <div className={styles.wrapper} style={{ position: "relative" }}>
            <h2 className={styles.pageTitle}>질문 수정</h2>


            {selected && (
                <div style={{ marginTop: "-1rem", marginBottom: "1rem", fontSize: "1rem", color: "#666" }}>
                    선택된 워게임: <strong>{selected.title}</strong>
                </div>
            )}

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

export default QnaEdit;
