import { AppDataSource } from '../src/data-source'
import { setNow } from './testUtil'
import * as supertest from 'supertest'
import App from "../src/app";

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
        // jest.mock('express', () => {
        //     Router: () => jest.fn()
        // })

        // supertest(app)
        //     .post('/user')
        //     //   .send('name=john') // x-www-form-urlencoded upload
        //     .send({ username: 'abc', password: '1234' })
        //     .set('Accept', 'application/json')
        //     .expect('Content-Type', /json/)
        //     // .expect(200)
        //     // .expect(function (res) {
        //     //     res.body.id = 'some fixed id';
        //     //     res.body.name = res.body.name.toLowerCase();
        //     // })
        //     .expect(200, {
        //         ok: 1
        //     });

        // const request = supertest(app).post('/user').body({ username: 'abc', password: '1234' })
        // console.log(21, request)

        // expect(response.statusCode).toEqual(200)
        // const response = await request('127.0.0.1', {
        //     // hostname: 'localhost',
        //     port: 4000,
        //     path: '/user',
        //     method: 'POST',
        //     //  *   headers: {
        //     //  *     'Content-Type': 'application/json',
        //     //  *     'Content-Length': Buffer.byteLength(postData)
        // }, body => console.log(21, body))


        setNow('2022-04-01')

        // const userController = new UserController(new UserService())
        // const req1 = {
        //     body: {
        //         username: 'abc',
        //         password: '1234',
        //     }
        // } as express.Request
        // const res = {} as express.Response
        // const r1 = await userController.create(req1, res)
        // expect(r1.ok).toEqual(1)

        // const req2 = {
        //     contextUserId: 1,
        //     body: {
        //         username: 'def',
        //     },

        // } as express.Request

        // const r2 = await userController.update(req2, res)
        // expect(r2.username).toEqual('def')

        // const req3 = {
        //     body: {
        //         username: 'def',
        //         password: '1234'
        //     }
        // }
        // const r3 = await userController.login(req3, res)
        // expect(r3.username).toEqual('def')

        // const req4 = {
        //     contextUserId: 1,
        // } as express.Request

        // const r4 = await userController.delete(req4, res)
        // expect(r4.ok).toEqual(1)

        // supertest(app)
        //     .post('/user')
        //     //     //   .send('name=john') // x-www-form-urlencoded upload
        //     .send({ username: 'abc', password: '1234' })
        //     //     .set('Accept', 'application/json')
        //     //     .expect('Content-Type', /json/)
        //     //     // .expect(200)
        //     //     // .expect(function (res) {
        //     //     //     res.body.id = 'some fixed id';
        //     //     //     res.body.name = res.body.name.toLowerCase();
        //     //     // })
        //     .expect(200, {
        //         ok: 1
        //     })
        //     .end(async function (err, res) {
        //         console.log(105)
        //         if (err) console.error(err)
        //         console.log(106, res)
        //         // return await done()
        //     })

        // const res1 = await supertest(app).post('/user').send({ username: 'abcd', password: '1234' })

        // const createdApp=new App([
        //     new UserController(new UserService()),
        // ])
        // const request=supertest(createdApp.app)
        const res1 = await request.post('/user')
            .send({ username: 'abcd', password: '1234' })
            // .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
        // console.log(111, res1)
        expect(res1.statusCode).toEqual(200)
        // expect(res1)
    })
})
