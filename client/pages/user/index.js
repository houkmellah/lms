import { useContext } from "react";
import { Context } from '../../context';
import UserRoute from "../../components/routes/UserRoute";




const UserIndex = () => {
    
    const {
        state: { user },
    } = useContext(Context);
     
    return (
        
        <UserRoute>    
            
                <h1 className="jumbotron text-center square">
                    User Dashboard
                </h1>
           
        </UserRoute>
        // <UserRoute data={JSON.stringify(user, null, 4)} />
        
        );
    
    };

export default UserIndex;