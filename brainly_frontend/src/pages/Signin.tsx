import React from 'react'
import { InputProps,Input } from '../components/Input'
import { Button } from '../components/Button';
import { useRef } from 'react';
import axios from 'axios';
import { backendURL } from '../config';
import { useNavigate } from 'react-router-dom';
const Signin = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function submit(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if(!username || !password){
            alert("Please enter correct username or password");
            return;
        }
        
        try {
            const res = await axios.post(backendURL+"/api/v1/signin",{
                username,
                password
            });
            const token = res.data.token;
            localStorage.setItem("token",token);
            navigate("/dashboard");
        } catch (error: any) {
            alert(error);
        }

    }

  return (
    <div className='h-screen w-screen bg-gray-200 flex flex-col justify-center items-center'>
        <div className='bg-white rounded border min-w-48'>
        <Input ref={usernameRef} placeholder='username' />
        <Input ref={passwordRef} placeholder='password' />
        <div className=''>
        <Button loading={true} text={"signin"} fullWidth={true} variant='primary' size='md' onClick={submit} /></div>
        </div>
    </div>
  )
}

export default Signin