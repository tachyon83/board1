import {AppDataSource} from '../../data-source'
import {CommonUtils} from '../../utils/CommonUtils'
import {IUserInput, IUserOutput} from './interface'
import {User} from './User'
import {ContainerKeys, ErrorString} from '../../utils/enums'
import * as jwtUtils from '../../utils/jwtUtils'
import {JWT_SUBJECT} from "../../configs/jwtSettings"
import {CustomError} from "../../middlewares/error.handler"
import Container from 'typedi'
import {IServerOptions} from "../../common/interfaces/serverOptionInterface"
import {IProcessResult} from "../Common/interface";

export default class UserService {
    private repo = AppDataSource.getRepository(User)

    async create(data: IUserInput): Promise<IProcessResult> {
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

        const serverOptions:IServerOptions=Container.get(ContainerKeys.ServerOption)
        return {
            user:existingUser,
            jwt:jwtUtils.sign({username}, {expiresIn:serverOptions.ACCESS_TOKEN_EXPIRES_IN, subject:JWT_SUBJECT.ACCESS})
        }
    }

    async update(data:Partial<IUserInput>, userId: number): Promise<IUserOutput> {
        const { username: newUserName }=data
        const { affected } = await this.repo.update({ userId }, { username: newUserName })
        if (!affected || affected <= 0) throw new CustomError(ErrorString.BadClientRequest, 'UserService_update_noExistingUser')

        const serverOptions:IServerOptions=Container.get(ContainerKeys.ServerOption)
        return {
            user: await this.repo.findOne({ where: { userId } }),
            jwt: jwtUtils.sign({username: newUserName}, {expiresIn:serverOptions.ACCESS_TOKEN_EXPIRES_IN, subject:JWT_SUBJECT.ACCESS})
        }
    }

    async delete(userId: number): Promise<IProcessResult> {
        const { affected } = await this.repo.delete({ userId })
        if (!affected || affected <= 0) throw new CustomError(ErrorString.BadClientRequest, 'UserService_delete_noExistingUser')

        return { ok: 1 }
    }
}
