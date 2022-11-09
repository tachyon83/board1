import { AppDataSource } from '../src/data-source'
import { setNow } from './testUtil'
import * as supertest from 'supertest'
import App from "../src/app"
import {ErrorString} from "../src/utils/enums";

var request

beforeAll(async () => {
    await AppDataSource.initialize()
    const createdApp=new App()
    request=supertest(createdApp.app)
})
afterAll(async () => await AppDataSource.destroy())

describe('comment', () => {
    beforeEach(async () => await AppDataSource.synchronize(true))

    test('comment test1', async () => {
        setNow('2022-04-01')

        // 계정 생성 및 로그인 - jwt 획득
        await request.post('/user').send({ username: 'tom', password: '1234' })
        const res1 = await request.post('/user/login').send({ username: 'tom', password: '1234' })
        const r1=JSON.parse(res1.text)
        const u1Id=r1.data.user.userId

        // 계정2 생성 및 로그인 후 jwt 획득
        await request.post('/user').send({ username: 'paul', password: 'abcd' })
        const res11=await request.post('/user/login').send({ username: 'paul', password: 'abcd' })
        const r11=JSON.parse(res11.text)
        const u2Id=r11.data.user.userId

        // 게시글1 작성
        const res2 = await request.post('/board').set('jwt_access_token',r1.data.jwt).send({ text: 'post1_by_u1' })
        const r2=JSON.parse(res2.text)
        const b1=r2.data.boardId

        // 게시글2 작성
        const res3 = await request.post('/board').set('jwt_access_token',r11.data.jwt).send({ text: 'post2_by_u2' })
        const r3=JSON.parse(res3.text)
        const b2=r3.data.boardId

        // 게시글1에 코멘트1 생성
        await request.post('/comment').set('jwt_access_token',r1.data.jwt).send({
            boardId: b1,
            text:'comment on b1 by u1',
        })

        // 게시글2에 코멘트 2개 생성
        const res41 = await request.post('/comment').set('jwt_access_token',r1.data.jwt).send({
            boardId: b2,
            text:'comment on b2 by u1',
        })
        expect(res41.statusCode).toEqual(200)
        const r41=JSON.parse(res41.text)
        expect(r41.data.text).toEqual('comment on b2 by u1')
        expect(r41.data.parentId).toEqual(0)
        expect(r41.data.boardId).toEqual(b2)
        const c21=r41.data.commentId

        const res42 = await request.post('/comment').set('jwt_access_token',r11.data.jwt).send({
            boardId: b2,
            text:'comment on b2 by u2',
        })
        const r42=JSON.parse(res42.text)
        const c22=r42.data.commentId

        // 게시글2에 붙은 u1 코멘트를 u2가 수정 시도 - 실패
        const res6 = await request.patch('/comment').set('jwt_access_token',r11.data.jwt).send({
            commentId: c21,
            text:'comment on b2 now by u2',
        })
        expect(res6.statusCode).toEqual(401)
        const r6=JSON.parse(res6.text)
        expect(r6.message).toEqual(ErrorString.UnAuthorized)

        // 게시글2에 붙은 u2 코멘트를 u2가 수정 - 성공
        const res7 = await request.patch('/comment').set('jwt_access_token',r11.data.jwt).send({
            commentId: c22,
            text:'comment on b2 now by u2',
        })
        expect(res7.statusCode).toEqual(200)
        const r7=JSON.parse(res7.text)
        expect(r7.data.text).toEqual('comment on b2 now by u2')

        // 게시글2에 붙은 u2 코멘트를 u1이 삭제 시도 - 실패
        const res8 = await request.delete('/comment').set('jwt_access_token',r1.data.jwt).query({commentId: c22})
        expect(res8.statusCode).toEqual(401)
        const r8=JSON.parse(res8.text)
        expect(r8.message).toEqual(ErrorString.UnAuthorized)

        const res101=await request.get('/comment').query({boardId: b2})
        const l101=JSON.parse(res101.text)
        expect(l101.data).toHaveLength(2)
        // 게시글2에 붙은 u2 코멘트를 u1이 삭제 - 성공
        const res9 = await request.delete('/comment').set('jwt_access_token',r11.data.jwt).query({commentId: c22})
        expect(res9.statusCode).toEqual(200)
        const res10=await request.get('/comment').query({boardId: b2})
        const l10=JSON.parse(res10.text)
        expect(l10.data).toHaveLength(1)
    })
})
