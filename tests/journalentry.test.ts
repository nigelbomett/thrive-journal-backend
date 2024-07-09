import request from 'supertest';
import {app} from '../src/server';
import {User} from '../src/models/User';
import {JournalEntry} from '../src/models/JournalEntry';
import {sequelize_test} from '../src/config/db';

jest.setTimeout(30000);

describe('Journal API',  () => {
    let token: string

    beforeAll(async () => {
        //Sync database
        await sequelize_test.sync({force:true});

    //create a user and get a token
    const user = await User.create({
        username: 'testuser',
        email:'testuser@testmail.com',
        password_hash: 'password123'
    });
  
    const response = await request(app)
        .post('/auth/login')
        .send({
            email: 'testuser@testmail.com',
            password: 'password123'
        });
        token = response.body.token;
    });

    

afterAll(async () => {
    //Close the database connection
    await sequelize_test.close();
});

describe('Entries', () => {

    it('should create a new journal entry', async () => {
        const response = await request(app)
        .post('/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'First Entry',
            content: 'This is my first journal entry.',
            category: 'Personal'
        });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('First Entry');
    });

    it('should fetch all entries',async () => {
        const response = await request(app)
            .get('/entry')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('First Entry');
    });

    it('should fetch a specific entry by ID',async () => {
        const entry = await JournalEntry.findOne({where: {title: 'First Entry'}});

        const response = await request(app)
            .get(`/entry/${entry!.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('First Entry');
    });

    it('should update a entry', async () => {
        const entry = await JournalEntry.findOne({where: {title: 'First Entry'}});

        const response = await request(app)
            .put(`/entry/${entry!.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Entry',
                content: 'This is my updated journal entry.',
                category: 'Work'
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Entry');
    });

    it('should delete an entry', async () => {
        const entry = await JournalEntry.findOne({where: {title: 'Updated Entry'}});

        const response = await request(app)
            .delete(`/entry/${entry!.id}`)
            .set('Authorization',`Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Journal Entry Deleted')
    });
});
});