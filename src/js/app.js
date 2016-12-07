import 'babel-polyfill';
import _ from 'underscore';
import log from './utils/logger';
import History from './utils/history';
import ScreenMode from './utils/screenmode';
import Tools from 'utils/tools';

import Velocity from 'velocity-animate';

import Video from './modules/video';
import Questions from './modules/questions';
import Results from './modules/results';

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

window.log = log;

class App {

	constructor(config){
		this.history = new History();	
		this.$html = document.querySelector('html');
		this.$body = document.querySelector('body');	
		this.$content = document.querySelector('.content');

		this.currentPathSegments = [];
		this.questions = {};
		this.answers = [];
		this.totalQuestions = data.vragen.attributes.sections.length;

		data.vragen.attributes.sections.forEach((section) => {
			this.questions[section.id] = section;
		});

		this.routes = {
			"vragen": {
				render: this.renderVideo.bind(this),
				container: document.querySelector('.video')
			},
			"resultaten": {
				render: this.renderResults.bind(this),
				container: document.querySelector('.header')
			}
		}

		Tools.toggleClass(this.$html,'no-js', false);
		Tools.toggleClass(this.$html,'js', true);

		this.history.on('change', (e) => {
			this.initPath(e.pathname);
		});

		this.initPath(this.history.get());

		let screenMode = new ScreenMode();
		screenMode.on('change', (e) => {
			this.setScreenMode(e.mode);
		});

		this.currentPathSegments = [];
	}

	setScreenMode(mode){

	}

	initPath(pathname){
		let pathSegments = pathname.split('/');
		pathSegments = _.without(pathSegments, '');

		// Remove old screens
		let oldPathSegments = _.difference(this.currentPathSegments, pathSegments);
		oldPathSegments.forEach((path) => {
			let route = this.routes[path];
			if(route){
				unmountComponentAtNode(route.container);
			}
		});

		// Render new screens
		let newPathSegments = _.difference(pathSegments, this.currentPathSegments);
		newPathSegments.forEach((path) => {
			let route = this.routes[path];
			if(route){
				route.render(route.container);
			}
		});

		this.currentPathSegments = pathSegments;
		Tools.toggleClass(this.$content, 'active', pathSegments.length > 0);
	}

	renderVideo($container){
		let pathSegments = this.currentPathSegments.slice(0);
		let question = pathSegments.pop();
		if(question == undefined){
			question = '';
		}

		render(<Video 
			chapter={question}
			onInit={(e) => {this.onRenderVideo(e);}}
			onQuestion={(e) => {this.onQuestion(e);}}
		/>, $container);

		this.scrollTo('.content');
	}

	onRenderVideo(e){
		this.videoPlayer = e.player;
		this.videoPlayer.play();
	}

	onQuestion(e){
		this.renderQuestion(e.id);
	}

	renderQuestion(question){
		let questionData = this.questions[question];
		let data =  {attributes: {title:''}, body: ''};
		let $target = document.querySelector('.questions');

		if(questionData != undefined){
			data = questionData.content;
		}

		render(<Questions 
			id = {question}
			title = {data.attributes.title}
			options = {data.attributes.options}
			answer = {data.attributes.answer}
			body = {data.body}
			onQuestionAnswer={(e) => {this.onQuestionAnswer(e);}}
			onQuestionReplay={(e) => {this.onQuestionReplay(e);}}
		/>, $target);

		this.videoPlayer.pause();

		setTimeout(() => {
			Tools.toggleClass($target, 'active', true);
		}, 10);
	}

	onQuestionAnswer(data){
		this.answers.push(data);

		if(this.answers.length == this.totalQuestions){
			this.history.set('/resultaten');
		}

		this.removeQuestion();
		this.videoPlayer.play();
	}

	onQuestionReplay(data){
		let question = data.id;
		this.removeQuestion();
		this.videoPlayer.goToChaper(data.id);
		this.videoPlayer.play();

	}

	removeQuestion(){
		let $target = document.querySelector('.questions');
		Tools.toggleClass($target, 'active', false);

		setTimeout(() => {
			unmountComponentAtNode($target);
		}, 500);
	}


	renderResults($container){
		render(<Results 
			answers = {this.answers}
		/>, $container);

		this.scrollTo('.header');
	}

	scrollTo(selector, speed = 250, delay = 0, callback){
		var $target =  document.querySelector(selector);
		// http://velocityjs.org/#scroll
      	Velocity($target, 'scroll', {delay: delay, queue: false, duration: speed});

	}


}

new App();


// document.addEventListener("DOMContentLoaded", function(e) {
// });


