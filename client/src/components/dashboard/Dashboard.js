import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Spinner from "../common/Spinner";
import ProfileAction from "./ProfileAction";
import Experience from "./Experience";
import Education from "./Education";
import { getCurrentProfile, deleteAccount } from "../../actions/profileAction";

class Dashboard extends Component {
	constructor(props) {
		super(props);

		this.onDeleteClick = this.onDeleteClick.bind(this);
	}

	componentDidMount() {
		this.props.getCurrentProfile();
	}

	onDeleteClick(e) {
		this.props.deleteAccount();
	}

	render() {
		const { user } = this.props.auth;
		const { profile, loading } = this.props.profile;

		let dashboardContent;

		if (profile === null || loading) {
			dashboardContent = <Spinner />;
		} else {
			if (Object.keys(profile).length > 0) {
				dashboardContent = (
					<div>
						<p className="lead text-muted text-center">
							Welcome{" "}
							<Link to={`/profile/${profile.handle}`}>
								{user.name}
							</Link>
						</p>
						<ProfileAction />
						<Experience experience={profile.experience} />
						<Education education={profile.education} />
						<div style={{ maginBottom: "60px" }}> </div>
						<button
							onClick={this.onDeleteClick}
							className="btn btn-danger"
						>
							Delete my account
						</button>
					</div>
				);
			} else {
				dashboardContent = (
					<div className="d-flex flex-column">
						<p className="lead text-muted text-center">
							Welcome {user.name}
						</p>
						<p className="text-center">
							You have not yet setup a profile, please add some
							info
						</p>
						<div className="w-100 d-flex justify-content-center">
							<Link
								className="btn btn-lg btn-info"
								to="/create-profile"
							>
								Create Profile
							</Link>
						</div>
					</div>
				);
			}
		}

		return (
			<div className="dashboard">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h1 className="display-4">Dashboard</h1>
							{dashboardContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = state => {
	return {
		profile: state.profile,
		auth: state.auth
	};
};

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
	Dashboard
);
