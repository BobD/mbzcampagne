
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
				 var videoElement = document.querySelector("video");
				 var textTracks = myPlayer.textTracks();
				 var chapters = textTracks[0];

				 chapters.oncuechange = () => {
				 	if(chapters.activeCues.length == 0){
				 		return;
				 	}
				  	let cue = chapters.activeCues[0]; 
				  	let data = JSON.parse(cue.text);

				  	base.props.onChapter({
				  		player: myPlayer,
				  		chapter: data
				  	})
				}

			 }, 100);

			 myPlayer.play();
		});
	}

	render(){
		return (
			<div className="video">
				<link href="//vjs.zencdn.net/5.4.6/video-js.min.css" rel="stylesheet"></link>
				<script src="//vjs.zencdn.net/5.4.6/video.min.js"></script>
				<video id="video__container" className="video__container video-js vjs-default-skin"
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