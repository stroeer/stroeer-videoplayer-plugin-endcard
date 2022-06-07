import { noop, noopData } from '../src/noop'

describe('the noop function', () => {
  it('should return false', () => {
    expect(noop()).toBe(false)
  })

  it('should be a function', () => {
    expect(typeof noop).toBe('function')
  })
})

describe('the noopData function', () => {
  it('should return the input it got', () => {
    const data = [1, 2, 3]
    // Argument and result are the same reference
    expect(noopData(data)).toBe(data)
  })
})
