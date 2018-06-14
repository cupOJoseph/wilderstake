const { BrowserRouter, Route } = require('react-router-dom');

const React = require('react');
const Explanation = require('./Explanation');
const Header = require('./Header');
const HomeContent = require('./HomeContent');
const Contribute = require('./Contribute');
const Vote = require('./Vote');
const About = require('./About');

/* the main page for the index route of this app */
const Home = function() { 
  return (
    <BrowserRouter>
      <div style={{ fontFamily: '\'Oxygen\', sans-serif' }}>
        <Header />
        <div style={{ paddingTop: 50 }}>
          <Route exact path="/" component={HomeContent} />
          <Route path="/about" component={About} />
          <Route path="/contribute" component={Contribute} />
          <Route path="/vote" component={Vote} />
        </div>
      </div>
    </BrowserRouter>
  );
}

module.exports = Home;