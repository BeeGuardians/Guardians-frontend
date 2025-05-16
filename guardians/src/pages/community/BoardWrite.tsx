import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BoardWrite.module.css";

interface BoardWriteProps {
    type: string;
}

const BoardWrite = ({ type }: BoardWriteProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        axios.post(`/api/boards?type=${type}`, {
            title,
            content
        }, { withCredentials: true })
            .then(() => {
                navigate(`/community/${type.toLowerCase()}`);
            })
            .catch(err => {
                console.error('게시글 등록 실패', err);
                alert('게시글 등록에 실패했습니다.');
            });
    };

    const handleCancel = () => {
        navigate(`/community/${type.toLowerCase()}`);
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
        </div>
    );
};

export default BoardWrite;
