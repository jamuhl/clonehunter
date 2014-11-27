var expect = require('expect.js')
var CloneHunter = require('../lib/cloneHunter');



describe('cloneHunter - try out against contacts', function() {

  // the hunter
  var hunter = new CloneHunter({
    fields: [
      'firstname',
      'lastname',
      'gender',
      'birthdate'
    ],
    arrays: [
      { path: 'emails', fields: ['email'] }
    ],
    round: true
  });

  it('try out 1) equal name only', function() {

    var a = {
      firstname: 'user',
      lastname: 'a'
    };

    var b = {
      firstname: 'user',
      lastname: 'a'
    };

    var result = hunter.is(a).a.clone.of(b);
    //console.log(result);

    expect(result.score).to.be(1);
    expect(result.fieldResult.found.length).to.be(2);
    expect(result.arrayResult.found.length).to.be(0);

  });

  
  it('try out 2) equal name, email', function() {

    var a = {
      firstname: 'user',
      lastname: 'a',
      emails: [{email: 'a@kc.com'}]
    };

    var b = {
      firstname: 'user',
      lastname: 'a',
      emails: [{email: 'a@kc.com'}]
    };

    var result = hunter.is(a).a.clone.of(b);
    //console.log(result);

    expect(result.score).to.be(1);
    expect(result.fieldResult.found.length).to.be(2);
    expect(result.arrayResult.found.length).to.be(1);

  });

  it('try out 3) not equal firstname', function() {

    var a = {
      firstname: 'user',
      lastname: 'a',
      emails: [{email: 'a@kc.com'}]
    };

    var b = {
      firstname: 'user_not',
      lastname: 'a',
      emails: [{email: 'a@kc.com'}]
    };

    var result = hunter.is(a).a.clone.of(b);
    //console.log(result);

    expect(result.score).to.be(0.67);
    expect(result.fieldResult.found.length).to.be(1);
    expect(result.fieldResult.notFound.length).to.be(1);
    expect(result.arrayResult.found.length).to.be(1);

  });


});


