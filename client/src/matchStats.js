import React, { Component } from 'react';
import './matchstats.css';

class MatchStats extends Component {
    
    render() {
        return (
            <div className="Stats">
                <p>{this.props.summoner.name}</p>
            </div>
        );
    }
}

export default MatchStats