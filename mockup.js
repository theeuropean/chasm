var n = null;
var song = nSong()
  
  .part('bass')
    .phrase()
      .notes(3, 'xxxx|----|----|----') // notes == steps('note', )
      .velos(66)
      .duras({ beat: 1/4 })



      .create('note', { value: 69 }, 'xxxx|----|----|----')
      .create('note', { value: '%1', dur: '%2', vel: '%3' }, [ 
        [69, { beat: 1/4 }, 100],
        { beat: 1/4 }
      ])
      .update('note', { vel: 60 }, '*', { vel: null })

      '4 4 -4 4'

      'c#:4 c#:4 c#:4 -:4'

      'c# c# c#', '4 4 4 -4'

      // If string contains spaces, split by space otherwise split chars

      create(eventType, data, pattern, timingPattern)

      update(entityType, data, pattern, timingPattern, filter)

      patt('w w w w', 'C#', 'a64')
      grid('x... x... x... x...', 'C#') xts XTS 

