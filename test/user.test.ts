import { AppDataSource } from '../src/data-source'
import { setNow } from './testUtil'
import * as supertest from 'supertest'
import App from "../src/app";
import {ErrorString} from "../src/utils/enums";

var request

beforeAll(async () => {
    await AppDataSource.initialize()
    const createdApp=new App()
    request=supertest(createdApp.app)
})
afterAll(async () => await AppDataSource.destroy())

describe('user', () => {
    beforeEach(async () => await AppDataSource.synchronize(true))

    test('user test1', async () => {
        setNow('2022-04-01')

        // 계정 생성
        const res1 = await request.post('/user').send({ username: 'tom', password: '1234' })
        expect(res1.statusCode).toEqual(200)
        const r1=JSON.parse(res1.text)
        expect(r1.data.ok).toEqual(1)

        // 계정 로그인 - 잘못된 유저네임 - 실패
        const res2 = await request.post('/user/login').send({ username: 'to', password: '1234' })
        expect(res2.statusCode).toEqual(400)
        const r2=JSON.parse(res2.text)
        expect(r2.message).toEqual(ErrorString.BadClientRequest)

        // 계정 로그인 - 잘못된 비밀번호 - 실패
        const res3 = await request.post('/user/login').send({ username: 'tom', password: '123' })
        expect(res3.statusCode).toEqual(400)
        const r3=JSON.parse(res3.text)
        expect(r3.message).toEqual(ErrorString.BadClientRequest)

        // 계정 로그인 - jwt 획득
        const res4 = await request.post('/user/login').send({ username: 'tom', password: '1234' })
        expect(res4.statusCode).toEqual(200)
        const r4=JSON.parse(res4.text)
        expect(r4.data.user.username).toEqual('tom')
        expect(r4.data.jwt).not.toBeNull()

        // jwt 없이 계정 업데이트 시도 - 실패
        const res5 = await request.patch('/user').send({ username: 'tom2'})
        expect(res5.statusCode).toEqual(401)
        const r5=JSON.parse(res5.text)
        expect(r5.message).toEqual(ErrorString.WrongJWT)

        // 오염된 jwt 로 계정 업데이트 시도 - 실패
        const res6 = await request.patch('/user').set('jwt_access_token_key', 'wrong').send({ username: 'tom2'})
        expect(res6.statusCode).toEqual(401)
        const r6=JSON.parse(res6.text)
        expect(r6.message).toEqual(ErrorString.WrongJWT)

        // 정상 jwt 로 계정 업데이트 - 성공
        const res7 = await request.patch('/user').set('jwt_access_token_key', r4.data.jwt).send({ username: 'tom2'})
        expect(res7.statusCode).toEqual(200)
        const r7=JSON.parse(res7.text)
        expect(r7.data.user.username).toEqual('tom2')
        expect(r7.data.jwt).not.toBeNull()
        expect(r7.data.jwt).not.toEqual(r4.data.jwt)

        // 동일 유저네임 계정 생성 시도 - 실패
        const res8 = await request.post('/user').send({ username: 'tom2', password: '5678' })
        expect(res8.statusCode).toEqual(409)
        const r8=JSON.parse(res8.text)
        expect(r8.message).toEqual(ErrorString.DuplicateUserName)

        // jwt 없이 계정 삭제 시도 - 실패
        const res9 = await request.post('/user/delete')
        expect(res9.statusCode).toEqual(401)
        const r9=JSON.parse(res9.text)
        expect(r9.message).toEqual(ErrorString.WrongJWT)

        // 오염된 jwt 로 계정 삭제 시도 - 실패
        const res10 = await request.post('/user/delete').set('jwt_access_token_key', 'wrong')
        expect(res10.statusCode).toEqual(401)
        const r10=JSON.parse(res10.text)
        expect(r10.message).toEqual(ErrorString.WrongJWT)

        // 정상 jwt 로 계정 삭제 - 성공
        const res11 = await request.post('/user/delete').set('jwt_access_token_key', r7.data.jwt)
        expect(res11.statusCode).toEqual(200)
        const r11=JSON.parse(res11.text)
        expect(r11.data.ok).toEqual(1)
    })
})
