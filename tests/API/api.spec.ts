import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/fixtures';

test.describe('API', () => {
    test('user can be created and deleted via API', async ({ request }) => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        const createResponse = await request.post('/api/createAccount', {
            form: {
                name: faker.person.firstName(),
                email,
                password,
                title: 'Mr',
                birth_date: '10',
                birth_month: '5',
                birth_year: '1990',
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                company: faker.company.name(),
                address1: faker.location.streetAddress(),
                address2: faker.location.secondaryAddress(),
                country: 'India',
                zipcode: faker.location.zipCode(),
                state: faker.location.state(),
                city: faker.location.city(),
                mobile_number: faker.phone.number(),
            },
        });

        const createBody = await createResponse.json();
        console.log(createBody);
        expect(createBody.responseCode).toBe(201);

        const deleteResponse = await request.delete('/api/deleteAccount', {
            form: { email, password },
        });

        const deleteBody = await deleteResponse.json();
        console.log(deleteBody);
        expect(deleteBody.responseCode).toBe(200);
    });
});
