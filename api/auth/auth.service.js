import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function login(fullname, password) {
    var user = await userService.getByFullname(fullname)
    if (!fullname) throw 'Unkown fullname'

    //  un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) throw 'Invalid fullname or password'

    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin
    }

    console.log('miniUser',miniUser)

    return miniUser

}

async function signup({ fullname, password }) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with, fullname: ${fullname}`)
    if ( !password || !fullname) throw 'Missing required signup information'

    const userExist = await userService.getByFullname(fullname)
    if (userExist) throw 'Username already taken'

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ fullname, password: hash })
}