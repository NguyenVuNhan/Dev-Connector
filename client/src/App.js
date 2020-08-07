import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import store from "./store";
import { setCurrentUser, logoutUser } from "./actions/authAction";
import { clearCurrentProfile } from "./actions/profileAction";
import setAuthToken from "./utils/setAuthToken";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import NotFound from "./components/errors/NotFound";
import Post from "./components/post/Post";
import Posts from "./components/posts/Posts";

import "./App.css";

if (localStorage.jwtToken) {
	setAuthToken(localStorage.jwtToken);
	const decoded = jwt_decode(localStorage.jwtToken);
	store.dispatch(setCurrentUser(decoded));

	const currentTime = Date.now() / 1000;
	if (currentTime > decoded.exp) {
		store.dispatch(logoutUser());
		store.dispatch(clearCurrentProfile());

		window.location.href = "/login";
	}
}

function App() {
	return (
		<Provider store={store}>
			<Router>
				<div className="App">
					<Navbar />
					<Route exact path="/" component={Landing} />
					<div className="container">
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/profiles" component={Profiles} />
						<Route
							exact
							path="/errors/not-found"
							component={NotFound}
						/>
						<Route
							exact
							path="/profile/:handle"
							component={Profile}
						/>
						<Switch>
							<PrivateRoute
								exact
								path="/dashboard"
								component={Dashboard}
							/>
						</Switch>
						<Switch>
							<PrivateRoute
								exact
								path="/create-profile"
								component={CreateProfile}
							/>
						</Switch>
						<Switch>
							<PrivateRoute
								exact
								path="/edit-profile"
								component={EditProfile}
							/>
						</Switch>
						<Switch>
							<PrivateRoute
								exact
								path="/add-experience"
								component={AddExperience}
							/>
						</Switch>
						<Switch>
							<PrivateRoute
								exact
								path="/add-education"
								component={AddEducation}
							/>
						</Switch>
						<Switch>
							<PrivateRoute
								exact
								path="/post/:id"
								component={Post}
							/>
						</Switch>
						<Switch>
							<PrivateRoute
								exact
								path="/feed"
								component={Posts}
							/>
						</Switch>
					</div>
					<Footer />
				</div>
			</Router>
		</Provider>
	);
}

export default App;
