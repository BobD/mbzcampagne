import 'babel-polyfill';
import log from './utils/logger';
import History from './utils/history';
import ScreenMode from './utils/screenmode';
import Tools from 'utils/tools';

import Video from './modules/video';
import Footer from './modules/footer';

import React from 'react';
import {render} from 'react-dom';

		window.log = log;

class App {

	constructor(config){
		let history = new History();	
		let screenMode = new ScreenMode();
		let mode = screenMode.getScreenMode();
		let footer = new Footer();

		this.$html = document.querySelector('html');
		this.$body = document.querySelector('body');	
		this.$page = document.querySelector('.page');

		Tools.toggleClass(this.$html,'no-js', false);
		Tools.toggleClass(this.$html,'js', true);

		history.on('change', (e) => {
			this.setScene(e.pathname);
		});

		this.setScene(history.get());

		screenMode.on('change', (e) => {
			this.setScreenMode(e.mode);
		});
	}

	setScreenMode(mode){

	}

	setScene(pathname){
		if(pathname == '/start'){
			let vid = new Video();
			render(<Video onChapter={this.onVideoChapter}/>, document.querySelector('body'));
		}
	}

	onVideoChapter(e){
		log(e.chapter, e.player);
		e.player.pause();
	}

}

new App();


// document.addEventListener("DOMContentLoaded", function(e) {
// });


