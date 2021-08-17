import { useReducer, createContext, useEffect } from "react";
import axios from 'axios';
import {useRouter} from 'next/router';

// intialiser la data de l'utilisateur pour qu'elle soit toujours null au départ 
const initialState = { user: null,};

// Etape 2 : créer un context  
const Context = createContext()


// Etape 3 : créer la racine du reducer qui va regrouper toutes les actions 

const rootReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": 
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        default:
            return state;
    }
};

// Etape 4 : créer le provider 

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState)

    // Etape 4.1 créer le  router 
    const router = useRouter()
    // Etape 4.2 executer se connecter à la session de l'utilisateur & enregistrer ses informations dans le local Storage 
    useEffect(() => {dispatch({type: "LOGIN",payload: JSON.parse(window.localStorage.getItem("user")),})}, []);

    axios.interceptors.response.use(
                function (response) {
                    // any status code that lie within the range of 2XX cause this function
                    // to trigger 
                    return response;
                 },
                function (error) {
                    // any status codes that falls outside the range of 2xx cause this function 
                    // to trigger 
                        let res = error.response;
                    if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                            return new Promise((resolve, reject) => {
                                axios
                                    .get('/api/logout')
                                    .then((data) => {
                                            console.log('/401 error > logout');
                                            dispatch({ type: 'LOGOUT' });
                                            window.localStorage.removeItem('user');
                                            router.push("/login");
                        // 
                                            })
                                            .catch(err => {
                                            console.log('AXIOS INTERCEPTORS ERR', err);
                                            reject(error);
                                        });
                                });
                            
                        }
                            return Promise.reject(error);
                 }
    );
// Etape :  
useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await axios.get("/api/csrf-token")
            console.log("CSRF", data);
            axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
        };
        getCsrfToken();
    }, []);

    return (
        <Context.Provider value={{ state, dispatch}}>{children}</Context.Provider>
    );
    
};

export { Context, Provider };
