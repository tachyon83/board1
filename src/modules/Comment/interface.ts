export interface ICommentInput {
    commentId?:number
    boardId: number
    text: string
    parentId?: number
    depth?: number
}