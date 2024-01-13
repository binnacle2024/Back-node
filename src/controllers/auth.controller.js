// import User from '../models/user.model.js';
import bycrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import  jwt  from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import { pool } from "../db.js";

export const register = async (req, res) => {
    const {user, psw, name, surname, userType, status} = req.body;
    try {        
        const userFound = await pool.query("SELECT * FROM users WHERE user = ?", [user]);
        
        if(userFound[0].length > 0){
            return res.status(400).json(["El usuario ya esta en uso"])
        }
        const pswHash = await bycrypt.hash(psw,10);
        
        const userSaved = await pool.query(
            "INSERT INTO users(user, psw, name, surname, userType, status) VALUES (?, ?, ?, ?, ?, ?)",
            [user, pswHash, name, surname, 2, 0]
          );

        res.json({
        id: userSaved[0].insertId,
        user: userSaved[0].user,
        });
        

    } catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
    const {user, psw} = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE user = ?", [user]);
        if(result[0].length == 0) return res.status(400).json(["Usuario no encontrado"]);
        const userFound = result[0][0];
        
        const isMatch = await bycrypt.compare(psw, userFound.psw);
        if(!isMatch) return res.status(400).json(["Contraseña incorrecta"]);

        if(userFound.status == 0){
            return res.status(400).json(["Usuario no aceptado por administrador"]);
        }
        const token = await createAccessToken({id:userFound.id});
        res.cookie("token_binnacle",token);
        res.json({
            id:userFound.id,
            user : userFound.user,
            userType : userFound.userType,
            status : userFound.status,
            token:token,
        });

    } catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

export const logout = (req, res) => {
    res.cookie('token_binnacle', "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
}

export const profile = async (req,res) => {
    const userFound = await User.findById(req.user.id);

    if(!userFound) return res.status(400).json({message: "User not found"});

    return res.json({
        id:userFound._id,
        username: userFound.username,
        email : userFound.email,
        createdAt : userFound.createdAt,
        updatedAt : userFound.updatedAt
    })
}

export const verifyToken = async (req,res) => {
    const token = req.cookies.token_binnacle;

    if(!token) return res.status(401).json(["No autorizado"]);

    // jwt.verify(token, TOKEN_SECRET, async (err,user) => {
    //     if(err) return res.status(401).json(["Unauthorized"]);

    //     const userFound = await User.findById(user.id);
    //     if(!userFound) return res.status(401).json(["Unauthorized"]);

    //     return res.json({
    //         id: userFound._id,
    //         username: userFound.username,
    //         email: userFound.email,
    //     });
    // });

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const result = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
        // if(result[0].length == 0) return res.status(400).json(["user not found"]);
        // const userFound = await User.findById(decoded.id);
    
        if (result[0].length == 0) {
          return res.status(401).json({ error: 'No autorizado - usuario no encontrado' });
        }
        
        const userFound = result[0][0];
    
        // Puedes omitir el paso de decodificación y usar directamente el objeto user del token
        // return res.json(decoded);
    
        return res.json({
        //   id: userFound._id,
        //   username: userFound.username,
          user: userFound.user,
          userType: userFound.userType,
        });
      } catch (error) {
        return res.status(401).json({ error: 'No autorizado - Token invalido' });
      }
};