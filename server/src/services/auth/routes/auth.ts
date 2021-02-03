import { validate } from "class-validator";
import { Request, Response, Router } from "express";

import User from '../entity/User';

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body as IRegisterUserArgs;

    try {
        // Create the user
        const user = new User({ email, username, password });

        // Validate data
        let errors: any = await validate(user);
        if (errors.length > 0) return res.status(400).json(errors);

        // Checks username and email
        errors = {};
        const emailUser = await User.findOne({ email });
        const usernameUser = await User.findOne({ username });
        if (emailUser) errors.email = "Email is already taken";
        if (usernameUser) errors.username = "Username is already taken";
        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        await user.save();

        // Return the user
        return res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

const router = Router();
router.post('/register', register);

export default router;