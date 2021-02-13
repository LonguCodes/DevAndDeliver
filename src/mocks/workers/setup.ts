import { server } from './omdb'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())