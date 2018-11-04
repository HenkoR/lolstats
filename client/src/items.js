import React, { Component } from 'react';
import './items.css';

class Items extends Component {

    render() {
        const listItems = this.props.items.map((item) =>
            <li key={item.itemId.toString()}>
                <div className={'Item'}>
                    <img className='itemImg' src={require('../img/item/' + item.itemImg)} alt={item.itemName} />
                    {/* <div className="divTableBody">
                    <div className='divTableRow'>
                        <div className='divTableCell'>
                            
                        </div>
                    </div>
                </div> */}
                </div>
            </li>
        );

        return (
            <ul className={'items-list'}>{listItems}</ul>
        );
    }
}

export default Items