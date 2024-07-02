import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert, showLoadingAlert, hideLoadingAlert } from "../../Utils/alertUtils";

export default function EditCoverageArea() {
    const { token } = useContext(AppContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        city: '',
        state: '',
        service_provider_id: ''
    });
    const [serviceProviders, setServiceProviders] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchCoverageArea() {
            showLoadingAlert();
            try {
                const res = await fetch(`/api/coverage_areas/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch coverage area');
                }
                const data = await res.json();
                setFormData({
                    city: data.city || '',
                    state: data.state || '',
                    service_provider_id: data.service_provider_id || ''
                });
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch coverage area. Please try again.');
            } finally {
                hideLoadingAlert();
            }
        }

        async function fetchServiceProviders() {
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
                setServiceProviders(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch service providers. Please try again.');
            }
        }

        fetchCoverageArea();
        fetchServiceProviders();
    }, [id, token]);

    async function handleEditCoverageArea(e) {
        e.preventDefault();
        const res = await fetch(`/api/coverage_areas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        
        if (data.errors) {
            setErrors(data.errors);
            showErrorAlert('Update Failed', 'Please correct the errors and try again.');
        } else {
            showSuccessAlert('Coverage Area Updated', 'The coverage area has been updated successfully!');
            navigate("/coverage_areas");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Edit Coverage Area</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleEditCoverageArea}>
                <div>
                    <input 
                        type="text" 
                        placeholder="City" 
                        value={formData.city} 
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.city && <p className="text-red-500">{errors.city[0]}</p>}
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="State" 
                        value={formData.state} 
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.state && <p className="text-red-500">{errors.state[0]}</p>}
                </div>
                <div>
                    <select
                        value={formData.service_provider_id}
                        onChange={(e) => setFormData({ ...formData, service_provider_id: e.target.value })}
                        className="border rounded w-full py-2 px-3"
                    >
                        <option value="">Select Service Provider</option>
                        {serviceProviders.map(provider => (
                            <option key={provider.id} value={provider.id}>{provider.provider_name}</option>
                        ))}
                    </select>
                    {errors.service_provider_id && <p className="text-red-500">{errors.service_provider_id[0]}</p>}
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
                    Update Coverage Area
                </button>
            </form>
        </>
    );
}
