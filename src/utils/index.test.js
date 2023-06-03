const bcrypt = require('bcryptjs')
const { encryptPassword, comparePassword } = require('./index')

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
}))

describe('encryptPassword', () => {
    it('should return the hashed password', async () => {
        const password = 'password'

        const hashedPassword = await encryptPassword(password)

        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
        expect(hashedPassword).toBe('hashedPassword')
    })

    it('should reject with an error if bcrypt.hash fails', async () => {
        const password = 'password'
        const mockError = new Error('hash error')
        bcrypt.hash.mockRejectedValue(mockError)

        await expect(encryptPassword(password)).rejects.toThrowError(
            'hash error'
        )
    })
})

describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
        const bodyPassword = 'password'
        const modelPassword = 'hashedPassword'

        const result = await comparePassword(bodyPassword, modelPassword)

        expect(bcrypt.compare).toHaveBeenCalledWith(bodyPassword, modelPassword)
        expect(result).toBe(true)
    })

    it('should return false if passwords do not match', async () => {
        const bodyPassword = 'password'
        const modelPassword = 'differentHashedPassword'
        bcrypt.compare.mockResolvedValue(false)

        const result = await comparePassword(bodyPassword, modelPassword)

        expect(bcrypt.compare).toHaveBeenCalledWith(bodyPassword, modelPassword)
        expect(result).toBe(false)
    })

    it('should reject with an error if bcrypt.compare fails', async () => {
        const bodyPassword = 'password'
        const modelPassword = 'hashedPassword'
        const mockError = new Error('compare error')
        bcrypt.compare.mockRejectedValue(mockError)

        await expect(
            comparePassword(bodyPassword, modelPassword)
        ).rejects.toThrowError('compare error')
    })
})
