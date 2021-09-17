import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import {nanoid} from 'nanoid'

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
}  

const SES = new AWS.SES(awsConfig)


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
        if (!match) return res.status(400).send("Wrong password")
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
    } catch (err) {
        console.log(err);
    }
    
};

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').exec();
        // console.log('CURRENT_USER', user);
        return res.json({ ok: true });

    } catch (err) {
        console.log(err)
    }

};
export const forgotPassword = async (req, res) => {             
    try {
        const { email } = req.body
        const shortCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate(
            { email },
            { passwordResetCode: shortCode }
        )
        if (!user) return res.status(400).send('User not found')

        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data:
                            `
                            <html>
                                <h1>Reset Password</h1>
                                <p>Use this code to reset your password</p>
                                <h2 style="color:red">${shortCode}</h2>
                                <i>www.udemy.com</i>
                            </html>
                            `,
                        },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password",
            },
            
            },
        };
        const emailSent = SES.sendEmail(params).promise()
        emailSent
            .then((data) => {
            console.log(data)
            res.json({ ok: true })
        })
            .catch(err => {
                console.log(err);
        });
        
        
    } catch (err) { 
        console.log(err)
    }
};

export const sendTestEmail = async (req, res) => {
    // console.log('send email using SES')
    // res.json({ ok : true })
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
        ToAddresses:    ["taha.lms.project@gmail.com"],
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <html>
                        <h1>Reset password link</h1>
                        <p>Please use the following link to reset your password</p>
                    
                    </html>,
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Password reset link",
        }
        
        }
    }
    const emailSent = SES.sendEmail(params).promise()
    emailSent
        .then((data) => {
            console.log(data);
            res.json({ ok: true });
        })
        .catch((err) => {
            console.log(err)
        })
    
};
 
export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body
        // console.table({ email, code, newPassword });
        const hashedPassword = await hashPassword(newPassword);
        
        const user = User.findOneAndUpdate(
            {
                email,
                passwordResetCode: code,
            }, {
                password: hashedPassword,
                passwordResetCode: "",}

        ).exec();
        res.json({ ok: true });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error! Try again.");
    }
}