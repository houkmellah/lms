import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from 'next/router';


const Login = () => {
    const [email, setEmail] = useState('houkmellah@gmail.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    
    // State 
    const { state : {user}, dispatch } = useContext(Context);
    // const { user } = state;



    // router
    const router = useRouter();
    // si l'utilsateur existe  alors rediriger vers l'acceuil
    useEffect(() => { if (user !== null) router.push("/") } , [user]);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            setLoading(true); // activer le loading 
            const { data } = await axios.post(`/api/login`, { //attendre la data 
            email,
            password,
            });
            console.log("LOGIN RESPONSE", data); // Pour verifier si nous avons bien recu la data 
            dispatch({type: "LOGIN", payload: data,})
            // save in local storage
            window.localStorage.setItem('user', JSON.stringify(data)) // Si le login s'est bien passé alors stocker la data dans le local storage
            // redirect 
            router.push("/");
            // setLoading(false);
        } catch(err) {
            toast.error(err);
            setLoading(false);
        }
    };
    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Login</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input type="email" className="form-control mb-4 p-4" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" required />
                    <input type="password" className="form-control mb-4 p-4" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
                    <button
                        type="submit" className="btn btn-block btn-primary"
                        disabled={ !email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>

                </form>

                <p className="text-center p-3">
                    Not yet registered? {" "}
                    <Link href="/register">
                        <a>Register</a>
                    </Link>
                </p>

            </div>
            
        </>
    ) 
}

export default Login;