import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert, showLoadingAlert, hideLoadingAlert } from "../../Utils/alertUtils";

export default function EditServiceProvider() {
    const { token } = useContext(AppContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        provider_name: '',
        address: '',
        contact_number: '',
        email: '',
        website: '',
        customer_support_hours: '',
        installation_fee: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchServiceProvider() {
            showLoadingAlert();
            try {
                const res = await fetch(`/api/service_providers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch service provider');
                }
                const data = await res.json();
                setFormData({
                    provider_name: data.provider_name || '',
                    address: data.address || '',
                    contact_number: data.contact_number || '',
                    email: data.email || '',
                    website: data.website || '',
                    customer_support_hours: data.customer_support_hours || '',
                    installation_fee: data.installation_fee || ''
                });
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch service provider. Please try again.');
            } finally {
                hideLoadingAlert();
            }
        }

        fetchServiceProvider();
    }, [id, token]);

    async function handleEditServiceProvider(e) {
        e.preventDefault();
        const res = await fetch(`/api/service_providers/${id}`, {
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
            showSuccessAlert('Service Provider Updated', 'The service provider has been updated successfully!');
            navigate("/service_providers");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Edit Service Provider</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleEditServiceProvider}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Provider Name" 
                        value={formData.provider_name} 
                        onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.provider_name && <p className="text-red-500">{errors.provider_name[0]}</p>}
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Address" 
                        value={formData.address} 
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.address && <p className="text-red-500">{errors.address[0]}</p>}
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Contact Number" 
                        value={formData.contact_number} 
                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.contact_number && <p className="text-red-500">{errors.contact_number[0]}</p>}
                </div>
                <div>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Website" 
                        value={formData.website} 
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.website && <p className="text-red-500">{errors.website[0]}</p>}
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Customer Support Hours" 
                        value={formData.customer_support_hours} 
                        onChange={(e) => setFormData({ ...formData, customer_support_hours: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.customer_support_hours && <p className="text-red-500">{errors.customer_support_hours[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="Installation Fee" 
                        value={formData.installation_fee} 
                        onChange={(e) => setFormData({ ...formData, installation_fee: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.installation_fee && <p className="text-red-500">{errors.installation_fee[0]}</p>}
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
                    Update Service Provider
                </button>
            </form>
        </>
    );
}
