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

describe('board', () => {
    beforeEach(async () => await AppDataSource.synchronize(true))

    test('board test1', async () => {
        setNow('2022-04-01')

        // 계정 생성
        const res1 = await request.post('/user').send({ username: 'tom', password: '1234' })
        expect(res1.statusCode).toEqual(200)
        const r1=JSON.parse(res1.text)
        expect(r1.data.ok).toEqual(1)

        // 계정 로그인 - jwt 획득
        const res2 = await request.post('/user/login').send({ username: 'tom', password: '1234' })
        expect(res2.statusCode).toEqual(200)
        const r2=JSON.parse(res2.text)
        expect(r2.data.user.username).toEqual('tom')
        const u1Id=r2.data.user.userId
        expect(r2.data.jwt).not.toBeNull()

        // 계정2 생성 및 로그인 후 jwt 획득
        await request.post('/user').send({ username: 'paul', password: 'abcd' })
        const res21=await request.post('/user/login').send({ username: 'paul', password: 'abcd' })
        const r21=JSON.parse(res21.text)

        // 게시글 작성
        const res3 = await request.post('/board').set('jwt_access_token',r2.data.jwt).send({ text: 'board1' })
        expect(res3.statusCode).toEqual(200)
        const r3=JSON.parse(res3.text)
        expect(r3.data.text).toEqual('board1')

        // 게시글 확인
        const res4 = await request.get('/board').query({ boardId: r3.data.boardId})
        expect(res4.statusCode).toEqual(200)
        const r4=JSON.parse(res4.text)
        expect(r4.data.text).toEqual('board1')

        const randomText=['board', 'loren', 'ipsum', 'keyword', 'query', 'search', 'sample', 'example']
        // 게시글 추가 생성
        for(let i=0; i<3000;++i){
            await request.post('/board').set('jwt_access_token',r2.data.jwt).send({ text: randomText[i % randomText.length] })
        }

        // 게시글 검색 (FULLTEXT 인덱스는 DB 실행계획 통해 확인하였습니다)
        const res5 = await request.get('/board/search').query({ searchText: 'board'})
        expect(res5.statusCode).toEqual(200)
        const r5=JSON.parse(res5.text)
        expect(r5.data).toHaveLength(375)

        // jwt 없이 게시글 삭제 시도 - 실패
        const res6 = await request.delete('/board').query({boardId: 1})
        expect(res6.statusCode).toEqual(401)
        const r6=JSON.parse(res6.text)
        expect(r6.message).toEqual(ErrorString.WrongJWT)

        // 오염된 jwt 로 게시글 삭제 시도 - 실패
        const res7 = await request.delete('/board').set('jwt_access_token','wrong jwt').query({boardId: 1})
        expect(res7.statusCode).toEqual(401)
        const r7=JSON.parse(res7.text)
        expect(r7.message).toEqual(ErrorString.WrongJWT)

        // 다른 유저가 게시글 삭제 시도 - 실패
        const res71 = await request.delete('/board').set('jwt_access_token',r21.data.jwt).query({boardId: 1})
        expect(res71.statusCode).toEqual(401)
        const r71=JSON.parse(res71.text)
        expect(r71.message).toEqual(ErrorString.UnAuthorized)

        // 없는 게시글 삭제 시도 - 실패
        const res72 = await request.delete('/board').set('jwt_access_token',r21.data.jwt).query({boardId: 8000})
        expect(res72.statusCode).toEqual(400)
        const r72=JSON.parse(res72.text)
        expect(r72.message).toEqual(ErrorString.BadClientRequest)

        // 게시글 삭제 - 성공
        const res8 = await request.delete('/board').set('jwt_access_token',r2.data.jwt).query({boardId: 1})
        expect(res8.statusCode).toEqual(200)
        const r8=JSON.parse(res8.text)
        expect(r8.data.ok).toEqual(1)

        // 나의 게시글 조회
        const res9 = await request.get('/board/my').set('jwt_access_token',r2.data.jwt)
        expect(res9.statusCode).toEqual(200)
        const r9=JSON.parse(res9.text)
        expect(r9.data).toHaveLength(3000)
        expect(r9.data.filter(e=>e.userId == u1Id)).toHaveLength(3000)
    }, 900000)
})
