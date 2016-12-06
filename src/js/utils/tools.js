class Tools {

	constructor(){
	}

	static toggleClass(el, className, force){
		if (el.classList) {
			if(force === undefined){
		  		el.classList.toggle(className);
			}else{
				el.classList.toggle(className, force);
			}
		} else {
			let classes = el.className.split(' ');
			let existingIndex = classes.indexOf(className);

			if(force){
				log(existingIndex);
	  			if (existingIndex == -1){
		    		classes.push(className);
				}
			}else{
			  	if (existingIndex >= 0){
			    	classes.splice(existingIndex, 1);
			  	}else{
			    	classes.push(className);
				}
			}

			el.className = classes.join(' ');
		}
	}

}

export default Tools;