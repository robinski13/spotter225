import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

import './style.css'


const Navbar = () =>
    <nav className = "header navbar">
    <div className = "news-wrapper">
        <div className="test">
    <ul id = "nav-mobile"  >
    <li>
    <Link to = "/" > Home </Link> 
 </li> 
<li> 
<Link to = "/profile"> Profile </Link> 
</li> 
<li>
<Link to = "/about"> About </Link> 
</li> 
</ul>
</div>
 </div> 
</nav>

// className = "left hide-on-med-and-down side"  nav mobile
// className = "Home list"


export default Navbar;