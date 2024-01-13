import { pool } from "../db.js";
import bycrypt from 'bcryptjs';

export const getUsers = async (req,res) => {    
    try {
        const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
       
        var result = [];
        // console.log(userType+' 1');
        if(userType[0].userType == 1){            
            result = await pool.query("SELECT * FROM users WHERE status >= 1");
            
            return res.json(result[0]);
        }else{
            return res.status(401).json({message: "authorization denied"});
        }
        
      } catch (error) {

      }
    }

    
export const getUser = async (req,res) => {    
    try {
        const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
       
        var result = [];
        console.log(userType+'ssssssssssssssssssssssssss');
        if(userType[0].userType == 1){            
            result = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
            
            return res.json(result[0]);
        }else{
            return res.status(401).json({message: "authorization denied"});
        }
        
      } catch (error) {

      }
    }

export const getUsersPending = async (req,res) => {    
    try {
        const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
       
        var result = [];
        console.log('entro a obetner usuarios');   
        if(userType[0].userType == 1){   
            console.log('entro a obetner usuarios');         
            result = await pool.query("SELECT * FROM users WHERE status = 0");
            
            return res.json(result[0]);
        }else{
            console.log('error entro a obetner usuarios',message);  
            return res.status(401).json({message: "authorization denied"});
        }
        
      } catch (error) {
        console.log('error mayor entro a obetner usuarios',error);

      }
    }

export const updateAcceptedUser = async (req,res) => {    
    try {
        const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
       
        var result = [];
        console.log(userType+' 2');
        if(userType[0].userType == 1){            
            result = await pool.query("UPDATE users set status = 1 where id = ?",[req.body.id]);
            
            return res.json(result[0]);
        }else{
            return res.status(401).json({message: "authorization denied"});
        }
        
      } catch (error) {

      }
    }

export const updateRejectedUser = async (req,res) => {    
    try {
        const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
        
        var result = [];
        console.log(userType);
        if(userType[0].userType == 1){            
            result = await pool.query("UPDATE users set status = 2 where id = ?",[req.body.id]);
            
            return res.json(result[0]);
        }else{
            return res.status(401).json({message: "authorization denied"});
        }
        
        } catch (error) {

        }
    }

    
export const updateUser = async (req,res) => {    
    try {
        const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
        
        var result = [];
        if(userType[0].userType == 1){        
            const userFound = await pool.query("SELECT * FROM users WHERE user = ?", [req.params.id]);
        
            if(userFound[0].length > 0){
                return res.status(400).json(["El usuario ya esta en uso"])
            }

            var pswHash = '';
            if(req.body.psw != ''){
                try{
                pswHash = await bycrypt.hash(req.body.psw,10);
                }catch(error){
                    console.log(error);
                }
            }

            try{
                if(pswHash == ''){
                    
                    const userSaved = await pool.query(
                    "UPDATE users SET user = ?, name = ?, surname = ?, userType = ?, status = ? where id = ?",
                    [req.body.user, req.body.name, req.body.surname, req.body.userType, req.body.status, req.params.id]
                );    
                }else{
                    
                    const userSaved = await pool.query(
                    "UPDATE users SET user = ?, psw = ?, name = ?, surname = ?, userType = ?, status = ? where id = ?",
                    [req.body.user, pswHash, req.body.name, req.body.surname, req.body.userType, req.body.status, req.params.id]
                );    
                }
                return res.status(200).json(["Se actualizo con éxito"])
            }catch(error){
                console.log(error);
                return res.status(400).json(["Erros desconocido"],error)
            }
            // result = await pool.query("UPDATE users set status = 2 where id = ?",[req.body.id]);
            
            return res.json(result[0]);
        }else{
            return res.status(401).json({message: "authorization denied"});
        }
        
        } catch (error) {
            return res.status(400).json(["Erros desconocido"],error)

        }
    }

    
export const getUserExist = async (req,res) => { 
    
    var exist = [];
    var existCount;
        try {       
            try { 
                exist = await pool.query("SELECT COUNT(*) FROM users WHERE user = ?",[req.params.user]);
                existCount = exist[0][0]['COUNT(*)'];
                var result = '';
                if(existCount > 0){
                    const userSplit = req.params.user.split('-');
                    if(userSplit.length == 3){
                        var count = parseInt(userSplit[3], 10) + 1;
                        result = userSplit[0]+'-'+userSplit[1]+'-'+count;
                    }
                    if(userSplit.length == 2){
                        result = userSplit[0]+'-'+userSplit[1]+'-1';
                    }
                    console.log(userSplit);
                }else{
                    result = req.params.user;
                }
                console.log(result);
            }catch(error){

            }
            return res.json(result);
         
        
        }catch(error){

        }
    }
