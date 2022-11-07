import {IJwtOutput} from "../Common/output";
import {User} from "./User";

export interface IUserOutput extends IJwtOutput{
    user: User
}