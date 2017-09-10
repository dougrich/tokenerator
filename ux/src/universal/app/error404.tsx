import * as React from 'react';
import { route } from '../route';
import { Page } from '../components';

export default 
route({}, 
class Error404 extends React.Component<any, void> {
    render() {
        return <Page statusCode={404}>
            <div className="transition-item">404!</div>
        </Page>;
    }
});