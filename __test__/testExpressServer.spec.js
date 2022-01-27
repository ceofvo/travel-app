import 'regenerator-runtime/runtime';
import {app} from '../src/server/server';
const supertest = require('supertest');
const request = supertest(app)

describe("Testing the server functions and endpoint", () => { 
    test("Testing the / end point", async () => {
        const response = await request.get('/')
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined(); 
    })
});