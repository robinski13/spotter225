import React, { Component } from 'react';
import './App.css';
import * as storage from './utils/storage'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Profile from './components/profile'
import Navbar from './components/Navbar'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firebase: null,
      database: null,
      message: '',
      messages: [],
      currentUser: null,
      accessToken: '',
      chat: null
    }
  }

  componentDidMount() {
    this.initFirebase()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.database && !prevState.database) {
      this.state.database.ref('/').on('child_added', (snapshot) => {
        const msg = snapshot.val();
        const key = snapshot.key;
        msg.key = key;
        this.setState({
          messages: [...this.state.messages, msg]
        })
      });
      this.state.database.ref('/').on('child_removed', (snapshot) => {
        const key = snapshot.key;
        this.setState({
          messages: this.state.messages.filter(message => message.key !== key)
        })
      });
    }
  }

  initFirebase = () => {
    var config = {
      apiKey: 'AIzaSyB1XsfIxipARd00gi_H_lz6I7bk7kWu480',
      authDomain: 'coding-bootcamp-1d008.firebaseapp.com',
      databaseURL: 'https://coding-bootcamp-1d008.firebaseio.com',
      storageBucket: 'gs://coding-bootcamp-1d008.appspot.com/',
    };
    const firebase = window.firebase.initializeApp(config)
    const provider = new window.firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth()
    const database = firebase.database()

    // handles page load authentication if already logged in
    auth.onAuthStateChanged((user) => {
      if (user) {

        this.setState({ currentUser: this.mapUser(user) })

        // add user to firebase db
        this.getUsersFromFirebase(database)

        database
          .ref(`users/${user.uid}`)
          .update(this.mapUser(user))
          .catch((err) => console.log(err)) // eslint-disable-line no-console
      }
    });

    // initialize the state
    this.setState({
      database,
      firebase,
      provider,
      auth,
    })
  }

  getUsersFromFirebase = (database) => {
    database.ref('/users').on('value', (snapshot) => {
      const users = snapshot.val()
      this.setState({ users: Object.keys(users).map((userId) => ({ ...users[userId] })) })
    })
  }

  mapUser = (user) => ({
    uid: user.uid,
    details: { name: user.displayName, avatar: user.photoURL }
  })

  login = () => {
    const { provider, auth } = this.state
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      const accessToken = result.credential.accessToken;
      storage.set('accesstoken', accessToken)
      storage.set('user', JSON.stringify(user))
      this.setState({ user, accessToken })
    }).catch(function(error) {
      const code = error.code;
      const message = error.message;
      const email = error.email;
      const credential = error.credential;
      this.setState({ error: { code, message, email, credential } })
    });
  }

  logout = () => {
    const { auth } = this.state
    auth.signOut().then(() => {
      this.setState({ user: {} })
    }).catch(function(error) {
      alert(error)
    });
  }

  isLoggedIn = () => {
    const { currentUser } = this.state
    return !!currentUser
  }

  renderLogin = () => {
    if (this.isLoggedIn()) {
      return (
        <button id="login" onClick={this.logout}>Log Out</button>
      )
    }
    return (
      <button id="login" onClick={this.login}>Login with Google</button>
    )
  }

  renderUser = () => {
    const { currentUser } = this.state
    if (this.isLoggedIn()) {
      return (
        <div>
          <h3>{currentUser.details.name}</h3>
          <img
            alt="avatar"
            src={currentUser.details.avatar}
            height="100"
            width="100"
            style={{ borderRadius: '50%' }}
          />
        </div>
      )
    }
    return null
  }

  setCurrentChat = (chatId) => {
    const { database } = this.state
    database.ref(`/chats/${chatId}`).on('value', (snapshot) => {
      this.setState({ chat: snapshot.val() })
    })
  }

  render() {
    const { currentUser, users, database, chat } = this.state

     const ChatWrapper = () => (
        <div style={mainStyle}>
          <Sidebar
            currentUser={currentUser}
            users={users}
            database={database}
            setCurrentChat={this.setCurrentChat}
          />
          <Chat
            currentUser={currentUser}
            database={database}
            chat={chat}
          />
        </div>
      )

    return (
      <Router>
        <div>
          <div className="App">
            <Navbar/>
            <div className="App-header">
              {this.renderLogin()}
              
              {this.renderUser()} 
            </div>
          </div>
          <Route exact path="/" component={ChatWrapper} />
          <Route exact path="/profile" render={() => (
            <Profile
              database={database}
              currentUser={currentUser}
            />
            )} 
          />
        </div>
      </Router>
    );
  }
}

const mainStyle = {
  padding: 10,
  margin: '50px auto',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'stretch',
  minHeight: 300,
}

export default App;
