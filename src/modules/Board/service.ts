import {AppDataSource} from '../../data-source'
import {IBoardInput} from './interface'
import {Board} from "./Board";

export default class BoardService {
    private repo = AppDataSource.getRepository(Board)

    async create(data: IBoardInput, userId:number): Promise<Board> {
        const { text } = data
        const inst = await this.repo.create({text, userId})
        await this.repo.insert(inst)
        return this.repo.findOne({where:{boardId:inst.boardId}})
    }

    // async read(boardId: number): Promise<Board> {
    //     return this.repo.findOne({where:{boardId}})
    // }
    //
    // async update(data:Partial<IUserInput>, userId: number): Promise<IUserOutput> {
    //     const { username: newUserName }=data
    //     const { affected } = await this.repo.update({ userId }, { username: newUserName })
    //     if (!affected || affected <= 0) throw new CustomError(ErrorString.BadClientRequest, 'UserService_update_noExistingUser')
    //
    //     const serverOptions:IServerOptions=Container.get(ContainerKeys.ServerOption)
    //     return {
    //         user: await this.repo.findOne({ where: { userId } }),
    //         jwt: jwtUtils.sign({username: newUserName}, {expiresIn:serverOptions.ACCESS_TOKEN_EXPIRES_IN, subject:JWT_SUBJECT.ACCESS})
    //     }
    // }
    //
    // async delete(userId: number): Promise<{ok:number}> {
    //     const { affected } = await this.repo.delete({ userId })
    //     if (!affected || affected <= 0) throw new CustomError(ErrorString.BadClientRequest, 'UserService_delete_noExistingUser')
    //
    //     return { ok: 1 }
    // }
}
