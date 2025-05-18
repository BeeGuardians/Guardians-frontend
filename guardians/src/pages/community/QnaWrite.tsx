import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BoardWrite.module.css";

type Wargame = {
    id: number;
    title: string;
};

const QnaWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [wargames, setWargames] = useState<Wargame[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Wargame | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/wargames")
            .then(res => {
                const data = res.data.result.data;
                setWargames(data);
            })
            .catch(err => {
                console.error("워게임 목록 불러오기 실패", err);
            });
    }, []);

    const filtered = wargames.filter(w =>
        w.title?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (w: Wargame) => {
        setSelected(w);
        setSearch(w.title);
        setShowDropdown(false);
    };

    const handleSubmit = () => {
        if (!title || !content || !selected) {
            alert("제목, 내용, 워게임을 모두 입력해주세요.");
            return;
        }

        axios.post(`/api/qna/questions`, {
            title,
            content,
            wargameId: selected.id,
        }, { withCredentials: true })
            .then(() => {
                alert("질문 등록 완료!");
                navigate("/community/qna");
            })
            .catch(err => {
                console.error('질문 등록 실패', err);
                alert('질문 등록에 실패했습니다.');
            });
    };

    const handleCancel = () => {
        navigate("/community/qna");
    };

    return (
        <div className={styles.wrapper} style={{ position: "relative" }}>
            <h2 className={styles.pageTitle}>질문 작성</h2>

            <input
                type="text"
                placeholder="워게임 제목 검색"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className={styles.input}
            />

            {showDropdown && search && (
                <ul style={{
                    listStyle: "none",
                    padding: 0,
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    marginTop: "0.5rem",
                    maxHeight: "150px",
                    overflowY: "auto",
                    background: "#fff",
                    position: "absolute",
                    zIndex: 10,
                    width: "100%",
                }}>
                    {filtered.length > 0 ? (
                        filtered.map(w => (
                            <li
                                key={w.id}
                                onClick={() => handleSelect(w)}
                                style={{
                                    padding: "0.6rem 1rem",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                    backgroundColor: selected?.id === w.id ? "#fff7ed" : "#fff"
                                }}
                            >
                                {w.title}
                            </li>
                        ))
                    ) : (
                        <li style={{ padding: "0.6rem 1rem", color: "#999" }}>
                            일치하는 워게임이 없습니다.
                        </li>
                    )}
                </ul>
            )}

            {selected && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
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
                <button onClick={handleSubmit} className={styles.submitBtn}>등록</button>
                <button onClick={handleCancel} className={styles.cancelBtn}>취소</button>
            </div>
        </div>
    );
};

export default QnaWrite;
