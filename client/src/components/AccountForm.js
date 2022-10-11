import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import { useEffect, useState } from 'react';
import { getCookie } from 'assets/utils/helper';
import LoadingScreen from './LoadingScreen';
import { removeCookie } from 'assets/utils/helper';
import { notify } from 'assets/utils/helper';

export default function AccountForm() {
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [data, setData] = useState({
        username: '',
        email: '',
        role: {
            name: '',
        },
        information: {
            first_name: '',
            last_name: '',
            phone_number: '',
            address: '',
            city: '',
            country: '',
            postal_code: '',
            additional_information: '',
        }
    });

    const handleSaveData = () => {
        setLoadingSave(true);
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user/edit`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    },
                    body: JSON.stringify(data.information)
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        setLoadingSave(false);
                        notify(data.message);
                    } else if (data.error.error_code === 0) {
                        removeCookie("token");
                        window.location.href = "/login";
                    } else {
                        throw new Error(data.message);
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                })
            } catch (err) {
                throw new Error(err);
            }
        }, 200);
    }

    useEffect(() => {
        let token = getCookie('token');
        if (token === "''" || token === undefined) {
            window.location.href = '/login';
        }
        setLoading(true);
        loadData();
    }, []);

    const loadData = () => {
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getCookie("token")}`,
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        setData(data.data);
                        setLoading(false);
                    } else if (data.error.error_code === 0) {
                        removeCookie("token");
                        window.location.href = "/login";
                    } else {
                        throw new Error(data.message);
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                })
            } catch (err) {
                throw new Error(err);
            }
        }, 200);
    }

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                </>
            )}
            <Card>
                <CardHeader color="purple" contentPosition="none">
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-white text-2xl">My Account</h2>
                        {/* Role */}
                        <div className="flex items-center bg-green-600 rounded-lg px-3 py-3">
                            <span className="text-white text-xl">{data.role.name}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                        <h6 className="text-purple-500 text-sm mt-3 mb-6 font-light uppercase">
                            User Information
                        </h6>
                        <div className="flex flex-wrap mt-10">
                            <div className="w-full lg:w-6/12 pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="Username"
                                    value={data.username}
                                    onChange={(e) => setData({ ...data, username: e.target.value })}
                                    disabled
                                />
                            </div>
                            <div className="w-full lg:w-6/12 pl-4 mb-10 font-light">
                                <Input
                                    type="email"
                                    color="purple"
                                    placeholder="Email Address"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    disabled
                                />
                            </div>
                        </div>

                        <h6 className="text-purple-500 text-sm my-6 font-light uppercase">
                            Contact Information
                        </h6>
                        <div className="flex flex-wrap mt-10">
                            <div className="w-full lg:w-6/12 pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="First Name"
                                    value={data.information.first_name}
                                    onChange={(e) => setData({ ...data, information: { ...data.information, first_name: e.target.value } })}
                                />
                            </div>
                            <div className="w-full lg:w-6/12 pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="Last Name"
                                    value={data.information.last_name}
                                    onChange={(e) => setData({ ...data, information: { ...data.information, last_name: e.target.value } })}
                                />
                            </div>
                            <div className="w-full lg:w-12/12 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="Phone Number"
                                    value={data.information.phone_number}
                                    onChange={(e) => setData({ ...data, information: { ...data.information, phone_number: e.target.value } })}
                                />
                            </div>
                            <div className="w-full lg:w-12/12 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="Address"
                                    value={data.information.address}
                                    onChange={(e) => setData({ ...data, information: { ...data.information, address: e.target.value } })}
                                />
                            </div>
                            <div className="w-full lg:w-4/12 pr-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="City"
                                    value={data.information.city}
                                    onChange={(e) => setData({ ...data, information: { ...data.information, city: e.target.value } })}
                                />
                            </div>
                            <div className="w-full lg:w-4/12 px-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="Country"
                                    value={data.information.country}
                                    onChange={(e) => setData({ ...data, information: { ...data.information, country: e.target.value } })}
                                />
                            </div>
                            <div className="w-full lg:w-4/12 pl-4 mb-10 font-light">
                                <Input
                                    type="text"
                                    color="purple"
                                    placeholder="Postal Code"
                                    value={data.information.postal_code}
                                    onChange={(e) => setData({ ...data, information: { ...data.information, postal_code: e.target.value } })}
                                />
                            </div>
                        </div>

                        <h6 className="text-purple-500 text-sm my-6 font-light uppercase">
                            Additional Information
                        </h6>
                        <div className="flex flex-wrap mt-10 font-light">
                            <Textarea color="purple" placeholder="" value={data.information.additional_information} onChange={(e) => setData({ ...data, information: { ...data.information, additional_information: e.target.value } })} />
                        </div>

                        <div className="mt-10 flex justify-end items-center">
                            <Button 
                                color="purple" 
                                buttonType="filled" 
                                size="lg" 
                                onClick={() => {
                                    handleSaveData();
                                }}>
                                {loadingSave ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                </CardBody>
            </Card>
        </>
    );
}
