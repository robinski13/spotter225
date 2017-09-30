import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

import './style.css'


const Navbar = () =>
    <
    nav className = "header navbar" >
    <
    div className = "news-wrapper" >
    <
    ul id = "nav-mobile"
className = "left hide-on-med-and-down" >
    <
    li className = "Home" >
    <
    Link to = "/" > Front Page < /Link> <
    /li> <
    li >
    <
    Link to = "/profile" > Profile < /Link> <
    /li> <
    li >
    <
    Link to = "/about" > About < /Link> <
    /li> <
    /ul>

<
/div> <
/nav>

export default Navbar;