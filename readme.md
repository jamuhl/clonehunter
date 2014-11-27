## enables to compare two objects

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
      ]
    });


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

    // score: how equal
    // fieldResult: all tested fields sorted in found or notFound with info about equal or not
    // arrayResult: same as fieldResult
    // left: a,
    // right: b
    var result = hunter.is(a).a.clone.of(b);


## more options

    var hunter = new CloneHunter({
      fields: [
        'firstname, lastname' // separated fields will be checked in combination
      ],
      // will be summed up to score if fields are equal
      secondaryFields: [
        'gender',
        'birthdate'
      ],
      arrays: [
        { path: 'emails', fields: ['email'] },
        { path: 'networks', fields: ['url'] },
      ],
      // will be summed up to score if arrays are equal
      secondaryArrays: [
        { path: 'phones', fields: ['nr'] },
        { path: 'addresses', fields: ['address'] }
      ],
      // round score
      round: true,
      // ignore case
      ignoreCase: true
    });