
import _ from 'lodash';

export let getTabs = _.memoize(function(depth) {
  return _.times(depth, ()=> '  ').join('');
});

export default function convertToFrontEnd(object, namespace, options) {
  options = options || {};
  let output = [options.prefix || ''];
  output.push(`${namespace} = ${convertToFrontEndRaw(object)};\n`);
  output.push(options.suffix || '');
  return output.join('');
};

export function convertToFrontEndRaw(object, depth = 0) {
  let tabs = getTabs(depth);
  let tabs2 = getTabs(depth + 1);
  var output;
  if(_.isFunction(object)) {
    output = object.toString().replace(/\n\s*/mg, '\n' + tabs2);
    let lastNewLine = output.lastIndexOf("\n");
    return output.substring(0, lastNewLine) 
      + output.substring(lastNewLine).replace(/\n\s*/m, "\n" + tabs);
  } else if(_.isArray(object)) {
    output = "[\n";
    let parts = [];
    for(let object_item of object) {
      parts.push(convertToFrontEndRaw(object_item, depth + 1));
    }
    output += tabs2 + parts.join(",\n" + tabs2) + "\n";
    return output + tabs + "]";
  } else if(_.isObject(object)) {
    output = "{\n";
    let parts = [];
    for(let field in object) {
      parts.push(field + ": " + convertToFrontEndRaw(object[field], depth + 1));
    }
    output += tabs2 + parts.join(",\n" + tabs2) + "\n";
    return output + tabs + '}';
  } else if(_.isNumber(object) || _.isBoolean(object)) {
    return '' + object;
  } else if(_.isString(object)) {
    return `'${object.replace('"', '\\"').replace("'", "\\'")}'`;
  } else {
    return 'undefined';
  }
};

