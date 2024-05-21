import express, { Request, Response } from "express";
import User from "../models/user";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async(req:Request,res:Response)=>{
    const userId=req.userId;
    try{
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        res.json(user);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
});
// /api/users/register
router.post(
    "/register",
    [
        check("firstName", "First Name is required").isString(),
        check("lastName", "Last Name is required").isString(),
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({
            min: 6
        }),
        check("phone", "Phone number is required").isLength({ min: 10 }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        try {
            let { firstName, lastName, email, phone, password, role } = req.body;

            if (!role) {
                role = 'user';
            }

            const newUser = new User({
                email,
                password,
                firstName,
                lastName,
                phone,
                role,
            });

            await newUser.save();
        

            return res.status(200).send({ message: "User registered OK" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Something went wrong" });
        }
    });
export default router;
