const fs = require('fs')



const userFilePath = `${__dirname}/../dev-data/data/users.json`;
const users = JSON.parse(fs.readFileSync(userFilePath));



// USER FUNCTIONS
const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'SUCCESS',
        result: users.length,
        data: {
            users: users
        }
    })
}
// USER FUNCTIONS END

module.exports = {
    getAllUsers
}