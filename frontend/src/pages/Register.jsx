import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {registerUser, googleLogin} from "../api/auth";
import { FcGoogle } from 'react-icons/fc';
import '../App.css';

function Register(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        try{
            const data = await registerUser({username, email, password}); // data contains the JWT token and user info
            localStorage.setItem('token', data.token); 
            localStorage.setItem('username', data.user.username);
            navigate('/');
        } catch (err){
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };
    return(
        <div className="login-container" >
            <div className="login-card">
                <h2>Create Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="submit">Register</button>
                </form>
                <div className="divider">
                    <span>OR</span>
                </div>
                
                <button className="google-btn" onClick={googleLogin}>
                    <FcGoogle size={22} />
                    <span>Continue with Google</span>
                </button>
                {error && <p>{error}</p>}
                <p className="register-text">
                    Already Have An Account?{" "}
                    <span onClick={() => navigate('/login')}>Login</span>
                </p>
            </div>
        </div>
    );
}

export default Register;