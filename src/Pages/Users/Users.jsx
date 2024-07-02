import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../Utils/alertUtils";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Users() {
    const { token } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
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
                setFilteredUsers(data);
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
                    setFilteredUsers(filteredUsers.filter(user => user.id !== id));
                    showSuccessAlert('User Deleted', 'The user has been deleted successfully!');
                } catch (error) {
                    console.error(error);
                    showErrorAlert('Error', 'Failed to delete user. Please try again.');
                }
            }
        );
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        const filteredData = users.filter(user =>
            user.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            user.email.toLowerCase().includes(event.target.value.toLowerCase()) ||
            user.user_type.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredUsers(filteredData);
    };

    const columns = [
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Email', selector: row => row.email, sortable: true },
        { name: 'User Type', selector: row => row.user_type, sortable: true },
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
            <div className="flex justify-between items-center mb-4 container mx-auto">
                <h1 className="title">Users</h1>
                <div className="space-x-4">
                    <Link to="/users/new" className="primary-btn">Add New User</Link>
                </div>
            </div>
            <div className="mb-4 container mx-auto">
                <input
                    type="text"
                    placeholder="Search users"
                    value={searchText}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <div className="mb-4 container mx-auto">
                <DataTable
                    columns={columns.map(({ allowOverflow, button, ...rest }) => rest)}
                    data={filteredUsers}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                />
            </div>
        </>
    );
}
