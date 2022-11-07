import { AppDataSource } from '../../data-source'
import { CommonUtils } from "../../utils/CommonUtils";
import { IUserInput } from './interface';
import { User } from './User';

export default class UserService {
    private repo = AppDataSource.getRepository(User)

    async create(data: IUserInput): Promise<{ ok: number }> {
        const { username, password } = data
        const existingUser = await this.repo.findOne({ where: { username } })
        if (existingUser) throw new Error()

        const hashedPassword = await CommonUtils.getHashedPassword(password)
        const inst = await this.repo.create({
            username,
            password: hashedPassword
        })
        await this.repo.insert(inst)
        return { ok: 1 }
    }

    async login(data: IUserInput): Promise<User> {
        const { username, password } = data
        const existingUser = await this.repo.findOne({ where: { username } })
        if (!existingUser) throw new Error()

        const isPwCorrect = await CommonUtils.comparePassword(password, existingUser.password)
        if (!isPwCorrect) throw new Error()

        return existingUser
    }

    async update(newUserName: string, userId: number): Promise<User> {
        const { affected } = await this.repo.update({ userId }, { username: newUserName })
        if (!affected || affected <= 0) throw new Error()

        return this.repo.findOne({ where: { userId } })
    }

    async delete(userId: number): Promise<{}> {
        const { affected } = await this.repo.delete({ userId })
        if (!affected || affected <= 0) return new Error()

        return { ok: 1 }
    }
}
