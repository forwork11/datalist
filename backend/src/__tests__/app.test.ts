import request from 'supertest';
const app = require('../routes/fileRoutes')

describe('File Upload', () => {
  it('should upload a file', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('file', 'path/to/test.csv'); // Use a real file here
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');
  });
});