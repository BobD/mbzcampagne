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
			 var myPlayer = this;

			 // Get tracks, see https://www.html5rocks.com/en/tutorials/track/basics/
			 setTimeout(() => {
				let videoElement = document.querySelector("video");
				let textTracks = myPlayer.textTracks();
				let chapters = textTracks[0];
				let cues = chapters.cues;

				for(let a = 0; a < cues.length; ++a){
					let cue = cues[a];

					cue.onenter = function(){

					};

					cue.onexit = function(){
						let data = JSON.parse(cue.text);
				  		base.props.onScreen({
				  			player: myPlayer,
				  			data: data
				  		})
					};
				}

				//  chapters.oncuechange = () => {
				//  	if(chapters.activeCues.length == 0){
				//  		return;
				//  	}
				//   	let cue = chapters.activeCues[0]; 
				//   	let data = JSON.parse(cue.text);

				//   	base.props.onScreen({
				//   		player: myPlayer,
				//   		data: data
				//   	})
				// }

			 }, 500);

			 myPlayer.play();
		});
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
					 <track kind="chapters" src="eh5v.files/html5video/chapters.vtt" default></track>
				</video>
			</div>
		);
	}
}

export default Video;