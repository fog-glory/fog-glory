const schema = ({ entry } = {}) => ({
  $schema: 'http://json-schema.org/draft-04/schema#',
  additionalProperties: false,
  type: 'object',
  properties: {
    minimize: {
      type: 'boolean'
    },
    moduleExtensions: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    paths: parsePaths(entry),
    purifyOptions: {
      type: 'object',
      properties: {}
    },
    verbose: {
      type: 'boolean'
    }
  },
  required: [
    'paths'
  ]
});

function parsePaths(entry) {
  const ret = {
    type: ['array', 'object']
  };

  if (entry instanceof Object) {
    ret.additionalProperties = false;
    ret.properties = generateProperties(entry);
  } else {
    ret.items = {
      type: 'string'
    };
  }

  return ret;
}

function generateProperties(entry) {
  const ret = {};

  Object.keys(entry).forEach((e) => {
    ret[e] = {
      type: ['array', 'string'],
      items: {
        type: 'string'
      }
    };
  });

  return ret;
}

export default schema;
