import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../Utils/alertUtils";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ServiceProviders() {
    const { token } = useContext(AppContext);
    const [providers, setProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProviders() {
            try {
                const res = await fetch('/api/service_providers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch service providers');
                }
                const data = await res.json();
                setProviders(data);
                setFilteredProviders(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch service providers. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchProviders();
    }, [token]);

    const handleDelete = async (id) => {
        showWarningAlert(
            'Are you sure?',
            'Do you really want to delete this service provider?',
            'Yes, delete it!',
            async () => {
                try {
                    const res = await fetch(`/api/service_providers/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to delete service provider');
                    }
                    setProviders(providers.filter(provider => provider.id !== id));
                    setFilteredProviders(filteredProviders.filter(provider => provider.id !== id));
                    showSuccessAlert('Service Provider Deleted', 'The service provider has been deleted successfully!');
                } catch (error) {
                    console.error(error);
                    showErrorAlert('Error', 'Failed to delete service provider. Please try again.');
                }
            }
        );
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        const filteredData = providers.filter(provider =>
            provider.provider_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            provider.email.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredProviders(filteredData);
    };

    const columns = [
        { name: 'Provider Name', selector: row => row.provider_name, sortable: true },
        { name: 'Email', selector: row => row.email, sortable: true },
        { name: 'Contact Number', selector: row => row.contact_number, sortable: true },
        { name: 'Address', selector: row => row.address, sortable: true },
        { name: 'Created At', selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
        { name: 'Updated At', selector: row => new Date(row.updated_at).toLocaleString(), sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => navigate(`/service_providers/${row.id}/edit`)} className="edit-btn">
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
                <h1 className="title">Service Providers</h1>
                <div className="space-x-4">
                    <Link to="/service_providers/new" className="primary-btn">Add New Service Provider</Link>
                </div>
            </div>
            <div className="mb-4 container mx-auto">
                <input
                    type="text"
                    placeholder="Search service providers"
                    value={searchText}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <div className="mb-4 container mx-auto">
                <DataTable
                    columns={columns.map(({ allowOverflow, button, ...rest }) => rest)}
                    data={filteredProviders}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                />
            </div>
        </>
    );
}
