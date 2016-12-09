// Much obliged to http://youmightnotneedjquery.com/

class Tools {

	constructor(){
	}

	static hasClass(el, className, force){
		if (el.classList){
		  	return el.classList.contains(className);
		}else{
		  	return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
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