import { AppDataSource } from '../src/data-source'
import { setNow } from './testUtil'
import * as supertest from 'supertest'
import App from "../src/app"

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
        expect(r2.data.jwt).not.toBeNull()

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
    }, 600000)
})
