require('babel/polyfill')
const chai = require('chai')
chai.should()
chai.use(require('sinon-chai'))

const N1 = { type: 'note', data: { pitch: 1 } }
const N2 = { type: 'note', data: { pitch: 2 } }

const ONE_PART_SCRIPT = {
  parts: [
    {
      name: 'part0',
      phrases: [
        {
          occs: [
            // x--- x--- x--- ---x
            { pos: 0, ev: N1 },
            { pos: 1, ev: N1 },
            { pos: 2, ev: N1 },
            { pos: 3.75, ev: N1 }
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
          occs: [
            // x--- x--- x--- ---x
            { pos: 0, ev: N2 },
            { pos: 1, ev: N2 },
            { pos: 2, ev: N2 },
            { pos: 3.75, ev: N2 }
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
  N1,
  N2,
  ONE_PART_SCRIPT,
  TWO_PART_TWO_SECTION_SCRIPT
}