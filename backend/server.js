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


// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("email", sql.NVarChar(255), email)
            .input("password", sql.NVarChar(255), password)
            .query(`
                SELECT * FROM [User] WHERE Email = @email AND Password = @password;
            `);
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        return res.status(200).json({ token: "dummy-jwt-token" });
    } catch (err) {
        console.log("Error: ", err);
        res.status(400).json({ message: "Login failed" });
    }
});

app.get("/project/list", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT Id, Name, Leader, Status, Due FROM (
                SELECT p.Id, p.Name,
                    u.FirstName + ' ' + u.LastName AS Leader,
                    p.Status,
                    FORMAT(p.EndDate, 'yyyy-MM-dd') AS Due,
                    ROW_NUMBER() OVER (PARTITION BY p.Id ORDER BY u.ID) rn
                FROM Project p
                JOIN PROJECT_MEMBER pm ON p.Id = pm.PJ_ID
                JOIN [User] u ON u.ID = pm.UserID
                WHERE u.Role = 'PM'
            ) t
            WHERE rn = 1;`);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.log("Error: ", err);
        res.status(400).json({ message: "Failed to fetch projects" });
    }
});
app.post("/auth/logout", (req, res) => {
    // Here you would normally handle token invalidation or session destruction
    res.status(200).json({ message: "Logged out successfully" });
});