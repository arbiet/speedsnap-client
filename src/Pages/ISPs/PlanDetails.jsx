import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../Utils/alertUtils";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function PlanDetails() {
    const { token } = useContext(AppContext);
    const [planDetails, setPlanDetails] = useState([]);
    const [filteredPlanDetails, setFilteredPlanDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPlanDetails() {
            try {
                const res = await fetch('/api/plan_details', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch plan details');
                }
                const data = await res.json();
                setPlanDetails(data);
                setFilteredPlanDetails(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch plan details. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchPlanDetails();
    }, [token]);

    const handleDelete = async (id) => {
        showWarningAlert(
            'Are you sure?',
            'Do you really want to delete this plan detail?',
            'Yes, delete it!',
            async () => {
                try {
                    const res = await fetch(`/api/plan_details/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to delete plan detail');
                    }
                    setPlanDetails(planDetails.filter(detail => detail.id !== id));
                    setFilteredPlanDetails(filteredPlanDetails.filter(detail => detail.id !== id));
                    showSuccessAlert('Plan Detail Deleted', 'The plan detail has been deleted successfully!');
                } catch (error) {
                    console.error(error);
                    showErrorAlert('Error', 'Failed to delete plan detail. Please try again.');
                }
            }
        );
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        const filteredData = planDetails.filter(detail =>
            detail.plan_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            detail.service_provider.provider_name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredPlanDetails(filteredData);
    };

    const columns = [
        { name: 'Plan Name', selector: row => row.plan_name, sortable: true },
        { name: 'Price', selector: row => row.price, sortable: true },
        { name: 'Download Speed', selector: row => row.download_speed, sortable: true },
        { name: 'Upload Speed', selector: row => row.upload_speed, sortable: true },
        { name: 'Service Provider', selector: row => row.service_provider.provider_name, sortable: true },
        { name: 'Created At', selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
        { name: 'Updated At', selector: row => new Date(row.updated_at).toLocaleString(), sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => navigate(`/plan_details/${row.id}/edit`)} className="edit-btn">
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="delete-btn">
                        <FaTrash />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-4 container mx-auto">
                <h1 className="title">Plan Details</h1>
                <div className="space-x-4">
                    <Link to="/plan_details/new" className="primary-btn">Add New Plan Detail</Link>
                </div>
            </div>
            <div className="mb-4 container mx-auto">
                <input
                    type="text"
                    placeholder="Search plan details"
                    value={searchText}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <div className="mb-4 container mx-auto">
                <DataTable
                    columns={columns.map(({ allowOverflow, button, ...rest }) => rest)}
                    data={filteredPlanDetails}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                />
            </div>
        </>
    );
}
