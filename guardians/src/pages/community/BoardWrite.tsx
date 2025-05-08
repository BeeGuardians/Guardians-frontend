import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

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
        <div style={{ width: '70%', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
                type="text"
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '1rem' }}
            />
            <textarea
                placeholder="내용을 입력해주세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: '100%', height: '370px', marginBottom: '1rem', padding: '0.75rem', fontSize: '1rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <button onClick={handleSubmit} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#FFA94D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>등록</button>
                <button onClick={handleCancel} style={{ padding: '0.5rem 1rem', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
            </div>
        </div>
    );
};


export default BoardWrite;