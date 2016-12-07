import React from 'react';
import {render} from 'react-dom';
import videojs from 'video.js';

class Video extends React.Component{

	constructor(props){
		super(props);
	}

	componentDidMount(){
		let base = this;

		// http://videojs.com/
		videojs(document.querySelector('video'), {
			controls: false
		}).ready(function() {
			 base.player = this;

			 // Get tracks, see https://www.html5rocks.com/en/tutorials/track/basics/
			 setTimeout(() => {
				let videoElement = document.querySelector("video");
				let textTracks =  base.player.textTracks();
				let chapters = textTracks[0];
				let cues = chapters.cues;
				let startTime = 0;
				let activeCue = cues.getCueById(base.props.chapter);

				for(let a = 0; a < cues.length; ++a){
					let cue = cues[a];

					cue.onenter = function(){
						log('onenter', cue.id);
					};

					cue.onexit = function(){
				  		base.props.onQuestion({
				  			player:  base.player,
				  			id: cue.id
				  		})
					};
				}

				if(activeCue != undefined){
					startTime = activeCue.endTime;
					base.props.onQuestion({
			  			player:  base.player,
			  			data: JSON.parse(activeCue.text)
			  		})
				}

				 base.player.currentTime(startTime);

				//  chapters.oncuechange = () => {
				// }

			 }, 250);

			 base.props.onInit({
			 	player: base
			 });
		});
	}

	play(){
		this.player.play();
	}

	pause(){
		this.player.pause();
	}

	goToChaper(chapter){
		let videoElement = document.querySelector("video");
		let textTracks =  this.player.textTracks();
		let chapters = textTracks[0];
		let cues = chapters.cues;
		let startTime = cues.getCueById(chapter).startTime + 0.05;

		this.player.currentTime(startTime);
		this.player.pause();
	}

	render(){
		return (
			<div className="video__container">
				<link href="//vjs.zencdn.net/5.4.6/video-js.min.css" rel="stylesheet"></link>
				<script src="//vjs.zencdn.net/5.4.6/video.min.js"></script>
				<video id="video__element" className="video__container video-js vjs-default-skin"
					  controls preload="auto"
					  poster="http://video-js.zencoder.com/oceans-clip.png">
					 <source src="eh5v.files/html5video/Vastgoed_Maetland.m4v" type="video/mp4" />
					 <source src="eh5v.files/html5video/Vastgoed_Maetland.webm" type="video/webm" />
					 <track kind="chapters" src="tracks.vtt" default></track>
				</video>
			</div>
		);
	}
}

export default Video;