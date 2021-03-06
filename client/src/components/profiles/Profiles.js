import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/spinner';
import { connect } from 'react-redux'
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';

export const Profiles = ({ getProfiles, profile: { profiles, loading} }) => {
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);
    
    return <Fragment>
        {
            loading ? <Spinner /> : <Fragment>
                <h1 className='large text-primary'>Developers</h1>
                <p className='lead'>
                    <i className='fab fa-connectdevelop'></i> Browse and connect with developers
                </p>
                <div className='profiles'>
                    {
                        Profiles.length > 0 ? (
                            profiles.map(profile => (
                                <ProfileItem key={profile._id} profile={profile} />
                            ))
                        ) : <h4>No profiles found...</h4>
                    }
                </div>
            </Fragment>
        }
    </Fragment>;
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    profile: state.profile,
})

const mapDispatchToProps = {
    getProfiles,
}

export default connect(mapStateToProps, mapDispatchToProps)(Profiles)
