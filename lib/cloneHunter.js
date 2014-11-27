var _ = require('lodash')
  , dotty = require('dotty');


var CloneHunter = function(options) {
  this.options = options;
};

CloneHunter.prototype = {

  is: function(right) {
    var self = this;

    this.right = right;

    return {

      a: { clone: { 
        of: function(left) {
          self.left = left;
          return self.compare(self.right, self.left);
        }
      }}

    }

  },

  compare: function(a, b) {
    var self = this;

    // check fields
    var fieldResult = this._equalFields(this.options.fields || [], a, b);

    // check arrays
    var arrayResult = this._equalsInArray(this.options.arrays, a, b);

    // summing up
    var members = arrayResult.itemsTotal + fieldResult.found.length + fieldResult.notFound.length;
    var equals = arrayResult.found.length + fieldResult.found.length;

    // not primaries
    var secondaryFieldResult, secondaryArrayResult;
    if (this.options.secondaryFields && equals > 0) {
      secondaryFieldResult = this._equalFields(this.options.secondaryFields || [], a, b);
    }
    if (this.options.secondaryArrays && equals > 0) {
      secondaryArrayResult = this._equalsInArray(this.options.secondaryArrays, a, b);
    }

    if (secondaryFieldResult) {
      members = members + secondaryFieldResult.found.length + secondaryFieldResult.notFound.length;
      equals = equals + secondaryFieldResult.found.length;
    }
    if (secondaryArrayResult) {
      members = members + secondaryArrayResult.itemsTotal;
      equals = equals + secondaryArrayResult.found.length
    }


    return {
      score: this.options.round ? Math.round((equals / members) * 100) / 100 : equals / members,
      fieldResult: fieldResult,
      arrayResult: arrayResult,
      left: a,
      right: b
    }

  },

  _equalFields: function(fields, a, b) {
    var self = this;

    return _.chain(fields)
      .map(function(field) {
        var parts, equal;

        field.indexOf(',') > -1 ? parts = field.split(',') : parts = [field];

        for (var i in parts) {
          var f = parts[i].trim();
          var f_a = dotty.get(a, f);
          var f_b = dotty.get(b, f);

          if (f_a && equal !== false) {
            equal = typeof f_a === typeof f_b

            if (equal && self.options.ignoreCase && typeof(f_a) === 'string') {
              equal = f_a.toLowerCase() === f_b.toLowerCase();
            } else {
              equal = f_a === f_b;
            }
            
          }
        }


        return {
          field: field,
          equal: equal
        }
      })
      .reduce(function(memo, res) {
        if (res.equal === true) {
          memo.found.push(res.field);
        } else if (res.equal === false) {
          memo.notFound.push(res.field);
        }
        return memo;
      }, { found: [], notFound: []})
      .value();
  },

  _equalsInArray: function(arrays, a, b) {
    var self = this;

    var itemsInArray = 0;
    var arrayResult = _.chain(arrays)
      .map(function (array) {
        var path = typeof array === 'string' ? array : array.path;

        var f_a = dotty.get(a, path);
        var f_b = dotty.get(b, path);

        if (_.isArray(f_a)) itemsInArray = itemsInArray + f_a.length;

        var result = {
          found: [],
          notFound: []
        };

        if (!_.isArray(f_a) || !_.isArray(f_b)) return result;

        _.each(f_a, function(here, i) {
          var found = _.find(f_b, function(there) {
            if (!array.fields) return there === here;

            var e = self._equalFields(array.fields, here, there);
            return e.found.length === array.fields.length;
          });

          if (found) {
            result.found.push(path + '[' + i + ']');
          } else {
            result.notFound.push(path + '[' + i + ']');
          }
        })

        return result;
      })
      .reduce(function(memo, result) {
        return {
          found: memo.found.concat(result.found),
          notFound: memo.notFound.concat(result.notFound)
        }
      }, { found: [], notFound: []})
      .value();

    arrayResult.itemsTotal = itemsInArray;
    return arrayResult;
  }

};

module.exports = CloneHunter;