const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sql, poolPromise} = require('./db.js');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// const PORT = process.env.PORT || 5000;
const PORT = 5000; // Set the port to 5000 for local development

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Example
// website 1 api: procdedure
app.get("/api/procedure", async (req, res) => {
    try {
        const { classId, courseId, semester, year } = req.query; // Extract query parameters

        if (!classId || !courseId || !semester || !year) {
            return res.status(400).json({
                success: false,
                message: "Missing required query parameters",
            });
        }
        
        const pool = await poolPromise;
        const result = await pool.request()
            .input("classId", sql.Char(3), classId)
            .input("courseId", sql.Char(6), courseId)
            .input("semester", sql.Char(1), semester)
            .input("year", sql.Char(2), year)
            .query(`
                SELECT * FROM dbo.ClassList(@classId, @courseId, @semester, @year)
            `);

        console.log(result);
        if(result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No data found for the given parameters",
            });
        }

        res.status(200).json({
            success: true,
            empData: result.recordset,
        });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            success: false,
            message: "Error fetching data",
        });
    }
});