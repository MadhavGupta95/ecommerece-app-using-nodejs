import jwt from "jsonwebtoken"

const secret = 'AnyTHINg@#$!_ab123'

export const generateToken = (payload)=>{
    return jwt.sign(payload, secret, {
        'expiresIn' : '100d'
    })
}

export const verifyToken = async(token)=>{
    try {
        const payload = jwt.verify(token, secret)
        return payload
    } catch (error) {
        console.log(error);
        return null
    }
}