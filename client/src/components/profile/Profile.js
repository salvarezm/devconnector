import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import { getProfileById } from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub.js';


export const Profile = ({ match, getProfileById, profile: { profile, loading, user }, auth }) => {
    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById, match]);
    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> :
                <Fragment>
                    <Link to='/profiles' className='btn btn-light'>Back to profiles</Link>
                    {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&
                        <Link className='btn btn-dark'>Edit Profile</Link>
                    }
                    <div className='profile-grid my-1'>
                        <ProfileTop profile={profile} />
                        <ProfileAbout profile={profile} />
                        <div class="profile-exp bg-white p-2">
                            <h2 class="text-primary">Experience</h2>
                            {
                                profile.experience.length > 0 ?
                                    (
                                        <Fragment>
                                            {
                                                profile.experience.map((experience) => (
                                                    <ProfileExperience key={experience._id} experience={experience} />
                                                ))
                                            }
                                        </Fragment>
                                    ) : (<h4>No experience credentials</h4>)
                            }
                        </div>
                        <div class="profile-edu bg-white p-2">
                            <h2 class="text-primary">Education</h2>
                            {
                                profile.education.length > 0 ?
                                    (
                                        <Fragment>
                                            {
                                                profile.education.map((education) => (
                                                    <ProfileEducation key={education._id} education={education} />
                                                ))
                                            }
                                        </Fragment>
                                    ) : (<h4>No education credentials</h4>)
                            }
                        </div>
                    </div>

                    {
                        profile.githubusername && (
                           <ProfileGithub username={profile.githubusername} /> 
                        )
                    }
                </Fragment>
            }
        </Fragment >
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
})

const mapDispatchToProps = {
    getProfileById,
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
