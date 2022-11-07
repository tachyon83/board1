import {AppDataSource} from '../../data-source'
import {CommonUtils} from '../../utils/CommonUtils'
import {IUserInput} from './interface'
import {User} from './User'
import {ErrorString} from '../../utils/enums'
import {IUserOutput} from './output'
import * as jwtUtils from '../../utils/jwtUtils'
import {JWT_SUBJECT} from "../../configs/jwtSettings";
import {CustomError} from "../../middlewares/error.handler";

export default class UserService {
    private repo = AppDataSource.getRepository(User)

    async create(data: IUserInput): Promise<{ ok: number }> {
        const { username, password } = data
        const existingUser = await this.repo.findOne({ where: { username } })
        if (existingUser) throw new CustomError(ErrorString.DuplicateUserName, 'UserService_create_existingUser')

        const hashedPassword = await CommonUtils.getHashedPassword(password)
        const inst = await this.repo.create({
            username,
            password: hashedPassword
        })
        await this.repo.insert(inst)
        return { ok: 1 }
    }

    async login(data: IUserInput): Promise<IUserOutput> {
        const { username, password } = data
        const existingUser = await this.repo.findOne({ where: { username } })
        if (!existingUser) throw new CustomError(ErrorString.BadClientRequest, 'UserService_login_noExistingUser')

        const isPwCorrect = await CommonUtils.comparePassword(password, existingUser.password)
        if (!isPwCorrect) throw new CustomError(ErrorString.BadClientRequest, 'UserService_login_incorrectPw')

        return {
            user:existingUser,
            jwt:jwtUtils.sign({username}, {expiresIn:'5m', subject:JWT_SUBJECT.ACCESS})
        }
    }

    async update(data:Partial<IUserInput>, userId: number): Promise<IUserOutput> {
        const { username: newUserName }=data
        const { affected } = await this.repo.update({ userId }, { username: newUserName })
        if (!affected || affected <= 0) throw new CustomError(ErrorString.BadClientRequest, 'UserService_update_noExistingUser')

        return {
            user: await this.repo.findOne({ where: { userId } }),
            jwt: jwtUtils.sign({username: newUserName}, {expiresIn:'5m', subject:JWT_SUBJECT.ACCESS})
        }
    }

    async delete(userId: number): Promise<{ok:number}> {
        const { affected } = await this.repo.delete({ userId })
        if (!affected || affected <= 0) throw new CustomError(ErrorString.BadClientRequest, 'UserService_delete_noExistingUser')

        return { ok: 1 }
    }
}
