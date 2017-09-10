const fs = require('fs');
const path = require('path');

function pascalCase(snakeCase) {
  snakeCase = snakeCase[0].toUpperCase() + snakeCase.substr(1);
  for (let i = 1; i < snakeCase.length; i++) {
    if (snakeCase[i] === '-') {
      snakeCase = snakeCase.substr(0, i) + snakeCase[i + 1].toUpperCase() + snakeCase.substr(i+2);
    }
  }
  return snakeCase;
}

fs.readdir(__dirname, function (err, files) {
  console.log('FILES FOUND: ' + files.length);
  files.forEach(filename => {
    if (filename[0] === '_') return;

    console.log('PROCESSING: ' + filename);
    const name = filename.replace('.svg', '');
    let markup = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    markup = markup.replace(
`<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by IcoMoon.io -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 20 20">`, '');
    markup = markup.replace(`</svg>`, '');
    while (markup.indexOf('fill="#000000"') >= 0) {
      markup = markup.replace('fill="#000000"', 'fill="inherit"');
    }
    fs.writeFileSync(name + '.tsx',
`/** Generated from the icomoon fonts generated for linearicons on 9/9/2017 */
import * as React from 'react';
import { BaseIcon, BaseIconProperties } from '../base-icon';
import { IconSheet } from '../sheet';

export class ${pascalCase(name)} extends React.PureComponent<BaseIconProperties, {}> {
  render() {
    return (
      <BaseIcon iconId="lnr-${name}" {...this.props}/>
    );
  }
}

IconSheet.Parts["${name}"] = class Markup extends React.PureComponent<{}, {}> {
  render() {
    return (
      <g id="lnr-${name}">
        ${markup}
      </g>
    );
  }
}
`
)
  });
});