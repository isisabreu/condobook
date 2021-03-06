import jwt from 'jsonwebtoken';

import residentRepository from '../repository/residents.repository';
import passwordUtils from '../utils/password.utils';

import ApplicationError from '../errors/ApplicationError';

class ResidentsService {
  constructor() {
    this.residentRepo = residentRepository;
  }

  async authenticateResident(residentCredentials) {

    const residentFromDb = await this.residentRepo.findUser(residentCredentials.email);

    if (!residentFromDb) {
      throw new ApplicationError({ message: 'Wrong Credentials', type: 'Resident-Wrong-Credentials', status: 400 })
    }

    const isPasswordValid = passwordUtils.verify(residentCredentials.password, residentFromDb.password);

    if (!isPasswordValid) {
      throw new ApplicationError({ message: 'Wrong Credentials', type: 'Resident-Wrong-Credentials', status: 400 })
    }

    const token = jwt.sign(
      { id: residentFromDb._id, role: residentFromDb.role },
      process.env.TOKEN_SECRET,
      { expiresIn: '45m' },
    );

    return {token: token, role: residentFromDb.role};
  }
}

export default new ResidentsService();