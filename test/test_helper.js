require('babel/polyfill')
const chai = require('chai')
chai.should()
chai.use(require('sinon-chai'))

const ONE_PART_SCRIPT = {
  parts: [
    {
      name: 'part0',
      phrases: [
        {
          evs: [
            // x--- x--- x--- ---x
            { pos: 0,    type: 'note', data: { pitch: 1 } },
            { pos: 1,    type: 'note', data: { pitch: 1 } },
            { pos: 2,    type: 'note', data: { pitch: 1 } },
            { pos: 3.75, type: 'note', data: { pitch: 1 } }
          ]
        }
      ],
      dest: { argNames: ['pitch'] },
      fns: []
    }
  ]
}

const TWO_PART_TWO_SECTION_SCRIPT = {
  parts: [
    ONE_PART_SCRIPT.parts[0],
    {
      name: 'part1',
      phrases: [
        {
          evs: [
            // x--- x--- x--- ---x
            { pos: 0,    type: 'note', data: { pitch: 2 } },
            { pos: 1,    type: 'note', data: { pitch: 2 } },
            { pos: 2,    type: 'note', data: { pitch: 2 } },
            { pos: 3.75, type: 'note', data: { pitch: 2 } }
          ]
        }
      ],
      dest: { argNames: ['pitch'] },
      fns: []
    }
  ],
  sections: [
    { name: 'section0', strains:[ { partName: 'part0' } ]},
    { name: 'section1', strains:[ { partName: 'part1' } ]}
  ]
}

module.exports = {
  ONE_PART_SCRIPT,
  TWO_PART_TWO_SECTION_SCRIPT
}