const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Use absolute path to ensure consistent file location
const dbFilePath = path.join(__dirname, 'db.json')

const readDb = () => {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8')
        return JSON.parse(data)
    } catch (err) {
        console.error('Error reading database:', err)
        return []
    }
}

const writeFile = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    
    try {
        // Use synchronous write to ensure data consistency
        fs.writeFileSync(dbFilePath, jsonData, 'utf8')
        console.log('Data written to file successfully');
    } catch (err) {
        console.error('Error writing to file', err);
        throw err;
    }
}

const UserModel = {
    // SELECT * FROM users;
    getAllUsers() {
        return readDb();
    },
    // SELECT * FROM users WHERE username = $username;
    findUserByUsername(username) {
        const db = readDb()
        let users = db.filter(user => user.username === username)
        return users && users.length > 0 ? users[0] : null
    },
    getUserById(id) {
        const db = readDb()
        return db.filter(user => user.id === id)
    },
    insertUser(inputData) {
        const db = readDb()
        if(inputData) {
            inputData.id = uuidv4()
        }
        writeFile([...db, inputData])
    },
    updateUser(data, userId) {
        const db = readDb()
        const updated = db.map(user => {
            if (user.id === userId) {
                return { ...user, ...data }
            }
            return user
        })
        writeFile(updated)
    },
    delUser(id) {
        const db = readDb()
        const filtered = db.filter(user => user.id !== id)
        writeFile(filtered)
    },
    registerUser(userData) {
        const db = readDb()
        const newUser = {
            id: uuidv4(),
            username: userData.username,
            password: userData.password,
            name: userData.name,
            gender: userData.gender,
            created: new Date().toISOString()
        }
        writeFile([...db, newUser])
        return newUser
    }
}
module.exports = UserModel