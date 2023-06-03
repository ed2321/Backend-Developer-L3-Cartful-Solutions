const usersModel = require('../database/models/users')
const usersRepo = require('./users')

jest.mock('../database/models/users', () => ({
    scan: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    exec: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
}))

describe('getUser', () => {
    const email = 'test@example.com'
    const mockUser = {
        email,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should throw an error if no email is provided', async () => {
        await expect(usersRepo.getUser()).rejects.toThrow(
            'Missing email to check in the database'
        )
    })

    it('should return the user if found in the database', async () => {
        usersModel.exec.mockResolvedValue([mockUser])

        const result = await usersRepo.getUser(email)

        expect(usersModel.scan).toHaveBeenCalledWith('email')
        expect(usersModel.contains).toHaveBeenCalledWith(email)
        expect(usersModel.exec).toHaveBeenCalled()
        expect(result).toEqual(mockUser)
    })
})

describe('postUser', () => {
    const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should throw an error if no request object is provided', async () => {
        await expect(usersRepo.postUser()).rejects.toThrow(
            'Missing request object while creating in DB'
        )
    })

    it('should create a new user in the database', async () => {
        usersModel.create.mockResolvedValue(mockUser)

        const result = await usersRepo.postUser(mockUser)

        expect(usersModel.create).toHaveBeenCalledWith(mockUser)
        expect(result).toEqual(mockUser)
    })
})
