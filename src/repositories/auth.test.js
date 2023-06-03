const authModel = require('../database/models/auth')
const authRepo = require('./auth')

jest.mock('../database/models/auth', () => ({
    scan: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    exec: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
}))

describe('getLogout', () => {
    const token = 'test-token'
    const mockLogout = { token, userId: '12345' }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should throw an error if no token is provided', async () => {
        await expect(authRepo.getLogout()).rejects.toThrow(
            'Missing email to check in the database'
        )
    })

    it('should return the logout entry if found in the database', async () => {
        authModel.exec.mockResolvedValue([mockLogout])

        const result = await authRepo.getLogout(token)

        expect(authModel.scan).toHaveBeenCalledWith('token')
        expect(authModel.contains).toHaveBeenCalledWith(token)
        expect(authModel.exec).toHaveBeenCalled()
        expect(result).toEqual(mockLogout)
    })
})

describe('postLogout', () => {
    const mockLogout = { token: 'test-token', userId: '12345' }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should throw an error if no request object is provided', async () => {
        await expect(authRepo.postLogout()).rejects.toThrow(
            'Missing request object while creating in DB'
        )
    })

    it('should create a new logout entry in the database', async () => {
        authModel.create.mockResolvedValue(mockLogout)

        const result = await authRepo.postLogout(mockLogout)

        expect(authModel.create).toHaveBeenCalledWith(mockLogout)
        expect(result).toEqual(mockLogout)
    })
})
