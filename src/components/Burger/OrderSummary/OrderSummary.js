import React, {Component} 		from 'react';

import Aux 						from '../../../hoc/Auxilary/Auxilary';
import Button 					from '../../UI/Button/Button';

class OrderSummary extends Component {
	// componentWillUpdate() {
	// 	console.log('[OrderSummary] WillUpdate');
	// }

	render() {
		const ingredientSummary = Object.keys(this.props.ingredients)
			.map(igKey => {
				return (
					<li key={igKey}>
						<span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}
					</li>
				);
			});

		const totalPrice = (this.props.price).toFixed(2);

	
		return (
			<Aux>
				<h3>Your Order</h3>
				<p>A delicious burger with the following ingredients: </p>
				<ul>
					{ingredientSummary}
				</ul>
				<p><strong>Total Price: ${totalPrice}</strong></p>
				<p>Continue to Checkout</p>
				<Button 
					btnType="Danger"
					clicked={this.props.purchaseCanceled}>Cancel</Button>
				<Button 
					btnType="Success"
					clicked={this.props.purchaseContinued}>Continue</Button>
			</Aux>
		);
	};
};

export default OrderSummary;