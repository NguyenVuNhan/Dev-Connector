import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileGithub from "./ProfileGithub";
import ProfileHeader from "./ProfileHeader";
import Spinner from "../common/Spinner";
import { getProfileByHandle } from "../../actions/profileAction";

class Profile extends Component {
	componentDidMount() {
		if (this.props.match.params.handle) {
			this.props.getProfileByHandle(this.props.match.params.handle);
		}
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.profile.profile === null && this.props.profile.loading) {
	// 		this.props.history.push("/errors/not-found");
	// 	}
	// }

	render() {
		const { profile, loading } = this.props.profile;

		if (this.props.profile.profile === null && this.props.profile.loading) {
			return <Redirect to={"/errors/not-found"} />;
		}

		let profileContent;

		if (profile === null || loading) {
			profileContent = <Spinner />;
		} else {
			profileContent = (
				<div>
					<div className="row">
						<div className="col-md-6">
							<Link
								className="btn btn-light mb-3 float-left"
								to="/profiles"
							>
								Back to Profiles
							</Link>
						</div>
					</div>
					<ProfileHeader profile={profile} />
					<ProfileAbout profile={profile} />
					<ProfileCreds
						education={profile.education}
						experience={profile.experience}
					/>
					{profile.githubUserName ? (
						<ProfileGithub username={profile.githubUserName} />
					) : null}
				</div>
			);
		}

		return (
			<div className="profile">
				<div className="container">
					<div className="row">
						<div className="col-md-12">{profileContent}</div>
					</div>
				</div>
			</div>
		);
	}
}

Profile.propTypes = {
	profile: PropTypes.object.isRequired,
	getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);
