import request from 'supertest';

const app = require('../../src/index');

describe('Wrong endpoint return nof found code', () => {
    it('missing wrong endpoint return 404 code', () => {
        return request(app)
            .get('/example')
            .expect(404) &&
            request(app)
                .get('')
                .expect(404);
    })
})