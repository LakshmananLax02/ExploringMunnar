import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";

const userRepo = new UserRepository();

export class UserService {
  /**
   * Validate user ID exists
   */
  async validateUserId(userId: number) {
    const exists = await userRepo.exists(userId);
    if (!exists) {
      throw new ApiError(
        400,
        `User with id ${userId} does not exist`,
        "ForeignKeyError"
      );
    }
  }
}
