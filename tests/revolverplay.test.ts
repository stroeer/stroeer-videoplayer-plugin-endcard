import { ticker } from '../src/revolverplay'

test('ticker should work correctly', function() {
  const line = document.createElement('line')
  const func1 = jest.fn()

  ticker(7, 2, line, func1)
  expect(line.style.strokeDashoffset).toEqual('55.053269661507535')
  expect(func1).not.toHaveBeenCalled()

  ticker(5, -1, line, func1)
  expect(line.style.strokeDashoffset).toEqual('-38.53728876305527')
  expect(func1).toHaveBeenCalled()
})