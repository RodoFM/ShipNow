import UserServices from '../services/user.services.js';

class UserController {
  static async getAll(req, res) {
    try {           
    const users = await User.service.getAll();
    res.status(200).json(users);
  } catch{
    console.warn("Error al obtener los usuarios"); 
    res.status(500).json({ statusCode: 500, message: 'Internal server Error' });
  }
}
}

export default UserController;