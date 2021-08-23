import { useEffect , useState  } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutilned } from "@ant-design/icons";
import UserNav from "../../components/nav/UserNav";


//Etape 1: Definir un route avec des children comme props 
const UserRoute = ({children}) => {

    //Etape 2: Hook pour set le propriété "ok" dans l'état 
    const [ok, setOk] = useState(false);

    //Etape 3: redefinition du Router 
    const router = useRouter();

    // Pourquoi nous avons pas mis const 
    useEffect(() => {fetchUser();}, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/current-user");
            console.log(data);
            if (data.ok) setOk(true);
            }
        catch (err) {
            console.log(err);
            setOk(false);
            router.push('/login')
            }   
    };
  
    return (
        
        <>    
            {!ok ?(
                // <SyncOutilned
                //     spin
                //     className="d-flex justify-content-center diplay-1 text-primary p-5"
                // />
                <h1>Hello</h1>
            ) : (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-2">
                                <UserNav />
                            </div>
                            <div className="col-md-10">
                                {children}
                            </div>
                        </div>
                     </div>
            )}
        </>
        
        );
    
    };

export default UserRoute;