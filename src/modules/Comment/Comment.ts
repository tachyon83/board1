import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'
import { CommonEntity } from '../Common/CommonEntity'
import {Board} from "../Board/Board"

@Entity()
export class Comment extends CommonEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    readonly commentId: number

    @ManyToOne(() => Board, { eager: false })
    @JoinColumn({ name: 'boardId' })
    board!: Board

    @Column({ type: 'int', nullable: false })
    boardId: number

    @Column({ type: 'longtext', nullable: false })
    text: string

    @Column({type:'int', nullable:false, default:0})
    parentId: number

    @Column({type:'int', nullable:false, default:0})
    depth: number
}
