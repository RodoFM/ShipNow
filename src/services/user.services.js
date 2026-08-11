import UserRepository from '../repositories/user.repository.js';

/*LOGICA DE NEGOCIO*/

class UserServices {
    static async getAll() {
        return await UserRepository.find();
    }
}

export default UserServices;