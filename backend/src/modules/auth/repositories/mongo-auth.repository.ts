import { IAuthRepository } from './auth.repository.interface';
import { UserModel } from '../models/user.model';

export class MongoAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<any | null> {
    return await UserModel.findOne({ email });
  }

  async createUser(userData: any): Promise<any> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }
}
