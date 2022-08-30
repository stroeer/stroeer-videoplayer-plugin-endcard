import { ticker } from '../src/revolverplay'

test('ticker should work correctly', () => {
  const line = document.createElement('line')

  ticker(7, 2, line)
  expect(line.style.strokeDashoffset).toEqual('55.053269661507535')

  ticker(5, -1, line)
  expect(line.style.strokeDashoffset).toEqual('-38.53728876305527')
})
