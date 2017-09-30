import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Row, Input, Button} from 'react-materialize';

import './style.css'

class Profile extends Component {
	constructor(props) {
	    super(props)

	    this.state = {
	      bench: 0,
	      squat: 0,
	      military_press: 0,
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
  		Object.keys(this.state).forEach((field) => {
	  		database.ref(`users/${currentUser.uid}/details/${field}`).set(this.state[field])
  		})
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
				placeholder="How much you got weak ass bitch"
				s={6}
				label="Bench"
				value={this.state.bench}
				type="number"
			/>
			<Input
				id="squat"
				onChange={this.handleinputchange}
				placeholder="How much you got weak ass bitch"
				s={6}
				label="Squat"
				value={this.state.squat}
				type="number"
			/>
			<Input
				id="military_press"
				onChange={this.handleinputchange}
				placeholder="How much you got weak ass bitch"
				s={6}
				label="Military Press"
				value={this.state.military_press}
				type="number"
			/>
			<Button waves='light' s={6} onClick={this.saveInput}>Save your Work</Button>
			</Row>
		)
  	}

}

export default Profile;