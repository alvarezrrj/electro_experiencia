import { Handler } from "express";

export const requiresAuth: Handler = (req, res, next) => {
    if (! req.session.user) {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
}