import { getCircleProgress, updateCircleStyle, ticker } from '../src/revolverplay'

test('getCircleProgress should return correct value', function() {
  expect(getCircleProgress(7)).toEqual(179.19839274820703)
  expect(getCircleProgress(6)).toEqual(181.1252571863598)
})

test('updateCircleStyle should set correct style', function() {
  const el = document.createElement('line')
  
  updateCircleStyle(el, 4)
  expect(el.style.strokeDashoffset).toEqual('4')
})

test('ticker should call callback below value 0', function() {
  const el = document.createElement('div')
  const func1 = jest.fn()

  ticker(0, el, func1)
  expect(func1).not.toHaveBeenCalled()

  ticker(-1, el, func1)
  expect(func1).toHaveBeenCalled()
})