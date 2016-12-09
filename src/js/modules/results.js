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
		let correctAnswers = 0;
		let title = 'Helaas, je hebt geen locatie goed.';

		for (let q in answers) {
			let answer = answers[q];
			if(answer.correct){
				++correctAnswers;
			}
			answersElements.push((<li key={++index} className="results__list-item">{answer.correct ? 'yep' : 'nope'}</li>))
		}

		if(correctAnswers > 0){
			title = `Je hebt ${correctAnswers} ${correctAnswers > 1 ? 'locaties' : 'locatie'} goed!`;
		}

		return (
			<section className="results">

				<div className="results__container backdrop">

					<header className="results__header">
						<div className="results__caption">Bedankt voor je deelname.</div>
						<h1 className="results__title">{title}</h1>
					</header>

					<div className="results__content">
						Gefeliciteerd met je score. Laat je mailadres achter* om automatisch kans te maken op 2 gratis kaartjes voor de Vakantiebeurs. Speel het spel nog een keer om je winkans te verhogen. Hoe hoger je score, hoe meer kans je maakt. Deel de actie via social media om je winkans nog te vergroten.
					</div>

					<ul className="results__list">
						{answersElements}
					</ul>

					<footer className="results__footer">
						* Je mailadres zal alleen worden gebruikt om te communiceren over de uitslag, hierna wordt het weer verwijderd.
					</footer>

				</div>
			
			</section>
		);
	}

}

export default Results;