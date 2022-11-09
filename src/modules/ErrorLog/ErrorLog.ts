import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from '../Common/CommonEntity'

@Entity()
export class ErrorLog extends CommonEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    readonly errorLogId: number

    @Column({ type: 'varchar', nullable: true })
    errorString: string | null

    @Column({ type: 'varchar', nullable: true })
    path: string | null
}
