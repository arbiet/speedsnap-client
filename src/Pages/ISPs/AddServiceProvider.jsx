import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert } from "../../Utils/alertUtils";

export default function AddServiceProvider() {
    const { token } = useContext(AppContext);
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

    async function handleAddServiceProvider(e) {
        e.preventDefault();
        const res = await fetch('/api/service_providers', {
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
            showErrorAlert('Failed to Add Service Provider', 'Please correct the errors and try again.');
        } else {
            showSuccessAlert('Service Provider Added', 'The service provider has been added successfully!');
            navigate("/service_providers");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Add New Service Provider</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleAddServiceProvider}>
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
                    Add Service Provider
                </button>
            </form>
        </>
    );
}
