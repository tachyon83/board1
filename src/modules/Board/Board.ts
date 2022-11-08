import {Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn} from 'typeorm'
import { IndexNames } from '../../configs/indexMap'
import { CommonEntity } from '../Common/CommonEntity'
import {User} from "../User/User";

@Entity()
@Index(IndexNames.BOARD_TEXT_QUERY_INDEX, ['text'], { fulltext: true })
export class Board extends CommonEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    readonly boardId: number

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'userId' })
    user!: User

    @Column({ type: 'int', nullable: false })
    userId: number

    @Column({ type: 'longtext', nullable: false })
    text: string
}
