import React, { Component } from 'react';
import './app.css';
import MatchStats from './matchStats';

class App extends Component {
    state = {
        summonerName: 'BFY Meowington',
        summonerStats: {
            summoner: '',
            matches: []
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
        this.setState({ summonerStats: JSON.parse(body.summonerStats) });
    };

    // const listItems = this.state.summonerStats.matches.map((match) =>
    //     <li key={match.gameId.toString()}>
    //         <MatchStats summonerStats={match} />
    //     </li>
    // );
    // return (
    //     <ul>{listItems}</ul>
    // );



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
                    <MatchStats summonerStats={this.state.summonerStats} />
                </div>
            </div>
        );
    }
}
export default App;