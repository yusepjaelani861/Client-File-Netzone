import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import { useState } from 'react';
import { notify } from 'assets/utils/helper';
import { removeCookie } from 'assets/utils/helper';
import { getCookie } from 'assets/utils/helper';

export default function PasswordForm() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        password: '',
        new_password: '',
        new_password_confirmation: '',
    })

    const handleChangePassword = () => {
        // const token = getCookie('token')
        // if (token === '' || token === undefined) {
        //     window.location.href = '/login'
        // }

        setLoading(true)
        setTimeout(() => {
            try {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('token')}`
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success === true) {
                        setLoading(false)
                        notify(data.message)
                        setTimeout(() => {
                            window.location.reload()
                        }, 200)
                    } else if (data.error.error_code === 0) {
                        removeCookie('token')
                        window.location.href = '/login'
                    } else {
                        setLoading(false)
                        notify(data.message)
                    }
                })
                .catch(err => {
                    throw new Error(err)
                })
            } catch (err) {
                throw new Error(err)
            }
        })
    }
    return (
        <Card>
            <CardHeader color="purple" contentPosition="none">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-white text-2xl">Change Password</h2>
                </div>
            </CardHeader>
            <CardBody>
                {/* <h6 className="text-purple-500 text-sm mt-3 mb-6 font-light uppercase">
                    User Information
                </h6> */}
                <div className="flex flex-wrap mt-10">
                    <div className="w-full lg:w-12/12 mb-10 font-light">
                        <Input
                            type="password"
                            color="purple"
                            placeholder="Password"
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>
                    <div className="w-full lg:w-12/12 mb-10 font-light">
                        <Input
                            type="password"
                            color="purple"
                            placeholder="New Password"
                            onChange={(e) => setData({ ...data, new_password: e.target.value })}
                        />
                    </div>
                    <div className="w-full lg:w-12/12 mb-10 font-light">
                        <Input
                            type="password"
                            color="purple"
                            placeholder="New Password Confirmation"
                            onChange={(e) => setData({ ...data, new_password_confirmation: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap justify-end items-center mt-5">
                    <Button color="purple" buttonType="filled" size="lg" ripple="light" onClick={() => {
                        if (data.password === '' || data.new_password === '' || data.new_password_confirmation === '') {
                            notify('Mohon isi seluruh form')
                        } else if (data.new_password !== data.new_password_confirmation) {
                            notify('Password baru tidak sama')
                        } else if (data.new_password.length < 6 || data.new_password_confirmation.length < 6) {
                            notify('Password baru minimal 6 karakter')
                        } else {
                            handleChangePassword()
                        }
                    }}>
                        {loading ? 'Loading...' : 'Save'}
                    </Button>
                </div>

            </CardBody>
        </Card>
    );
}
