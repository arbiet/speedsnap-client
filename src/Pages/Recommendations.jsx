// src/Pages/Recommendations.jsx

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import DataTable from 'react-data-table-component';
import { showErrorAlert } from "../Utils/alertUtils";

export default function Recommendations() {
    const { token } = useContext(AppContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const res = await fetch('/api/speedtest/recommendations', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch recommendations');
                }
                const data = await res.json();
                setRecommendations(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch recommendations. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [token]);

    const columns = [
        { name: 'ISP Name', selector: row => row.isp_name, sortable: true },
        { name: 'City', selector: row => row.city, sortable: true },
        { name: 'District', selector: row => row.district, sortable: true },
        { name: 'Ranking', selector: row => row.ranking, sortable: true },
        { name: 'Average Download Speed', selector: row => row.avg_download_speed, sortable: true },
        { name: 'Average Upload Speed', selector: row => row.avg_upload_speed, sortable: true },
        { name: 'Average Jitter', selector: row => row.avg_jitter, sortable: true },
        { name: 'Average Packet Loss', selector: row => row.avg_packet_loss, sortable: true },
        { name: 'Average Ping', selector: row => row.avg_ping, sortable: true },
        { name: 'Average Latency', selector: row => row.avg_latency, sortable: true },
    ];

    return (
        <>
            <h1 className="title">ISP Recommendations</h1>
            <DataTable
                columns={columns}
                data={recommendations}
                progressPending={loading}
                pagination
                highlightOnHover
            />
        </>
    );
}
