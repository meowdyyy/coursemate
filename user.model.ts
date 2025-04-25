require('dotenv').config();
import mongoose, { Document, Model, Schema } from "mongoose" ;
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string; 
    email: string;
    password: string;
    avatar: {
       public_id: string; 
       url: string;
    }；
    role: string; 
    isVerified: boolean;
    courses: Array<{ courseld: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAceessToken: () => string;
    SignRefreshToken: () => string;

//rest of the code
.
.
.


//sign access token 
userSchema.methods.SignaAccessToken = function () {
    return jwt.sign({id: this_.id}, process.env.ACCESS_TOKEN || '');
}

//sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({id: this_.id}, process.env.REFRESH_TOKEN || '');
}