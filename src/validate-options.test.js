const assert = require('assert');
const validateOptions = require('./validate-options').default;
const schema = require('./schema').default;

describe('Validate options', function () {
  it('fails without a schema and data', function () {
    assert.throws(
      () => {
        validateOptions();
      },
      Error
    );
  });

  it('fails with empty data', function () {
    const result = validateOptions(schema());

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('does not fail if paths are provided', function () {
    const result = validateOptions(schema(), { paths: ['./foo'] });

    assert.ok(result.isValid);
    assert.ok(!result.error);
  });

  it('does not allow arbitrary properties', function () {
    const result = validateOptions(schema(), { paths: ['./foo'], foobar: ['./foo'] });

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('fails without matching path keys', function () {
    const data = {
      paths: {
        a: './foo'
      }
    };

    const result = validateOptions(schema({
      entry: {
        b: './bar'
      }
    }), data);

    assert.ok(result.error);
  });
});
