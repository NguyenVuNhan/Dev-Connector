import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import isEmpty from "../../validation/is-empty";
import { createProfile, getCurrentProfile } from "../../actions/profileAction";

import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";

class EditProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filledExistData: false,
			displaySocialInputs: false,
			handle: "",
			company: "",
			website: "",
			location: "",
			status: "",
			skills: "",
			githubUserName: "",
			bio: "",
			twitter: "",
			facebook: "",
			linkedin: "",
			youtube: "",
			instagram: "",
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.props.getCurrentProfile();
	}

	static getDerivedStateFromProps(props, state) {
		let newState = {};
		if (props.errors) {
			newState.errors = props.errors;
		}

		if (!state.filledExistData) {
			if (props.profile) {
				if (props.profile.profile) {
					const profile = props.profile.profile;
					const skillsCSV = profile.skills.join(",");

					profile.company = !isEmpty(profile.company)
						? profile.company
						: "";
					profile.website = !isEmpty(profile.website)
						? profile.website
						: "";
					profile.location = !isEmpty(profile.location)
						? profile.location
						: "";
					profile.githubUserName = !isEmpty(profile.githubUserName)
						? profile.githubUserName
						: "";
					profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
					profile.social = !isEmpty(profile.social)
						? profile.social
						: {};
					profile.twitter = !isEmpty(profile.social.twitter)
						? profile.social.twitter
						: "";
					profile.facebook = !isEmpty(profile.social.facebook)
						? profile.social.facebook
						: "";
					profile.linkedin = !isEmpty(profile.social.linkedin)
						? profile.social.linkedin
						: "";
					profile.youtube = !isEmpty(profile.social.youtube)
						? profile.social.youtube
						: "";
					profile.instagram = !isEmpty(profile.social.instagram)
						? profile.social.instagram
						: "";

					// Set component fields state
					newState.handle = profile.handle;
					newState.company = profile.company;
					newState.website = profile.website;
					newState.location = profile.location;
					newState.status = profile.status;
					newState.skills = skillsCSV;
					newState.githubUserName = profile.githubUserName;
					newState.bio = profile.bio;
					newState.twitter = profile.twitter;
					newState.facebook = profile.facebook;
					newState.linkedin = profile.linkedin;
					newState.youtube = profile.youtube;
					newState.filledExistData = true;
				}
			}
		}

		return isEmpty(newState) ? null : newState;
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();

		const profileData = {
			handle: this.state.handle,
			company: this.state.company,
			website: this.state.website,
			location: this.state.location,
			status: this.state.status,
			skills: this.state.skills,
			githubUserName: this.state.githubUserName,
			bio: this.state.bio,
			twitter: this.state.twitter,
			facebook: this.state.facebook,
			linkedin: this.state.linkedin,
			youtube: this.state.youtube,
			instagram: this.state.instagram
		};

		this.props.createProfile(profileData, this.props.history);
	}

	render() {
		const { errors, displaySocialInputs } = this.state;

		let socialInputs;

		if (displaySocialInputs) {
			socialInputs = (
				<React.Fragment>
					<InputGroup
						placeholder="Twitter Profile URL"
						name="twitter"
						icon="fab fa-twitter"
						value={this.state.twitter}
						onChange={this.onChange}
						error={errors.twitter}
					/>
					<InputGroup
						placeholder="Facebook Page URL"
						name="facebook"
						icon="fab fa-facebook"
						value={this.state.facebook}
						onChange={this.onChange}
						error={errors.facebook}
					/>
					<InputGroup
						placeholder="Linkedin Profile URL"
						name="linkedin"
						icon="fab fa-linkedin"
						value={this.state.linkedin}
						onChange={this.onChange}
						error={errors.linkedin}
					/>
					<InputGroup
						placeholder="YouTube Channel URL"
						name="youtube"
						icon="fab fa-youtube"
						value={this.state.youtube}
						onChange={this.onChange}
						error={errors.youtube}
					/>
					<InputGroup
						placeholder="Instagram Page URL"
						name="instagram"
						icon="fab fa-instagram"
						value={this.state.instagram}
						onChange={this.onChange}
						error={errors.instagram}
					/>
				</React.Fragment>
			);
		}

		const options = [
			{ label: "* Select Professional Status", value: 0 },
			{ label: "Developer", value: "Developer" },
			{ label: "Junior Developer", value: "Junior Developer" },
			{ label: "Senior Developer", value: "Senior Developer" },
			{ label: "Manager", value: "Manager" },
			{ label: "Student or Learning", value: "Student or Learning" },
			{ label: "Instructor", value: "Instructor" },
			{ label: "Intern", value: "Intern" },
			{ label: "Other", value: "Other" }
		];

		return (
			<div className="create-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">
								Go Back
							</Link>
							<h1 className="display-4 text-center">
								Edit Profile
							</h1>
							<small className="d-block pd-3">
								* = required fields
							</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Profile Handle"
									name="handle"
									value={this.state.handle}
									onChange={this.onChange}
									error={errors.handle}
									info="A unique handle for your profile url. Your fullname, company name, nickname"
								/>
								<SelectListGroup
									placeholder="Status"
									name="status"
									value={this.state.status}
									onChange={this.onChange}
									options={options}
									error={errors.status}
									info="Give a idea of where you at in your carea"
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={this.state.company}
									onChange={this.onChange}
									error={errors.company}
									info="Could be your own company or one you work for"
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={this.state.website}
									onChange={this.onChange}
									error={errors.website}
									info="Could be your own website or a company one"
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									onChange={this.onChange}
									error={errors.location}
									info="City or city & state suggested (eg. Boston, MA)"
								/>
								<TextFieldGroup
									placeholder="* Skills"
									name="skills"
									value={this.state.skills}
									onChange={this.onChange}
									error={errors.skills}
									info="Please use comma separated values (eg.
                    HTML,CSS,JavaScript,PHP)"
								/>
								<TextFieldGroup
									placeholder="Github Username"
									name="githubUserName"
									value={this.state.githubUserName}
									onChange={this.onChange}
									error={errors.githubUserName}
									info="If you want your latest repos and a Github link, include your username"
								/>
								<TextAreaFieldGroup
									placeholder="Short Bio"
									name="bio"
									value={this.state.bio}
									onChange={this.onChange}
									error={errors.bio}
									info="Tell us a little about yourself"
								/>
								<div className="mb-3">
									<button
										type="button"
										className="btn btnlight"
										onClick={() =>
											this.setState(prevState => ({
												displaySocialInputs: !prevState.displaySocialInputs
											}))
										}
									>
										Add social network link
									</button>
								</div>
								{socialInputs}
								<input
									type="submit"
									value="Submit"
									className="btn btn-info btn-block mt-4"
								/>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

EditProfile.propTypes = {
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
	withRouter(EditProfile)
);
