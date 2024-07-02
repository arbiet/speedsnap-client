import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert } from "../../Utils/alertUtils";

export default function AddCoverageArea() {
    const { token } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        city: '',
        state: '',
        service_provider_id: ''
    });
    const [serviceProviders, setServiceProviders] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
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

        fetchServiceProviders();
    }, [token]);

    async function handleAddCoverageArea(e) {
        e.preventDefault();
        const res = await fetch('/api/coverage_areas', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        
        if (data.errors) {
            setErrors(data.errors);
            showErrorAlert('Failed to Add Coverage Area', 'Please correct the errors and try again.');
        } else {
            showSuccessAlert('Coverage Area Added', 'The coverage area has been added successfully!');
            navigate("/coverage_areas");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Add New Coverage Area</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleAddCoverageArea}>
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
                    Add Coverage Area
                </button>
            </form>
        </>
    );
}
