import React from 'react';
import { Route, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function privateRoute({ component: Component, auth: { isAuthenticated, loading }, ...rest }) {
    return (
        <Route {...rest} render={props =>
            !isAuthenticated && !loading ?
                (<Redirect to='/login' />) :
                (<Component {...props} />)
        }
        />
    )
}

privateRoute.propTypes = {
    auth: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(privateRoute)

