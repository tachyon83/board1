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

    async read(boardId: number): Promise<Board> {
        return this.repo.findOne({where:{boardId}})
    }
}
