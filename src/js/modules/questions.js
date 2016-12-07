import React from 'react';
import {render} from 'react-dom';

class Questions extends React.Component{

	constructor(props){
		super(props);
	}

	createMarkup() {
	  	return {__html: this.props.body};
	}

	onQuestionAnswer(option){
		this.props.onQuestionAnswer({
			id: this.props.id,
			answer: option,
			correct: option == this.props.answer
		});
	}

	onReplay(){
		this.props.onQuestionReplay({
			id: this.props.id,
		});
	}

	render(){
		let options = this.props.options || ['skip'];
		let optionElements = [];
		let index = 0;

		options.forEach((option) => {
			optionElements.push((<li key={index} onClick={() => this.onQuestionAnswer(option)} className="questions__list-item">{option}</li>))
			++index;
		});

		return (
			<div className="questions__screen">
				<div className="questions__content">
					<div className="questions__title">{this.props.title}</div>
					<ul className="questions__list">
						{optionElements}
					</ul>
					<div className="questions__again" onClick={() => this.onReplay()}>Speel fragment opnieuw</div>
				</div>
			</div>
		);
	}

}

export default Questions;