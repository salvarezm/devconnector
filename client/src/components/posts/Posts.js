import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import { getPosts } from '../../actions/post';
import PostItem from './PostItem.js';
import PostForm from './PostForm';


export const Posts = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);
    return (
        loading ? <Spinner /> : <Fragment>
            <h1 class="large text-primary">
                Posts
            </h1>
            <p class="lead"><i class="fas fa-user"></i> Welcome to the community!</p>
            <PostForm />
            <div class="posts">
                {
                    posts.map(post => (
                        <PostItem key={post._id} post={post} />
                    ))
                }
            </div>
        </Fragment>
    )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    post: state.post,
})

const mapDispatchToProps = {
    getPosts,
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)
