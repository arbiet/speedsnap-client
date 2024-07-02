import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert } from "../../Utils/alertUtils";

export default function AddPlanDetail() {
    const { token } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        plan_name: '',
        price: '',
        download_speed: '',
        upload_speed: '',
        FUP: '',
        free_extra_quota: '',
        downgrade_speed: '',
        devices: '',
        IP_dynamic: '',
        IP_public: '',
        modem: '',
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

    async function handleAddPlanDetail(e) {
        e.preventDefault();
        const res = await fetch('/api/plan_details', {
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
            showErrorAlert('Failed to Add Plan Detail', 'Please correct the errors and try again.');
        } else {
            showSuccessAlert('Plan Detail Added', 'The plan detail has been added successfully!');
            // navigate("/plan_details");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Add New Plan Detail</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleAddPlanDetail}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Plan Name" 
                        value={formData.plan_name} 
                        onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.plan_name && <p className="text-red-500">{errors.plan_name[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="Price" 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.price && <p className="text-red-500">{errors.price[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="Download Speed" 
                        value={formData.download_speed} 
                        onChange={(e) => setFormData({ ...formData, download_speed: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.download_speed && <p className="text-red-500">{errors.download_speed[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="Upload Speed" 
                        value={formData.upload_speed} 
                        onChange={(e) => setFormData({ ...formData, upload_speed: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.upload_speed && <p className="text-red-500">{errors.upload_speed[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="FUP" 
                        value={formData.FUP} 
                        onChange={(e) => setFormData({ ...formData, FUP: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.FUP && <p className="text-red-500">{errors.FUP[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="Free Extra Quota" 
                        value={formData.free_extra_quota} 
                        onChange={(e) => setFormData({ ...formData, free_extra_quota: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.free_extra_quota && <p className="text-red-500">{errors.free_extra_quota[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="Downgrade Speed" 
                        value={formData.downgrade_speed} 
                        onChange={(e) => setFormData({ ...formData, downgrade_speed: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.downgrade_speed && <p className="text-red-500">{errors.downgrade_speed[0]}</p>}
                </div>
                <div>
                    <input 
                        type="number" 
                        placeholder="Devices" 
                        value={formData.devices} 
                        onChange={(e) => setFormData({ ...formData, devices: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.devices && <p className="text-red-500">{errors.devices[0]}</p>}
                </div>
                <div>
                    <label className="block mb-2">
                        <input 
                            type="checkbox" 
                            checked={formData.IP_dynamic} 
                            onChange={(e) => setFormData({ ...formData, IP_dynamic: e.target.checked })} 
                            className="mr-2 leading-tight"
                        />
                        IP Dynamic
                    </label>
                </div>
                <div>
                    <label className="block mb-2">
                        <input 
                            type="checkbox" 
                            checked={formData.IP_public} 
                            onChange={(e) => setFormData({ ...formData, IP_public: e.target.checked })} 
                            className="mr-2 leading-tight"
                        />
                        IP Public
                    </label>
                </div>
                <div>
                    <label className="block mb-2">
                        <input 
                            type="checkbox" 
                            checked={formData.modem} 
                            onChange={(e) => setFormData({ ...formData, modem: e.target.checked })} 
                            className="mr-2 leading-tight"
                        />
                        Modem Provided
                    </label>
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
                    Add Plan Detail
                </button>
            </form>
        </>
    );
}
