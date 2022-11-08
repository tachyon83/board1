import {AppDataSource} from '../../data-source'
import {IBoardInput} from './interface'
import {Board} from "./Board";
import {IProcessResult} from "../Common/interface";
import {ErrorString} from "../../utils/enums";
import {CustomError} from "../../middlewares/error.handler";

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

    async search(text: string): Promise<Board[]> {
        return this.repo.createQueryBuilder()
            .select()
            .where(`MATCH(text) AGAINST ('${text}')`)
            .getMany()
    }

    async delete(boardId:number, userId:number): Promise<IProcessResult> {
        const existingBoard = await this.repo.findOne({where: {boardId}})
        if(!existingBoard) throw new CustomError(ErrorString.BadClientRequest, 'BoardService_delete_noExistingBoard')

        if(existingBoard.userId !== userId) throw new CustomError(ErrorString.UnAuthorized, 'BoardService_delete_unauthorized')

        const { affected } = await this.repo.delete({boardId})
        return { ok: (affected && affected>0)? 1:0}
    }

    async getMyPosts(userId: number): Promise<Board[]> {
        return this.repo.find({where:{userId}})
    }
}
