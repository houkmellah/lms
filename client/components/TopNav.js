import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreAddOutlined,
    CoffeeOutlined,
    LoginOutlined,
    UserAddOutlined,
    CarryOutOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Context } from '../context';
import axios from 'axios';
import {useRouter} from "next/router"
import { toast } from "react-toastify";


// A controler 




const { Item, SubMenu , ItemGroup } = Menu; // le meme résultat que Menu.Item


// Variables du Nav Bar 

const TopNav = () => {
    const [current, setCurrent] = useState(""); // Hook pour marquer si l'utilsateur est présent 
    const { state, dispatch } = useContext(Context); 
    const { user } = state;  // passer l'état de l'utilisateur connecté 
    const router = useRouter(); // Pour indiquer la page à suivre 

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
        
    }, [process.browser && window.location.pathname])
    
    const logout = async () => {
        dispatch({ type: "LOGOUT" }); // Executer le reducer LOGOUT 
        window.localStorage.removeItem('user') //Suprimer les donnés du User 
        const { data } = await axios.get("/api/logout");
        toast(data.message);
        router.push('/login') // Quand l'utilisateur est suprimé du local storage à ce diriger l'utilsateur vers la page Login
        
        

    }

    return (
        
        <Menu mode="horizontal" selectedKeys={[current]}>
            <Item
                key="/"
                onClick={(e) => setCurrent(e.key)}
                icon={<AppstoreAddOutlined />}
            >
                <Link href="/">
                    <a>App</a>
                </Link>
            </Item>

            {user && user.role && user.role.includes("Instructor") ? (
                <Item
                    key="/instructor/course/create"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<CarryOutOutlined />}>
                    <Link href="/instructor/course/create">
                        <a>Create Course</a>
                    </Link>
                </Item>
            ): (
                <Item
                    key="/user/become-instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<TeamOutlined/>}>
                    <Link href="/user/become-instructor">
                        <a>Become Instructor</a>
                    </Link>
                </Item>    
            )}

            {user === null &&(  // Si l'utilisateur n'est pas disponnible 
                <>
                    <Item
                        key="/login"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<LoginOutlined />}>
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </Item>

                    <Item
                        key="/register"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<UserAddOutlined />}
                        >
                    <Link href="/register">
                        <a>Register</a>
                    </Link>
                </Item>
            
                </>
            )}
            {user !== null && ( //Si l'utilisateur est disponnible 
                <SubMenu
                    icon={<CoffeeOutlined />}
                    title={user && user.name}
                    className="float-right"
                    
                >
                    
                    <ItemGroup>
                            <Item key="/user">
                                <Link href="/user">
                                <a>Dashboard</a>
                                </Link>
                            </Item>
                        
                            <Item onClick={logout}>
                                Logout
                            </Item>
                    </ItemGroup>
                </SubMenu>
                
            )}
        </Menu>
    );
};

export default TopNav;