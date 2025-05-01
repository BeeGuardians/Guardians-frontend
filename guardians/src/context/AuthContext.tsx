// context/AuthContext.tsx
import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";

type User = {
    id: number;
    email: string;
    username: string;
};

type AuthContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 🔥 로딩 여부

    const login = (userData: User) => {
        console.log("📌 login() 호출됨", userData);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:8080/api/users/logout", {}, {withCredentials: true});
            setUser(null);
            window.location.href = "/"; // ✅ 새로고침으로 반영
        } catch (err) {
            console.error("❌ 로그아웃 실패", err);
        }
    };


    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/check", {withCredentials: true})
            .then((res) => {
                if (res.data.result.data === true) {
                    return axios.get("http://localhost:8080/api/users/me", {
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
                setIsLoading(false); // ✅ 마지막에 로딩 끝 표시
            });
    }, []);

    return (
        <AuthContext.Provider value={{user, login, logout, isLoading}}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext 사용 오류");
    return context;
};
