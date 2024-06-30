import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../Utils/alertUtils";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Users() {
    const { token } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch users. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [token]);

    const handleDelete = async (id) => {
        showWarningAlert(
            'Are you sure?',
            'Do you really want to delete this user?',
            'Yes, delete it!',
            async () => {
                try {
                    const res = await fetch(`/api/users/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to delete user');
                    }
                    setUsers(users.filter(user => user.id !== id));
                    showSuccessAlert('User Deleted', 'The user has been deleted successfully!');
                } catch (error) {
                    console.error(error);
                    showErrorAlert('Error', 'Failed to delete user. Please try again.');
                }
            }
        );
    };

    const columns = [
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Email', selector: row => row.email, sortable: true },
        { name: 'User Type', selector: row => row.user_type, sortable: true }, // Add this line
        { name: 'Created At', selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
        { name: 'Updated At', selector: row => new Date(row.updated_at).toLocaleString(), sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => navigate(`/users/${row.id}/edit`)} className="edit-btn">
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
            <div className="flex justify-between items-center mb-4">
                <h1 className="title">Users</h1>
                <div className="space-x-4">
                    <Link to="/users/new" className="primary-btn">Add New User</Link>
                </div>
            </div>
            <DataTable
                columns={columns.map(({ allowOverflow, button, ...rest }) => rest)}
                data={users}
                progressPending={loading}
                pagination
                highlightOnHover
            />
        </>
    );
}
