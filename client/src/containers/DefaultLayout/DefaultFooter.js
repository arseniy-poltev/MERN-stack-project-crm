import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span><a href="https://www.analightgroup.com/solutions/cocoa">Cocoa Home Care Management Suite</a> &copy; 2018 Analight Group.</span>
        {/* <span className="ml-auto">Powered by <a href="https://coreui.io/react">CoreUI for React</a></span> */}
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
