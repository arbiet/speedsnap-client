import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../../Utils/alertUtils";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function CoverageAreas() {
    const { token } = useContext(AppContext);
    const [coverageAreas, setCoverageAreas] = useState([]);
    const [filteredCoverageAreas, setFilteredCoverageAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCoverageAreas() {
            try {
                const res = await fetch('/api/coverage_areas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch coverage areas');
                }
                const data = await res.json();
                setCoverageAreas(data);
                setFilteredCoverageAreas(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch coverage areas. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchCoverageAreas();
    }, [token]);

    const handleDelete = async (id) => {
        showWarningAlert(
            'Are you sure?',
            'Do you really want to delete this coverage area?',
            'Yes, delete it!',
            async () => {
                try {
                    const res = await fetch(`/api/coverage_areas/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to delete coverage area');
                    }
                    setCoverageAreas(coverageAreas.filter(area => area.id !== id));
                    setFilteredCoverageAreas(filteredCoverageAreas.filter(area => area.id !== id));
                    showSuccessAlert('Coverage Area Deleted', 'The coverage area has been deleted successfully!');
                } catch (error) {
                    console.error(error);
                    showErrorAlert('Error', 'Failed to delete coverage area. Please try again.');
                }
            }
        );
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        const filteredData = coverageAreas.filter(area =>
            area.city.toLowerCase().includes(event.target.value.toLowerCase()) ||
            area.state.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredCoverageAreas(filteredData);
    };

    const columns = [
        { name: 'City', selector: row => row.city, sortable: true },
        { name: 'State', selector: row => row.state, sortable: true },
        { name: 'Service Provider', selector: row => row.service_provider.provider_name, sortable: true },
        { name: 'Created At', selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
        { name: 'Updated At', selector: row => new Date(row.updated_at).toLocaleString(), sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => navigate(`/coverage_areas/${row.id}/edit`)} className="edit-btn">
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
                <h1 className="title">Coverage Areas</h1>
                <div className="space-x-4">
                    <Link to="/coverage_areas/new" className="primary-btn">Add New Coverage Area</Link>
                </div>
            </div>
            <div className="mb-4 container mx-auto">
                <input
                    type="text"
                    placeholder="Search coverage areas"
                    value={searchText}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <div className="mb-4 container mx-auto">
                <DataTable
                    columns={columns.map(({ allowOverflow, button, ...rest }) => rest)}
                    data={filteredCoverageAreas}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                />
            </div>
        </>
    );
}
