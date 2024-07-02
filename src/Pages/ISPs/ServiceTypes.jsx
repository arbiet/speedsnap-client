import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../Utils/alertUtils";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ServiceTypes() {
    const { token } = useContext(AppContext);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [filteredServiceTypes, setFilteredServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchServiceTypes() {
            try {
                const res = await fetch('/api/service_types', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch service types');
                }
                const data = await res.json();
                setServiceTypes(data);
                setFilteredServiceTypes(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch service types. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchServiceTypes();
    }, [token]);

    const handleDelete = async (id) => {
        showWarningAlert(
            'Are you sure?',
            'Do you really want to delete this service type?',
            'Yes, delete it!',
            async () => {
                try {
                    const res = await fetch(`/api/service_types/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to delete service type');
                    }
                    setServiceTypes(serviceTypes.filter(type => type.id !== id));
                    setFilteredServiceTypes(filteredServiceTypes.filter(type => type.id !== id));
                    showSuccessAlert('Service Type Deleted', 'The service type has been deleted successfully!');
                } catch (error) {
                    console.error(error);
                    showErrorAlert('Error', 'Failed to delete service type. Please try again.');
                }
            }
        );
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        const filteredData = serviceTypes.filter(type =>
            type.service_types_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            type.service_provider.provider_name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredServiceTypes(filteredData);
    };

    const columns = [
        { name: 'Service Type Name', selector: row => row.service_types_name, sortable: true },
        { name: 'Service Provider', selector: row => row.service_provider.provider_name, sortable: true },
        { name: 'Created At', selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
        { name: 'Updated At', selector: row => new Date(row.updated_at).toLocaleString(), sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => navigate(`/service_types/${row.id}/edit`)} className="edit-btn">
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
                <h1 className="title">Service Types</h1>
                <div className="space-x-4">
                    <Link to="/service_types/new" className="primary-btn">Add New Service Type</Link>
                </div>
            </div>
            <div className="mb-4 container mx-auto">
                <input
                    type="text"
                    placeholder="Search service types"
                    value={searchText}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <div className="mb-4 container mx-auto">
                <DataTable
                    columns={columns.map(({ allowOverflow, button, ...rest }) => rest)}
                    data={filteredServiceTypes}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                />
            </div>
        </>
    );
}
