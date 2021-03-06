import React, { Component } from 'react';

import Aux 					from '../../hoc/Auxilary/Auxilary';
import Burger 				from '../../components/Burger/Burger';
import BuildControls 		from '../../components/Burger/BuildControls/BuildControls';
import Modal				from '../../components/UI/Modal/Modal';
import OrderSummary			from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner				from '../../components/UI/Spinner/Spinner';
import withErrorHandler 	from '../../hoc/withErrorHandler/withErrorHandler';
import axios				from '../../axios-orders';


const INGREDIENT_PRICES = {
	lettuce: 0.5,
	cheese: 1.0,
	bacon: 1.5,
	meat: 2.0

}

class BurgerBuilder extends Component {
	// constructor(props){
	// 	super(props);
	// 	this.state = {...}
	// }
	state = {
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false
	}

	componentDidMount () {
		axios.get('https://react-burger-app-da62e.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data});
			});
	}

	updatePurchaseState (ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey]
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);

		this.setState({purchasable: sum > 0});
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0){
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const priceSubtraction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceSubtraction;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () => {
		const queryParams = [];
		for (let i in this.state.ingredients){
			queryParams.push(encodeURIComponent(i) + '=' + encodeURI(this.state.ingredients[i]));
		}
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
	}

	render(){
		const disabledInfo = {
			...this.state.ingredients
		};

		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		let orderSummary = null;
		let burger = <Spinner />;

		if (this.state.ingredients){
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls 
						ingredientAdded={this.addIngredientHandler} 
						ingredientRemoved={this.removeIngredientHandler} 
						disabled={disabledInfo}
						price={this.state.totalPrice} 
						purchasable={this.state.purchasable} 
						ordered={this.purchaseHandler} />
				</Aux>
			);

			orderSummary = <OrderSummary 
					price={this.state.totalPrice}
					ingredients={this.state.ingredients}
					purchaseCanceled={this.purchaseCancelHandler} 
					purchaseContinued={this.purchaseContinueHandler} />;

		}
		if (this.state.loading) {
			orderSummary = <Spinner />;
		}
		

		return(
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);