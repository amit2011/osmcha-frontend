// @flow
import React from 'react';
import {Link} from 'react-router-dom';

class ListItem extends React.PureComponent {
  render() {
    return (
      <Link
        className={`flex-child ${this.props.active ? 'color-red' : ''}`}
        to={`/changesets/${this.props.id}`}
      >
        {this.props.id}
      </Link>
    );
  }
}
export class List extends React.PureComponent {
  props: {
    changesets: Array<Object>,
    fetchChangeset: (number) => any,
    activeChangesetId: ?number,
  };
  render() {
    console.log('here');
    return (
      <div className="flex-parent flex-parent--column">
        {this.props.changesets.map((f, k) => (
          <ListItem
            key={k}
            id={f.id}
            active={f.id === this.props.activeChangesetId}
            fetchChangeset={this.props.fetchChangeset}
          />
        ))}
      </div>
    );
  }
}