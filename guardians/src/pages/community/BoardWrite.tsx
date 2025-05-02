import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface BoardWriteProps {
    onClose: () => void;
}

const BoardWrite = ({ onClose }: BoardWriteProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        alert(`제목: ${title}\n내용: ${content}`);
        setTitle('');
        setContent('');
        onClose();
    };

    const handleCancel = () => {
        navigate('/community/free'); // ✅ 취소 시 이 경로로 이동
    };



    return (
        <div
            style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                display: 'flex',               // flexbox 사용
                flexDirection: 'column',       // 세로 정렬
                alignItems: 'center',          // 가로 중앙 정렬

            }}
        >
            <input
                type="text"
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%',marginTop:'0.5rem', marginBottom: '1.5rem', padding: '0.5rem' }}
            />
            <textarea
                placeholder="내용을 입력해주세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: '100%', height: '350px', marginBottom: '0.5rem', padding: '0.5rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <button onClick={handleSubmit} style={{ marginRight: '0.5rem' }}>등록</button>
                <button onClick={handleCancel}>취소</button>
            </div>
        </div>
    );
};

export default BoardWrite;