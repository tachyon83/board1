import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import * as ormConfig from './configs/ormconfig'

export const AppDataSource = new DataSource(ormConfig as DataSourceOptions)