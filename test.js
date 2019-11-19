import chai from 'chai'
import dirtyChai from 'dirty-chai'
import heke from './index'
import handlebars from 'handlebars'

heke()
const { expect } = chai

chai.use(dirtyChai)

describe('Heke', () => {
  describe('sum', () => {
    it('Correctly adds all items', async () => {
      const template = handlebars.compile('{{sum test1 2 3 4 5}}')
      const result = template({
        test1: 1
      })

      expect(result).to.equal('15')
    })

    it('Deals with non numbers', async () => {
      const template = handlebars.compile('{{sum test1 test2 test3 test4 test5 test6 2 3 4 5}}')
      const result = template({
        test1: '1',
        test2: NaN,
        test3: {},
        test4: [],
        test5: undefined,
        test6: null
      })

      expect(result).to.equal('15')
    })
  })
})
