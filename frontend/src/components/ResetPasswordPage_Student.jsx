import React, {useState} from 'react'
import { useParams } from 'react-router-dom';

export default function ResetPasswordPage_Student() {
    const { token } = useParams();
    // debugging: log the token to the console
    console.log("Token from URL:", token);
    const [newPassword, setNewPassword] = useState('');
    
    
    return (
    <>
    
    
    </>
  )
}
