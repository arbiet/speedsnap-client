import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert, showLoadingAlert, hideLoadingAlert } from "../../Utils/alertUtils";

export default function EditAlias() {
    const { token } = useContext(AppContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        service_provider_id: '',
        alias_name: '',
        alias_org: ''
    });
    const [errors, setErrors] = useState({});
    const [availableProviders, setAvailableProviders] = useState([]);

    useEffect(() => {
        async function fetchAvailableProviders() {
            try {
                const res = await fetch('/api/available_providers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch available providers');
                }
                const data = await res.json();
                setAvailableProviders(data);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch available providers. Please try again.');
            }
        }

        fetchAvailableProviders();
    }, [token]);

    useEffect(() => {
        async function fetchAlias() {
            showLoadingAlert();
            try {
                const res = await fetch(`/api/service_provider_aliases/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch alias');
                }
                const data = await res.json();
                setFormData({
                    service_provider_id: data.service_provider_id,
                    alias_name: data.alias_name,
                    alias_org: data.alias_org
                });
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch alias. Please try again.');
            } finally {
                hideLoadingAlert();
            }
        }

        fetchAlias();
    }, [id, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    async function handleEditAlias(e) {
        e.preventDefault();
        const res = await fetch(`/api/service_provider_aliases/${id}`, {
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
            showSuccessAlert('Alias Updated', 'The alias has been updated successfully!');
            navigate("/aliases");
        }
    }

    return (
        <>
            <h1 className="title">Edit Alias</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleEditAlias}>
                <div>
                    <select 
                        name="service_provider_id" 
                        value={formData.service_provider_id} 
                        onChange={handleChange} 
                        className="border rounded w-full py-2 px-3"
                    >
                        <option value="">Select Service Provider</option>
                        {availableProviders.map(provider => (
                            <option key={provider.id} value={provider.id}>
                                {provider.name} ({provider.org})
                            </option>
                        ))}
                    </select>
                    {errors.service_provider_id && <p className="text-red-500">{errors.service_provider_id[0]}</p>}
                </div>
                <div>
                    <input 
                        type="text" 
                        name="alias_name" 
                        placeholder="Alias Name" 
                        value={formData.alias_name} 
                        onChange={handleChange} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.alias_name && <p className="text-red-500">{errors.alias_name[0]}</p>}
                </div>
                <div>
                    <input 
                        type="text" 
                        name="alias_org" 
                        placeholder="Alias Org" 
                        value={formData.alias_org} 
                        onChange={handleChange} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.alias_org && <p className="text-red-500">{errors.alias_org[0]}</p>}
                </div>
                <button className="primary-btn" type="submit">
                    Update Alias
                </button>
            </form>
        </>
    );
}
