// import CreateBrowserHistory from 'history/createBrowserHistory';
import CreateHashHistory from 'history/createHashHistory';
import Events from 'events';

class History {

	constructor(config){
		this.eventEmitter = new Events.EventEmitter();

		// https://github.com/mjackson/history
		this.history = CreateHashHistory({
			// hashType: 'noslash'
		});
		
		this.history.listen((location, action) => {
			this.eventEmitter.emit('change', {
	  			pathname: this.history.location.pathname
	  		});
		});
	}


	set(id, state = {}){
		this.history.push(`${id}`, state);
	}

	get(){
		return this.history.location.pathname;
	}

	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}

}

export default History;