import fs from 'fs/promises'

// add the users data to the database
export const addToDb = async(data, path)=>{
    try {
        const users = await fs.readFile(path, 'utf-8')
        const parsedDbUser = JSON.parse(users)
        parsedDbUser.push(data)
        fs.writeFile(path, JSON.stringify(parsedDbUser))
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}