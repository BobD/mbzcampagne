import Events from 'events';

class Footer {

	constructor(config){
		this.eventEmitter = new Events.EventEmitter();
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}
}

export default Footer;