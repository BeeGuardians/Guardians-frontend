// src/components/InfoModal.tsx
import React from 'react';
import styles from './Modal.module.css'; // Modal.module.css를 사용한다고 가정

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.confirmBtn} onClick={onClose}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;