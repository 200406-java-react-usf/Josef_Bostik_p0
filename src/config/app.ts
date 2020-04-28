import { UserRepository } from "../repos/user_repo";
import { UserService } from "../services/user_service";
import { User } from "../models/user";


export class UserInstance {
    getInstance(): UserService {
        const userRepo = new UserRepository();
        const userService = new UserService(userRepo);
        return userService;
    }
}

// export default {
//     getInstance
// }