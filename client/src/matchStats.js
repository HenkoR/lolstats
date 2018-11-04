import React, { Component } from 'react';
import './matchstats.css';
import Items from './items';

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
                            <img className='champImg' src={require('../img/champion/' + match.championUrl)} alt={match.championUrl} /><br />
                            <img className='spellImg' src={require('../img/spell/' + match.spells[0].spellImg)} alt={match.spells[0].spellName} />
                            <img className='spellImg' src={require('../img/spell/' + match.spells[1].spellImg)} alt={match.spells[1].spellName} />
                            <br />{match.summonername}
                            <br />{match.champName}
                        </div>
                        <div className='divTableCell'>
                            <p>
                                {match.kills} / {match.deaths} / {match.assists}<br />
                                {match.kda} : 1 KDA
                            </p>
                        </div>
                        <div className='divTableCell'>
                            <p>
                                Level{match.champlvl}<br />
                                {match.cs}({match.cspm}) CS
                            </p>
                        </div>
                        <div className='divTableCell'>
                            <Items items={match.items} />
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