import { pool } from "../db.js";

export const getRecords = async (req,res) => {    
    try {
        const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
       
        var result = [];
        console.log(userType);
        if(userType[0].userType == 1){
            result = await pool.query("SELECT * FROM records");
        }else{
            result = await pool.query("SELECT * FROM records WHERE userId = ?", [req.user.id]);
        }
        
        res.json(result[0]);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
};

export const createRecords = async (req,res) => {
    try {
        
        const {title, content, date } = req.body;
        const result = await pool.query(
          "INSERT INTO records(title, content, date, userId) VALUES (?, ?, ?, ?)",
          [title, content, date, req.user.id]
        );
        res.json({
          id: result.insertId,
          title,
          content,
          date
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
};

export const getRecord = async (req,res) => {
    try {
        const userType = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
        const record = await pool.query("SELECT * FROM records WHERE id = ?", [req.params.id]);
        
        if(!record){
            return res.status(404).json({message: 'Record not found'})
        }

        if(userType[0][0].userType == 1 || record[0][0].userId == req.user.id){            
            res.json(record[0][0]);
        }else{
            return res.status(401).json({message: "authorization denied"});
        }
        
      } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateRecords = async (req,res) => {    
  try {
    const [result] = await pool.query("UPDATE records SET ? WHERE id = ?", [
      req.body,
      req.params.id,
    ]);
    console.log(result.affectedRows);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRecords = async (req,res) => {    
  try {
    const [result] = await pool.query("DELETE FROM records WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRecordsDate = async (req,res) => {     
  try {
      const [userType] = await pool.query("SELECT userType FROM users WHERE id = ?", [req.user.id]);
     
      var result = [];
      console.log(userType);
      if(userType[0].userType == 1){
          result = await pool.query("SELECT * FROM records WHERE date >= ? and date <= ?",[req.params.from,req.params.to]);
      }else{
          result = await pool.query("SELECT * FROM records WHERE userId = ? and date >= ? and date <= ?", [req.user.id,req.params.from,req.params.to]);
      }
      
      res.json(result[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};