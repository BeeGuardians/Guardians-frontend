import React from "react";
import styles from "./WargameUserStatusCard.module.css";

export type UserStatus = {
    username: string;
    startedAt: string;
    isFirstSolver?: boolean;
};

interface Props {
    users?: UserStatus[];
}

const WargameUserStatusCard: React.FC<Props> = ({ users }) => {
    if (!users || users.length === 0) return null;

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>
                <img
                    src="/src/assets/users.png"
                    style={{
                        width: "1.3em",
                        height: "1.3em",
                        verticalAlign: "text-bottom",
                        marginLeft: "0.2em",
                        marginRight: "0.6em",
                    }}
                />
                현재 해결중인 유저
            </h3>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>유저명</th>
                    <th>접속 시간</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr
                        key={index}
                        className={user.isFirstSolver ? styles.firstSolver : ""}
                    >
                        <td>{user.username}</td>
                        <td>{new Date(user.startedAt).toLocaleTimeString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default WargameUserStatusCard;
