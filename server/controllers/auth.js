import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name) return res.status(400).send("Name is required")
        if (!password || password.length < 6) {
            return res.status(400).send("Password is requierd and should be min 6 character long")
        }
        let userExist = await User.findOne({ email }).exec();
        if (userExist) return res.status(400).send("Email is taken");
        const hashedPassword = await hashPassword(password)
        const user = new User({
            name, email, password: hashedPassword,
        }).save();
        // console.log("saved user", user);
        return res.json({ ok: true });
    } catch (err) {
        console.log(err)
        return res.status(400).send('Error. Try Again.')
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        //Controler si l'émail de l'utilisateur existe dans notre DB 
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(400).send("No user found");
        //Controller le mot de passe 
        const match = await comparePassword(password, user.password);
        // Create signed jwt
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        // Retourner le User & le Token au client, à l'excepetion du mot de passe hashé 
        user.password = undefined;
        // Send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true, // only works on https 
        });
        // Send user as json response 
        res.json(user);

      
    } catch(err){
        console.log(err)
        return res.status(400).send("Error. Try Again.")   
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: "Signout success" });
    } catch(err) {
        console.log(err);
    }
    
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').exec();
        console.log('CURRENT_USER', user);
        return res.json({ user }); 

    } catch (err) {
        console.log(err)
    }

}