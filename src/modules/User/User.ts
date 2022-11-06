import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'
import { IndexNames } from '../../configs/indexMap'
import { CommonEntity } from '../Common/CommonEntity'

@Entity()
@Index(IndexNames.POINT_DAILY_BOOK_UNIQUE_INDEX, ['username'], { unique: true })
export class User extends CommonEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    readonly userId: number

    @Column({ type: 'varchar', nullable: false })
    username: string

    @Column({ type: 'varchar', nullable: false })
    password: string
}
