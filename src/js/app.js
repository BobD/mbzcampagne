import 'babel-polyfill';
import $ from 'jquery';
import log from './utils/logger';
import History from './modules/history';
import ScreenMode from './utils/screenmode';
import Footer from './modules/footer';

window.log = log;

document.addEventListener("DOMContentLoaded", function(e) {
	let history = new History();	
	let screenMode = new ScreenMode();
	let mode = screenMode.getScreenMode();
	let footer = new Footer();
	let $html = document.querySelector('html');
	let $body = document.querySelector('body');	
	let $page = document.querySelector('.page');

	$($html).toggleClass('no-js', false);
	$($html).toggleClass('js', true);

	history.on('change', (e) => {
		showDetail(e.id)
	})

	applyScreenMode(mode);
	screenMode.on('change', (e) => {
		applyScreenMode(e.mode);
		moodBoard.setMode((mode.isMobile || mode.isTabletPortrait) ? 'mobile' : 'desktop');
	});

});


