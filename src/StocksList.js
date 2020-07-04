import React, {Component} from 'react';
import {Alert, Button} from 'reactstrap';

import {Link} from 'react-router-dom';

const Stock = (props) => (
    <div className="stock-container p-2 m-2 d-flex flex-column">
        <h3>{props.name}</h3>
        <div className="stock-body">
            <div className="subtitle-container">
                <div>Last trade date: {props.lastTradeDate}</div>
                <div>Personal Rating: {props.personalRating} / 5</div>
                <div>{props.isPositive ? "Went UP today" : "Went DOWN today"} </div>
            </div>
            <div>Today's quote: {props.recentQuote}</div>
            <div>Previous day quote: {props.prevDayQuote}</div>
        </div>
        <div className="stocks-footer">
            <Button color="secondary" tag={Link} to={"/stocks/" + props.id}>Edit</Button>
            <Button color="danger" onClick={() => props.remove(props.id)}>Delete</Button>
        </div>
    </div>
);

class StocksList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stocks: [],
            isLoading: true,
            errorMessage: null
        };
        this.remove = this.remove.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});
        const response = await this.props.api.getAll();
        if (!response.ok) {
            this.setState({
                    errorMessage: `Failed to load stocks: ${response.status} ${response.statusText}`,
                    isLoading: false
                }
            )
        } else {
            const body = await response.json();
            const stocks = body._embedded.stocks;
            this.setState({
                stocks: stocks,
                isLoading: false,
                errorMessage: null
            });
        }
    }

    async remove(id) {
        let response = await this.props.api.delete(id);
        if (!response.ok) {
            this.setState({errorMessage: `Failed to delete stock: ${response.status} ${response.statusText}`})
        } else {
            let updatedStocks = [...this.state.stocks].filter(i => i.id !== id);
            this.setState({stocks: updatedStocks, errorMessage: null});
        }
    }

    render() {
        const {stocks, isLoading, errorMessage} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {this.props.navbar}
                <div className="d-flex flex-row justify-content-between p-3">
                    <h3 className="stocks-title">Stocks</h3>
                    <Button color="success" tag={Link} to="/stocks/new">Add New</Button>
                </div>
                {errorMessage ?
                    <div className="d-flex flex-row justify-content-center">
                        <Alert color="warning" style={{flex: 1, maxWidth: '80%'}}>
                            {errorMessage}
                        </Alert>
                    </div> : null
                }
                <div className="d-flex flex-row flex-container flex-wrap justify-content-center">
                    {stocks.map(stock =>
                        <Stock {...stock} remove={this.remove.bind(this)} key={stock.id}/>
                    )}
                    {!stocks || stocks.length === 0 ? <p>No stocks!</p> : null}
                </div>
            </div>
        );

    }
}

export default StocksList;