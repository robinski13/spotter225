import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Row, Input, Button} from 'react-materialize';

class Profile extends Component {
	constructor(props) {
	    super(props)

	    this.state = {
	      bench: null,
	      squat: null,
	      military_press: null,
	    }
  	}

  	componentWillReceiveProps(nextProps) {
  		const { database, currentUser } = nextProps
  		const { bench, squat, military_press } = this.state
  		if (!bench && nextProps.database && nextProps.currentUser) {
  			database.ref(`users/${currentUser.uid}/details`).on('value', (snapshot) => {
  				const details = snapshot.val()
  				this.setState({
  					bench: details.bench || 0,
  					squat: details.squat || 0,
  					military_press: details.military_press || 0,
  				})
  			})
  		}
  	}

  	saveInput = () => {
  		const { database, currentUser } = this.props
  		const updateObject = {}
  		Object.keys(this.state).forEach((field) => {
  			updateObject[`users/${currentUser.uid}/details/${field}`] = this.state[field]
  		})
	  	database.ref().update(updateObject);
  	}

  	handleinputchange = (e) => {
  		const id = e.target.id 
  		const value = e.target.value 
  		this.setState({
  			[id]: value
  		})
  	}

  	render() {
  		return (
	  		<Row>
			<Input
				id="bench"
				onChange={this.handleinputchange}
				placeholder="Enter how much you can Bench"
				s={6}
				label=""
				value={this.state.bench}
				type="number"
			/>
			<Input
				id="squat"
				onChange={this.handleinputchange}
				placeholder="Enter how much you can Squat"
				s={6}
				label=""
				value={this.state.squat}
				type="number"
			/>
			<Input
				id="military_press"
				onChange={this.handleinputchange}
				placeholder="Enter how much you can Military Press"
				s={6}
				label=""
				value={this.state.military_press}
				type="number"
			/>
			<Button waves='light' s={6} onClick={this.saveInput}>Save your Work</Button>
			</Row>
		)
  	}

}

export default Profile;