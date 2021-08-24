import { useEffect , useState  } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutilned } from "@ant-design/icons";
import InstructorNav from "../../components/nav/InstructorNav";


//Etape 1: Definir un route avec des children comme props 
const InstructorRoute = ({children}) => {

    //Etape 2: Hook pour set le propriété "ok" dans l'état 
    const [ok, setOk] = useState(false);

    //Etape 3: redefinition du Router 
    const router = useRouter();

    // Pourquoi nous avons pas mis const 
    useEffect(() => {fetchInstructor();}, []);

    const fetchInstructor = async () => {
        try {
            const { data } = await axios.get("/api/current-instructor");
            console.log('INSTRUCTOR ROUTE =>',data);
            if (data.ok) setOk(true);
            }
        catch (err) {
            console.log(err);
            setOk(false);
            router.push('/')
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
                                <InstructorNav/>
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

export default InstructorRoute;