import * as React from 'react';

export class IconSheet extends React.PureComponent<{}, {}> {

  public static Parts: { [key: string]: React.ComponentClass<any> } = {};

  render() {
    const keys = Object.keys(IconSheet.Parts);
    return (
      <svg style={{ position: 'absolute', top: '0', left: '0', width: '0', height: '0', opacity: 0}}>
        {keys.map(key => {
          const PartClass = IconSheet.Parts[key];
          return (
            <PartClass key={key}/>
          );
        })}
      </svg>
    );
  }
}