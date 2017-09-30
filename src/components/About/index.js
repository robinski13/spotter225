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