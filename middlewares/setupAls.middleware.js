import {
    authService
} from '../api/auth/auth.service.js'
import {
    asyncLocalStorage
} from '../services/als.service.js'

export async function setupAsyncLocalStorage(req, res, next) {
    const storage = {}
    asyncLocalStorage.run(storage, () => {

        if (!req.cookies) return next()
        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        console.log(loggedinUser)
        if (loggedinUser) {
            const alsStore = asyncLocalStorage.getStore()
            alsStore.loggedinUser = loggedinUser
        }
        console.log('after if',loggedinUser)
        next()
    })
}