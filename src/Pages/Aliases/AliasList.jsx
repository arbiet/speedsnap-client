import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../Utils/alertUtils";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function AliasList() {
    const { token } = useContext(AppContext);
    const [aliases, setAliases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAliases() {
            try {
                const res = await fetch('/api/service_provider_aliases', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch aliases');
                }
                const data = await res.json();
                setAliases(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch aliases. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchAliases();
    }, [token]);

    const handleDelete = async (id) => {
        showWarningAlert(
            'Are you sure?',
            'Do you really want to delete this alias?',
            'Yes, delete it!',
            async () => {
                try {
                    const res = await fetch(`/api/service_provider_aliases/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to delete alias');
                    }
                    setAliases(aliases.filter(alias => alias.id !== id));
                    showSuccessAlert('Alias Deleted', 'The alias has been deleted successfully!');
                } catch (error) {
                    console.error(error);
                    showErrorAlert('Error', 'Failed to delete alias. Please try again.');
                }
            }
        );
    };

    const columns = [
        { name: 'Alias Name', selector: row => row.alias_name, sortable: true },
        { name: 'Alias Org', selector: row => row.alias_org, sortable: true },
        { name: 'Service Provider', selector: row => row.service_provider.provider_name, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => navigate(`/aliases/${row.id}/edit`)} className="edit-btn">
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
                <h1 className="title">Aliases</h1>
                <div className="space-x-4">
                    <Link to="/aliases/new" className="primary-btn">Add New Alias</Link>
                </div>
            </div>
            <div className="mb-4 container mx-auto">
                <DataTable
                    columns={columns.map(({ allowOverflow, button, ...rest }) => rest)}
                    data={aliases}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                />
            </div>
        </>
    );
}
