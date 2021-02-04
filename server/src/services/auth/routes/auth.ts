import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import User from '../entity/User';
import auth from '../../../middlewares/auth';

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body as IRegisterArgs;

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

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body as ILoginArgs;
    try {
        // Validate Data
        let errors: any = {};

        if (isEmpty(username)) errors.username = 'Username must not be empty';
        if (isEmpty(password)) errors.password = 'Password must not be empty';
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({
            error: 'User not found'
        });

        // Password Match
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({
            error: "Password is incorrect"
        });

        // Generate Token
        const token = jwt.sign({ username }, process.env.JWT_SECRET!);

        // Set Cookie Header
        res.set('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60,
            path: '/'
        }));

        return res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

const me = async (_: Request, res: Response) => {
    return res.json(res.locals.user);
}

const logout = (_: Request, res: Response) => {
    res.set('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        expires: new Date(0),
        path: '/'
    }));
    return res.json({ success: true });
}

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.post('/logout', auth, logout);

export default router;