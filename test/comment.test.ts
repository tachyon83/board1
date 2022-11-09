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

        // 게시글1에 붙은 코멘트 순서대로 확인하기
        // [commentId, parentId, depth]
        // 화면에서 보여질 댓글 순서대로 서버에서 정렬하였습니다.
        // 1,0,0
        //      3,1,1
        //          6,3,2
        // 2,0,0
        //      7,2,1
        //      8,2,1
        //          11,8,2
        //      9,2,1
        //          10,9,2
        // 4,0,0
        //      12,4,1
        //          13,12,2
        //          15,12,2
        //      14,4,1
        //          16,14,2
        //              17,16,3
        //                  18,17,4
        // 5,0,0
        //      19,5,1

        const createComment = async (token, boardId, text, parentId, depth)=>{
            await request.post('/comment').set('jwt_access_token',token).send({
                boardId, text, parentId, depth,
            })
        }

        // 게시글1에 코멘트들 생성
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 0, 0)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 0, 0)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 1, 1)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 0, 0)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 0, 0)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 3, 2)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 2, 1)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 2, 1)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 2, 1)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 9, 2)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 8, 2)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 4, 1)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 12, 2)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 4, 1)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 12, 2)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 14, 2)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 16, 3)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 17, 4)
        await createComment(r1.data.jwt, b1, 'comment on b1 by u1', 5, 1)

        const res4=await request.get('/comment').query({boardId:b1})
        expect(res4.statusCode).toEqual(200)
        const l4=JSON.parse(res4.text)
        expect(l4.data).toHaveLength(19)
        expect(l4.data[3].commentId).toEqual(2)
        expect(l4.data[6].commentId).toEqual(11)
        expect(l4.data[8].commentId).toEqual(10)
        expect(l4.data[13].commentId).toEqual(14)
        expect(l4.data[15].commentId).toEqual(17)
        expect(l4.data[17].commentId).toEqual(5)
        expect(l4.data[18].commentId).toEqual(19)

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
