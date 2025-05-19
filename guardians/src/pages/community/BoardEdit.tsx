import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./BoardWrite.module.css";

const BoardEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<string>('');

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
                <button onClick={handleSubmit} className={styles.submitBtn}>수정</button>
                <button onClick={handleCancel} className={styles.cancelBtn}>취소</button>
            </div>
        </div>
    );
};

export default BoardEdit;
