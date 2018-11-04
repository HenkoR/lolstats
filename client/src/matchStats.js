import React, { Component } from 'react';
import './matchstats.css';

class MatchStats extends Component {

    render() {
        const listItems = this.props.summonerStats.matches.map((match) =>
            <div className={`Stats ${match.win ? 'Stats-Victory' : 'Stats-Defeat'}`} key={match.gameId.toString()}>
                <div className="divTableBody">
                    <div className='Match divTableRow'>
                        <div className='divTableCell'>
                            <p className={match.win ? 'Victory' : 'Defeat'}>{match.win ? 'Victory' : 'Defeat'}</p>
                            <p>{Math.floor(match.duration / 60) + 'm ' + match.duration % 60 + 's'}</p>
                        </div>
                        <div className='divTableCell'>
                            <p>{match.summonername}</p>
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <ul className={'match-list'}>{listItems}</ul>
        );
    }
}

export default MatchStats