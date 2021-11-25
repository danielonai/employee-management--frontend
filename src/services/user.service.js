import { httpService } from './http.service';
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    getUsers,
    getById,
    remove,
    update,
    getDemoUser
};

window.userService = userService;

function getUsers() {
    return httpService.get(`user`)
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    return user;
}

function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

async function update(user) {
    await httpService.put(`user/${user._id}`, user)
    if (getLoggedinUser()._id === user._id) _saveLocalUser(user);
    return user;
}

async function login(userCred) {
    try {
        const user = await httpService.post('auth/login', userCred)
        if (user) return _saveLocalUser(user)
    } catch (err) {
        throw err
    }
}
async function signup(userCred) {
    try {
        const user = await httpService.post('auth/signup', userCred)
        return _saveLocalUser(user);
    } catch (err) {
        throw err
    }
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
    return await httpService.post('auth/logout')
}


function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
    return user;
}

function getLoggedinUser() {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null');
    return user
}

function getDemoUser() {
    return { username: 'Demouser', password: 'Demouser' }
}