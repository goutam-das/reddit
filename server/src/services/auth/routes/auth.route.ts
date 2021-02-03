import { validate } from "class-validator";
import { Request, Response, Router } from "express";

import User from '../entity/user.entity';

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body as IRegisterUserArgs;

    try {
        // TODO: Create the user
        const user = new User({ email, username, password });

        // TODO: Validate data
        const errors = await validate(user);
        if (errors.length > 0) return res.json(errors);

        await user.save();
        
        // TODO: Return the user
        return res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

const router = Router();
router.post('/register', register);

export default router;