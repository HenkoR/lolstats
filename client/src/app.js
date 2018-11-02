import React, { Component } from 'react';
import './app.css';

class App extends Component {
    state = {
        summonerName: 'BFY Meowington',
        summoner: {
            "id":null,
            "accountId":null,
            "name":'',
            "profileIconId":null,
            "revisionDate":null,
            "summonerLevel":null
        }
    };

    getSummonerInfo = async e => {
        e.preventDefault();     
        
        const encodedValue = encodeURIComponent(this.state.summonerName);   

        const response = await fetch(`/api/summoner?name=${encodedValue}`);
        
        if (response.status !== 200) {
            console.log("boo :(");
            return;
        }
        
        const body = await response.json();        
        this.setState({ summoner: JSON.parse(body.summoner) });
    };

    render() {
        return (
            <div className="app">
                <header className="app-header">
                    <p>League Of Legends Summoner Stats</p>
                </header>
                <form onSubmit={this.getSummonerInfo}>
                    <p>
                        <strong>Enter the summoners name:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.summonerName}
                        onChange={e => this.setState({ summonerName: e.target.value })}
                    />
                    <button type="submit">Submit</button>
                </form>
                <div className="SummonerStats">
                    <p>{this.state.summoner.name}</p>
                </div>
            </div>
        );
    }
}
export default App;