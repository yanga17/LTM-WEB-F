'use client'

import axios from 'axios';
import { useState } from 'react';
import { useSession } from '@/context';
import { toast } from 'react-hot-toast';
import { useInputHandler } from '@/hooks';
import { Eye, EyeOff } from 'lucide-react';
import { apiEndPoint, colors } from '@/utils/colors';
import { useForm, Controller } from 'react-hook-form';
import { useAudit } from '@/shared/tools/auditMonit';

interface FormData {
    username: string;
    password: string;
}

export default function Page() {
    const { login } = useSession()
    const { addAuditLog } = useAudit()

    const [isVisisble, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const toggleVisibility = () => setIsVisible(!isVisisble)

    const { handleChange } = useInputHandler();
    const { control, handleSubmit, formState } = useForm<FormData>();

    const renderIcon = () => {
        if (isVisisble) {
            return (
                <span className='absolute right-3 md:cursor-pointer' onClick={toggleVisibility}>
                    <Eye size={25} strokeWidth={1.5} absoluteStrokeWidth color={colors?.purple} />
                </span>
            )
        }
        else {
            return (
                <span className='absolute right-3 md:cursor-pointer' onClick={toggleVisibility}>
                    <EyeOff size={25} strokeWidth={1.5} absoluteStrokeWidth color={colors?.purple} onClick={toggleVisibility} />
                </span>
            )
        }
    }

    const onSubmit = async (data: FormData, e: any) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payLoad = {
                username: data.username,
                password: data.password
            }

            addAuditLog({ action: `login attempt` })

            const url = `user/login`
            const response = await axios.post(`${apiEndPoint}/${url}`, payLoad)

            if (response.data.msg === "Success, Logged in!") {
                login(response?.data)
                setIsLoading(false);

                addAuditLog({ action: `login success` })
            }
            else {
                setIsLoading(false);

                addAuditLog({ action: `login attempt: Error -- ${response.data}` })

                toast('Login failed, please try again', {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    duration: 3000,
                });
            }

        }
        catch (error: any) {
            setIsLoading(false);

            addAuditLog({ action: `login attempt: Error -- ${error?.message}` })

            toast(`${error?.message}, please try again`, {
                icon: '❌',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 3000,
            });
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden bg-login bg-Boardroomm bg-no-repeat bg-center"> 
            <div className="w-11/12 md:w-5/12 lg:w-3/12 xl:w-4/12 shadow-lg p-2 md:p-4 flex flex-col justify-start items-center gap-5 rounded bg-white bg-opacity-50 backdrop-blur-md">
                <div className="flex flex-col items-center justify-center gap-0">
                    <h1 className="leading-none font-medium text-black">Welcome</h1>
                    <p className="text-sm text-black">Please enter your credentials to sign in</p>
                </div>
                <form className="flex flex-col justify-start gap-4 w-full">
                    <div className="relative flex flex-col justify-start items-start gap-1">
                        <label className="text-black">Username</label>
                        <Controller
                            control={control}
                            name="username"
                            rules={{ required: 'Your username is required' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border-grey p-3 w-full border rounded outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                    type="text"
                                    placeholder="LS232DEV"
                                    onChange={(e) => {
                                        handleChange('username', e.target.value);
                                        field.onChange(e);
                                    }}
                                />
                            )}
                        />
                        {formState.errors.username && <span className="text-red text-sm">{formState.errors.username.message}</span>}
                    </div>
                    <div className="relative flex flex-col justify-start items-start gap-1">
                        <label className="text-black">Password</label>
                        <div className='flex items-center justify-between w-full bg-'>
                            <Controller
                                control={control}
                                name="password"
                                rules={{ required: 'Your password is required' }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border-grey p-3 w-full border rounded outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                        type={isVisisble ? 'text' : 'password'}
                                        placeholder="***************"
                                        onChange={(e) => {
                                            handleChange('password', e.target.value);
                                            field.onChange(e);
                                        }}
                                    />
                                )}
                            />
                            {renderIcon()}
                        </div>
                        {formState.errors.password && <span className="text-red text-sm">{formState.errors.password.message}</span>}
                    </div>
                </form>
                <button className='w-full p-2 rounded bg-purple text-white uppercase' onClick={handleSubmit(onSubmit)} disabled={isLoading}>{isLoading ? 'Signin in...' : 'Sign in'}</button>
            </div>
        </div>
    );
}