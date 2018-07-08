export const mockAuthorize = jest.fn()
export const mockParseHash = jest.fn()

export default {
  WebAuth: jest.fn().mockImplementation(() => ({
    authorize: mockAuthorize,
    parseHash: mockParseHash
  }))
}
