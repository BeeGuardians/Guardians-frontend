import React from "react";
import styles from "./WargameUserStatusCard.module.css";

export type UserStatus = {
    username: string;
    startedAt: string;
    isFirstSolver?: boolean;
};

interface Props {
    users: UserStatus[];
}

const WargameUserStatusCard: React.FC<Props> = ({ users }) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>🔥 현재 해결중인 유저</h3>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>유저명</th>
                    <th>접속 시간</th>
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan={2} style={{ textAlign: "center", color: "#888" }}>
                            현재 해결중인 사용자가 없습니다.
                        </td>
                    </tr>
                ) : (
                    users.map((user, index) => (
                        <tr
                            key={index}
                            className={user.isFirstSolver ? styles.firstSolver : ""}
                        >
                            <td>{user.username}</td>
                            <td>{new Date(user.startedAt).toLocaleTimeString()}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default WargameUserStatusCard;
