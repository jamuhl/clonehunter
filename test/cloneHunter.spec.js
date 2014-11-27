var expect = require('expect.js')
var CloneHunter = require('../lib/cloneHunter');

describe('cloneHunter - compares to objects for being possible clones', function() {

  describe('instantiation of a hunter', function() {

    var hunter = new CloneHunter({
      fields: [],
      arrays: []
    });

    it ('it should have options', function() {
      expect(hunter.options).to.be.ok();
    });

    it ('it should have a function is', function() {
      expect(hunter.is).to.be.a('function');
    })

  });

  describe('comparing fields', function() {

    var hunter = new CloneHunter({
      fields: ['name', 'something.nested']
    });

    it('it should return a score of 1 if both are same', function() {

      var result = hunter.is({
        name: 'cloned',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored'
      }).a.clone.of({
        name: 'cloned',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored different'
      });

      expect(result.score).to.be(1);
      expect(result.fieldResult.found).to.eql([ 'name', 'something.nested' ]);

    });

    it('it should return a score of 0.5 if both are 50% the same', function() {

      var result = hunter.is({
        name: 'cloned',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored'
      }).a.clone.of({
        name: 'cloned',
        something: {
          nested: 'nested different'
        },
        ignored: 'ignored different'
      });

      expect(result.score).to.be(0.5);
      expect(result.fieldResult.found).to.eql([ 'name' ]);
      expect(result.fieldResult.notFound).to.eql([ 'something.nested' ]);

    });

  });

  describe('comparing fields - extended', function() {

    var hunter = new CloneHunter({
      fields: ['name, something.nested'],
      ignoreCase: true
    });

    it('it should support combined fields a)', function() {

      var result = hunter.is({
        name: 'cloned',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored'
      }).a.clone.of({
        name: 'cloned',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored different'
      });

      expect(result.score).to.be(1);
      expect(result.fieldResult.found).to.eql([ 'name, something.nested' ]);

    });

    it('it should support combined fields b)', function() {

      var result = hunter.is({
        name: 'cloned',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored'
      }).a.clone.of({
        name: 'cloned',
        something: {
          nested: 'nested different'
        },
        ignored: 'ignored different'
      });

      expect(result.score).to.be(0);
      expect(result.fieldResult.notFound).to.eql([ 'name, something.nested' ]);

    });

    it('it should support ignore case', function() {

      var result = hunter.is({
        name: 'cloned',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored'
      }).a.clone.of({
        name: 'CLONED',
        something: {
          nested: 'nested'
        },
        ignored: 'ignored different'
      });

      expect(result.score).to.be(1);
      expect(result.fieldResult.found).to.eql([ 'name, something.nested' ]);

    });

  });

  describe('comparing arrays', function() {

    var hunter = new CloneHunter({
      arrays: ['name', {path: 'something.nested', fields: ['a', 'b'] }]
    });

    it('it should return a score of 1 if all of clone is in parent', function() {

      var result = hunter.is({
        name: ['cloned', 'i', 'am'],
        something: {
          nested: [{a: 'a', b: 'b', c: 'c'}, {a: 'a1', b: 'b1', c: 'c1'}]
        },
        ignored: 'ignored'
      }).a.clone.of({
        name: ['cloned', 'i', 'am', 'not'],
        something: {
          nested: [{a: 'a1', b: 'b1', c: 'c2'}, {a: 'a', b: 'b', c: 'c1'}, {a: 'a3', b: 'b3', c: 'c3'}]
        },
        ignored: 'ignored different'
      });

      expect(result.score).to.be(1);
      expect(result.arrayResult.found).to.eql([
        'name[0]',
        'name[1]',
        'name[2]',
        'something.nested[0]',
        'something.nested[1]']);

    });

    it('it should return a score of 0.5 if 50% of clone is in parent', function() {

      var result = hunter.is({
        name: ['cloned', 'am_not'],
        something: {
          nested: [{a: 'a_not', b: 'b', c: 'c'}, {a: 'a1', b: 'b1', c: 'c1'}]
        },
        ignored: 'ignored'
      }).a.clone.of({
        name: ['cloned', 'i', 'am', 'not'],
        something: {
          nested: [{a: 'a1', b: 'b1', c: 'c2'}, {a: 'a', b: 'b', c: 'c1'}, {a: 'a3', b: 'b3', c: 'c3'}]
        },
        ignored: 'ignored different'
      });

      expect(result.score).to.be(0.5);
      expect(result.arrayResult.found).to.eql([
        'name[0]',
        'something.nested[1]']);
      expect(result.arrayResult.notFound).to.eql([
        'name[1]',
        'something.nested[0]']);

    });


  });


});


