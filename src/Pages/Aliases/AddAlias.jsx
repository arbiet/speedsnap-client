import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert } from "../../Utils/alertUtils";

export default function AddAlias() {
    const { token } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        service_provider_id: '',
        alias_name: '',
        alias_org: ''
    });
    const [errors, setErrors] = useState({});
    const [serviceProviders, setServiceProviders] = useState([]);
    const [availableAliases, setAvailableAliases] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/available_providers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await res.json();
                setServiceProviders(data.service_providers);
                setAvailableAliases(data.available_aliases);
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch data. Please try again.');
            }
        }

        fetchData();
    }, [token]);

    const handleAliasChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newFormData = { ...prevData, [name]: value };

            if (name === 'alias_name') {
                const selectedAlias = availableAliases.find(alias => alias.name === value);
                if (selectedAlias) {
                    newFormData.alias_org = selectedAlias.org;
                }
            } else if (name === 'alias_org') {
                const selectedAlias = availableAliases.find(alias => alias.org === value);
                if (selectedAlias) {
                    newFormData.alias_name = selectedAlias.name;
                }
            }

            return newFormData;
        });
    };

    async function handleAddAlias(e) {
        e.preventDefault();
        const res = await fetch('/api/service_provider_aliases', {
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
            showErrorAlert('Failed to Add Alias', 'Please correct the errors and try again.');
        } else {
            showSuccessAlert('Alias Added', 'The alias has been added successfully!');
            navigate("/aliases");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Add New Alias</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleAddAlias}>
                <div>
                    <select 
                        name="service_provider_id" 
                        value={formData.service_provider_id} 
                        onChange={(e) => setFormData({ ...formData, service_provider_id: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    >
                        <option value="">Select Service Provider</option>
                        {serviceProviders.map(provider => (
                            <option key={provider.id} value={provider.id}>
                                {provider.provider_name}
                            </option>
                        ))}
                    </select>
                    {errors.service_provider_id && <p className="text-red-500">{errors.service_provider_id[0]}</p>}
                </div>
                <div>
                    <select 
                        name="alias_name" 
                        value={formData.alias_name} 
                        onChange={handleAliasChange} 
                        className="border rounded w-full py-2 px-3"
                    >
                        <option value="">Select Alias Name</option>
                        {availableAliases.map(alias => (
                            <option key={alias.name} value={alias.name}>
                                {alias.name}
                            </option>
                        ))}
                    </select>
                    {errors.alias_name && <p className="text-red-500">{errors.alias_name[0]}</p>}
                </div>
                <div>
                    <select 
                        name="alias_org" 
                        value={formData.alias_org} 
                        onChange={handleAliasChange} 
                        className="border rounded w-full py-2 px-3"
                    >
                        <option value="">Select Alias Org</option>
                        {availableAliases.map(alias => (
                            <option key={alias.org} value={alias.org}>
                                {alias.org}
                            </option>
                        ))}
                    </select>
                    {errors.alias_org && <p className="text-red-500">{errors.alias_org[0]}</p>}
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
                    Add Alias
                </button>
            </form>
        </>
    );
}
