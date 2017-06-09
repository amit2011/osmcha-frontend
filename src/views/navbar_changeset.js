// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Tags } from '../components/changeset/tags';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { Verify } from '../components/changeset/verify';
import { Dropdown } from '../components/dropdown';
import { OpenIn } from '../components/changeset/open_in';
import {
  handleChangesetModifyTag,
  handleChangesetModifyHarmful
} from '../store/changeset_actions';
import type { RootStateType } from '../store';

class NavbarChangeset extends React.PureComponent {
  props: {
    changesetId: number,
    location: Object,
    currentChangeset: Map<string, *>,
    username: ?string,
    handleChangesetModifyTag: (
      number,
      Map<string, *>,
      number,
      boolean
    ) => mixed,
    handleChangesetModifyHarmful: (
      number,
      Map<string, *>,
      boolean | -1
    ) => mixed
  };
  handleVerify = (arr: Array<Object>) => {
    if (arr.length === 1) {
      this.props.handleChangesetModifyHarmful(
        this.props.changesetId,
        this.props.currentChangeset,
        arr[0].value // whether harmful is true or false
      );
    } else if (arr.length > 1) {
      console.log(arr);
      throw new Error('verify array is big');
    }
  };
  handleVerifyClear = () => {
    this.props.handleChangesetModifyHarmful(
      this.props.changesetId,
      this.props.currentChangeset,
      -1
    );
  };
  render() {
    const width = window.innerWidth;
    return (
      <Navbar
        className="bg-white color-gray border border--gray-light border--1"
        title={
          <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
            <span>
              {width < 800 &&
                <Link
                  to={{ search: this.props.location.search, pathname: '/' }}
                >
                  {'<  '}
                </Link>}
              <span className="txt-l color-gray--dark">
                Changeset:
                {' '}
                <span className="txt-underline">
                  <a
                    href={`https://openstreetmap.org/changeset/${this.props
                      .changesetId}`}
                    target="_blank"
                  >
                    {this.props.changesetId}
                  </a>
                </span>
              </span>
              <OpenIn
                changesetId={this.props.changesetId}
                coordinates={
                  this.props.currentChangeset &&
                  this.props.currentChangeset.getIn([
                    'geometry',
                    'coordinates',
                    0,
                    0
                  ])
                }
              />
            </span>
            <span>

              {this.props.currentChangeset &&
                <span>
                  <Tags
                    changesetId={this.props.changesetId}
                    currentChangeset={this.props.currentChangeset}
                    disabled={false}
                    handleChangesetModifyTag={
                      this.props.handleChangesetModifyTag
                    }
                  />
                  <Verify
                    changeset={this.props.currentChangeset}
                    placeholder="Verify"
                    value={[]}
                    onChange={this.handleVerify}
                    onClear={this.handleVerifyClear}
                    username={this.props.username}
                    checkUser={this.props.currentChangeset.getIn([
                      'properties',
                      'check_user'
                    ])}
                    options={[
                      {
                        value: false,
                        label: 'Good'
                      },
                      {
                        value: true,
                        label: 'Bad'
                      }
                    ]}
                    className="select--s"
                  />
                </span>}
            </span>
          </div>
        }
      />
    );
  }
}

NavbarChangeset = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    changesetId: parseInt(state.changeset.get('changesetId'), 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(state.changeset.get('changesetId'), 10)
    ]),
    username: state.auth.getIn(['userDetails', 'username'])
  }),
  { handleChangesetModifyTag, handleChangesetModifyHarmful }
)(NavbarChangeset);

export { NavbarChangeset };