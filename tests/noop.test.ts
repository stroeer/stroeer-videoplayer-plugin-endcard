import noop from '../src/noop'

it('should return false', () => {
  expect(noop()).toBe(false)
})

it('should be a function', () => {
  expect(typeof noop).toBe('function')
})
