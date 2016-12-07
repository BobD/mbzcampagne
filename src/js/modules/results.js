import React from 'react';
import {render} from 'react-dom';

class Results extends React.Component{

	constructor(props){
		super(props);
	}
	render(){
		let answers = this.props.answers || [];

		let answersElements = [];
		let index = 0;

		answers.forEach((answer) => {
			answersElements.push((<li key={index} className="results__list-item">{answer.correct ? 'yep' : 'nope'}</li>))
			++index;
		});

		return (
			<div className="results">

				<ul className="results__list">
					{answersElements}
				</ul>
			
			</div>
		);
	}

}

export default Results;