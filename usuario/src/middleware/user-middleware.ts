import { Handler } from "express";
import { CustomError, UserFields } from "../interfaces/interfaces";

/**
* Ensure all required fields are present for adding/editing users
*/ 
export const requiresUserFields: Handler = (req, res, next) => {
   let data = req.body;
   if (!data) {
       let err = new CustomError('Data del usuario debe ir en el cuerpo del request');
       err.name = '400';
       return next(err);
   }
   for (let field of UserFields) {
       if (! (field in data)) {
           let err = new CustomError('Falta el campo ' + field);
           err.name = '400';
           return next(err);
       }
   }
   next();
};