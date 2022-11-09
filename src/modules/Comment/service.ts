import {AppDataSource} from '../../data-source'
import {IProcessResult} from "../Common/interface";
import {ErrorString} from "../../utils/enums";
import {CustomError} from "../../middlewares/error.handler";
import {Comment} from "./Comment";
import {ICommentInput} from "./interface";
import {CommonUtils} from "../../utils/CommonUtils";
import {IsNull} from "typeorm";

export default class CommentService {
    private repo = AppDataSource.getRepository(Comment)

    async create(data: ICommentInput, userId:number): Promise<Comment> {
        const { boardId, text, parentId, depth } = data
        const inst = await this.repo.create({text, userId, boardId, parentId:parentId??0, depth:depth??0})
        await this.repo.insert(inst)
        return this.repo.findOne({where:{commentId:inst.commentId}})
    }

    async read(boardId: number): Promise<Comment[]> {
        return this.repo.find({where:{boardId, deletedAt:IsNull()}})
    }

    async update(data: ICommentInput, userId:number): Promise<Comment> {
        const { commentId, text } = data
        const existingComment = await this.repo.findOne({where: {commentId}})
        if(!existingComment) throw new CustomError(ErrorString.BadClientRequest, 'CommentService_update_noExistingComment')
        if(existingComment.userId !== userId) throw new CustomError(ErrorString.UnAuthorized, 'CommentService_update_unauthorized')

        await this.repo.update({commentId}, {text})
        return this.repo.findOne({where:{commentId}})
    }

    async delete(commentId:number, userId:number): Promise<IProcessResult> {
        const existingComment = await this.repo.findOne({where: {commentId}})
        if(!existingComment) throw new CustomError(ErrorString.BadClientRequest, 'CommentService_delete_noExistingComment')
        if(existingComment.userId !== userId) throw new CustomError(ErrorString.UnAuthorized, 'CommentService_delete_unauthorized')

        const { affected } = await this.repo.update({commentId}, {deletedAt:CommonUtils.getNowDate()})
        return { ok: (affected && affected>0)? 1:0}
    }
}
