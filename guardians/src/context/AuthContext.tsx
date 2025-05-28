import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

type User = {
    id: number;
    email: string;
    username: string;
    role?: 'USER' | 'ADMIN'; // ✨ role 필드 추가 (백엔드에서 'ADMIN' 또는 'USER' 값을 준다고 가정) ✨
    profileImageUrl?: string; // profileImageUrl도 추가
};

type AuthContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate(); // ✅ 새로고침 없이 페이지 이동

    const login = (userData: User) => {
        console.log("📌 login() 호출됨", userData);
        setUser(userData);
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await axios.post(`${API_BASE}/api/users/logout`, {}, { withCredentials: true });
            setUser(null); // ✅ 유저 상태 날림
            navigate("/"); // ✅ 새로고침 없이 이동
        } catch (err) {
            console.error("로그아웃 실패", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        axios
            .get(`${API_BASE}/api/users/check`, { withCredentials: true })
            .then((res) => {
                if (res.data.result.data === true) {
                    return axios.get(`${API_BASE}/api/users/me`, {
                        withCredentials: true,
                    });
                } else {
                    throw new Error("세션 없음");
                }
            })
            .then((res) => {
                setUser(res.data.result.data); // ✅ 사용자 정보 세팅
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false); // ✅ 로딩 끝
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext 사용 오류");
    return context;
};
