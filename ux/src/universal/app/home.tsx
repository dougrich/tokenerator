import * as React from 'react';
import { Link } from 'react-router-dom';
import { subscribes, DataBound } from '../state';
import { route } from '../route';
import { dataLoad } from '../data';
import { BrowseList } from '../components';
import { Token } from '@dougrich/tokenerator';

export interface HomeProperties {
    browse: Array<DataBound<Token[]>>;
}

export default 
route({
    path: '/',
    exact: true
},
dataLoad(
async (store, props) => {
    store.dispatch({
        type: "load.browse",
        page: 0
    });
},
subscribes({
    browse: 'browse'
},
class Home extends React.Component<HomeProperties, void> {
    render() {
        if (!this.props.browse) {
            return <div>
                Loading
            </div>;
        } else {
            let set: Token[] = [];
            for (let i = 0; i < this.props.browse.length; i++) {
                if (this.props.browse[i] !== "404:not-found" && this.props.browse[i] !== "500:error") {
                    set = set.concat(this.props.browse[i] as Token[]);
                }
            }
            return <div>
                <BrowseList tokens={set}/>
            </div>;
        }
    }
})));