import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Alert, Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';

class StocksEdit extends Component {

    emptyItem = {
        name: '',
        prevDayQuote: '',
        recentQuote: '',
        lastTradeDate: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errorMessage: null,
            isCreate: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        this.state.isCreate = this.props.match.params.id === 'new'; // are we editing or creating?
        if (!this.state.isCreate) {
            const response = await this.props.api.getById(this.props.match.params.id);
            const stock = await response.json();
            this.setState({item: stock});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item, isCreate} = this.state;
        let result = isCreate ? await this.props.api.create(item) : await this.props.api.update(item);
        if (!result.ok) {
            this.setState({errorMessage: `Failed to ${isCreate ? 'create' : 'update'} record: ${result.status} ${result.statusText}`})
        } else {
            this.setState({errorMessage: null});
            this.props.history.push('/stocks');
        }
    }

    render() {
        const {item, errorMessage, isCreate} = this.state;
        const title = <h2>{isCreate ? 'Add Stock' : 'Edit Stock'}</h2>;
        return (
            <div>
                {this.props.navbar}
                <Container style={{textAlign: 'left'}}>
                    {title}
                    {errorMessage ?
                        <Alert color="warning">
                            {errorMessage}
                        </Alert> : null
                    }
                    <Form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <FormGroup className="col-md-8 mb-3">
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" id="name" value={item.name || ''}
                                       onChange={this.handleChange} autoComplete="name"/>
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="recentQuote">Recent quote</Label>
                                <Input type="text" name="recentQuote" id="recentQuote" value={item.recentQuote || ''}
                                       onChange={this.handleChange} autoComplete="recentQuote"/>
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Label for="prevDayQuote">Previous day quote</Label>
                            <Input type="text" name="prevDayQuote" id="prevDayQuote" value={item.prevDayQuote || ''}
                                   onChange={this.handleChange} autoComplete="prevDayQuote-level1"/>
                        </FormGroup>
                        <div className="row">
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="lastTradeDate">Last trade date</Label>
                                <Input type="text" name="lastTradeDate" id="lastTradeDate"
                                       value={item.lastTradeDate || ''}
                                       onChange={this.handleChange}/>
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="isPositive">Went UP today?</Label>
                                <Input type="select" name="isPositive" id="isPositive"
                                       value={item.isPositive ? 'true' : 'false'}
                                       onChange={this.handleChange}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="personalRating">Personal Rating</Label>
                                <Input type="select" name="personalRating" id="personalRating"
                                       value={item.personalRating || '-'}
                                       onChange={this.handleChange}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option value="-">-</option>
                                </Input>
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/stocks">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withRouter(StocksEdit);