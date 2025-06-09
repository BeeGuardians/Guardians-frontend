import React, { useState, useEffect } from 'react';
import AdminSidebar from '../AdminSidebar';
import styles from './AdminDashboard.module.css'; // 실제 CSS 모듈 경로로 수정하세요
import axios from 'axios';

interface ServiceStatus {
    id: string;
    name: string;
    icon: string;
    status: string;
    details: string;
    adminLink: string;
}

interface BackendHealthResponse {
    serviceName: string;
    status: string; // "HEALTHY", "UNHEALTHY", "ERROR_FETCHING", "DEGRADED"
    message: string;
    rawDetails?: string;
}

const ServiceCard: React.FC<ServiceStatus> = ({ name, icon, status, details, adminLink }) => {
// ServiceCard 컴포넌트 내부
    const getStatusColor = () => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('healthy')) return styles.statusHealthy;
        if (lowerStatus.includes('degraded')) return styles.statusWarning;
        if (lowerStatus.includes('unhealthy')) return styles.statusError;
        if (lowerStatus.includes('error') || lowerStatus.includes('error_fetching') || lowerStatus.includes('failed')) return styles.statusError;
        if (lowerStatus.includes('checking')) return styles.statusInfo;
        return styles.statusInfo;
    };

    return (
        <div className={styles.serviceCard}>
            <div className={styles.cardHeader}>
                <span className={styles.serviceIcon}>{icon}</span>
                <h3 className={styles.serviceName}>{name}</h3>
            </div>
            <div className={styles.cardBody}>
                <p className={`${styles.serviceStatus} ${getStatusColor()}`}>
                    Status: {status}
                </p>
                <p className={styles.serviceDetails}>{details}</p>
            </div>
            <div className={styles.cardFooter}>
                <a href={adminLink} target="_blank" rel="noopener noreferrer" className={styles.adminLink}>
                    Go to Admin →
                </a>
            </div>
        </div>
    );
};

const AdminDashboardPage: React.FC = () => {
    const serviceUiUrls = {
        // ✨ 각 서비스 UI URL을 실제 환경에 맞게 정확히 설정해주세요 ✨
        argocd: 'http://argocd.admin.com:30101', // ArgoCD UI (이제 HTTP로 접근하신다고 가정)
        jenkins: 'http://jenkins.admin.com:30501',
        grafana: 'http://grafana.admin.com:30601',
        harbor: 'https://harbor.example.com:31443', // Harbor는 HTTPS 유지
    };

    const initialServices: ServiceStatus[] = [
        {
            id: 'argocd',
            name: 'ArgoCD',
            icon: '🚀',
            status: 'Checking...',
            details: 'Loading health status...', // 초기 메시지
            adminLink: serviceUiUrls.argocd,
        },
        {
            id: 'jenkins',
            name: 'Jenkins',
            icon: '🛠️',
            status: 'Checking...',
            details: 'Loading health status...',
            adminLink: serviceUiUrls.jenkins,
        },
        {
            id: 'grafana',
            name: 'Grafana',
            icon: '📊',
            status: 'Checking...',
            details: 'Loading health status...',
            adminLink: serviceUiUrls.grafana,
        },
        {
            id: 'harbor',
            name: 'Harbor',
            icon: '🐳',
            status: 'Checking...',
            details: 'Loading health status...',
            adminLink: serviceUiUrls.harbor,
        },
    ];

    const [services, setServices] = useState<ServiceStatus[]>(initialServices);

    const mapBackendStatusToFrontend = (backendStatus: string): string => {
        switch (backendStatus) {
            case "HEALTHY": return "Healthy";
            case "UNHEALTHY": return "Unhealthy";
            case "DEGRADED": return "Degraded";
            case "ERROR_FETCHING": return "Error Fetching";
            default: return backendStatus;
        }
    };

    const fetchServiceHealth = async (serviceId: string, apiEndpointSuffix: string) => {
        try {
            const response = await axios.get<BackendHealthResponse>(`/api/admin/health/${apiEndpointSuffix}`);
            const healthData = response.data;

            setServices(prevServices =>
                prevServices.map(service =>
                    service.id === serviceId
                        ? {
                            ...service,
                            status: mapBackendStatusToFrontend(healthData.status),
                            details: healthData.message,
                        }
                        : service
                )
            );
        } catch (error) {
            console.error(`Failed to fetch health for ${serviceId} from /api/admin/health/${apiEndpointSuffix}:`, error);
            setServices(prevServices =>
                prevServices.map(service =>
                    service.id === serviceId
                        ? { ...service, status: 'Error Fetching API', details: 'Backend API request failed.' }
                        : service
                )
            );
        }
    };

    useEffect(() => {
        // 1. 모든 서비스의 상태를 가져오는 함수 (Harbor 포함)
        const fetchAllServiceHealth = () => {
            fetchServiceHealth('argocd', 'argocd');
            fetchServiceHealth('jenkins', 'jenkins');
            fetchServiceHealth('grafana', 'grafana');
            // Harbor는 API 호출을 하지 않으므로 여기서 호출하지 않습니다.
        };

        fetchAllServiceHealth();
        const intervalId = setInterval(fetchAllServiceHealth, 7000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // 서비스들의 상태가 변경될 때마다 이 로직이 실행됩니다.
        const argo = services.find(s => s.id === 'argocd');
        const jenkins = services.find(s => s.id === 'jenkins');
        const grafana = services.find(s => s.id === 'grafana');
        const harbor = services.find(s => s.id === 'harbor');

        if (!argo || !jenkins || !grafana || !harbor) return;

        const isUnhealthy = (status: string) => {
            const lower = status.toLowerCase();
            return lower.includes('unhealthy') || lower.includes('error');
        };

        const areAllOthersUnhealthy = isUnhealthy(argo.status) && isUnhealthy(jenkins.status) && isUnhealthy(grafana.status);

        if (areAllOthersUnhealthy) {
            if (harbor.status !== 'error') {
                setServices(prev => prev.map(s =>
                    s.id === 'harbor'
                        ? { ...s, status: 'Error Fetching', details: 'System-wide failure detected.' }
                        : s
                ));
            }
        } else {
            // 그 외의 경우, Harbor가 이미 Healthy가 아니라면 상태 변경
            if (harbor.status !== 'Healthy') {
                setServices(prev => prev.map(s =>
                    s.id === 'harbor'
                        ? { ...s, status: 'Healthy', details: 'Status is not checked via API. Assumed to be healthy.' }
                        : s
                ));
            }
        }
    }, [services]);

    return (
        <div style={{
            paddingTop: "120px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            backgroundColor: "#f8f9fa",
            minHeight: "calc(100vh - 60px)"
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                gap: "2rem",
                alignItems: "flex-start"
            }}>
                <AdminSidebar />
                <div style={{ flex: 1 }} className={styles.dashboardContentContainer}>
                    <h2 className={styles.dashboardTitle}>⚙️ DevOps 관리 현황</h2>
                    <h3>[상태 조회는 내부망에서만 가능합니다]</h3>
                    <div className={styles.dashboardGrid}>
                        {services.map(service => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                name={service.name}
                                icon={service.icon}
                                status={service.status}
                                details={service.details}
                                adminLink={service.adminLink}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;