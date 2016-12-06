import 'babel-polyfill';
import log from './utils/logger';
import History from './utils/history';
import ScreenMode from './utils/screenmode';
import Tools from 'utils/tools';

import Video from './modules/video';
import Screens from './modules/screens';

import React from 'react';
import {render} from 'react-dom';

window.log = log;

class App {

	constructor(config){
		this.history = new History();	
		this.$html = document.querySelector('html');
		this.$body = document.querySelector('body');	
		this.$page = document.querySelector('.page');

		let screenMode = new ScreenMode();

		Tools.toggleClass(this.$html,'no-js', false);
		Tools.toggleClass(this.$html,'js', true);

		this.history.on('change', (e) => {
			this.initPath(e.pathname);
		});

		this.initPath(this.history.get());

		screenMode.on('change', (e) => {
			this.setScreenMode(e.mode);
		});
	}

	setScreenMode(mode){

	}

	initPath(pathname){
		let pathSegments = pathname.split('/');

		if(pathSegments[0] == ''){
			pathSegments.shift();
		}

		if(pathSegments[0] == 'vragen'){
			this.renderVideo();

			let question = pathSegments[1];
			log(question);
			if(question != undefined){
				this.renderScreen(question);
			} 
		}
	}

	renderVideo(){
		let $target = document.querySelector('.video');
		if(Tools.hasClass($target, 'active')){
			return;
		}

		render(<Video onScreen={(e) => {this.onScreen(e);}}/>, $target);
		Tools.toggleClass($target,'active', true);
	}

	onScreen(e){
		this.history.set(`/vragen/${e.data.chapter}`)
		e.player.pause();
	}

	renderScreen(question){
		log('renderScreen');
		let $target = document.querySelector('.screens');
		render(<Screens/>, $target);
		// Tools.toggleClass($target,'active', true);
	}


}

new App();


// document.addEventListener("DOMContentLoaded", function(e) {
// });


