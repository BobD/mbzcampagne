import Tools from 'utils/tools';
import Events from 'events';

class Sidebar{

	constructor(){
		this.eventEmitter = new Events.EventEmitter();
		this.$sidebar = document.querySelector('.sidebar');
		this.$content = document.querySelector('.sidebar__content');

		let $sidebarToggles = document.querySelectorAll("[data-js='toggle-sidebar']");
		Array.from($sidebarToggles).forEach(($link) => {
			$link.addEventListener('click', () => {
				Tools.toggleClass(this.$sidebar, 'active');

				this.eventEmitter.emit(Tools.hasClass(this.$sidebar, 'active') ? 'open' : 'close', {
		  		});

			});
		});

		let $pageToggles = document.querySelectorAll("[data-js='toggle-page']");
		Array.from($pageToggles).forEach(($link) => {
			$link.addEventListener('click', (e) => {
				Tools.toggleClass(this.$content, 'active');

				// Temp until the path router works properly
				e.preventDefault();
				location.href = '/#/';
			});
		});
	}

	close(){
		Tools.toggleClass(this.$sidebar, 'active', false);
	}

	open(){
		Tools.toggleClass(this.$sidebar, 'active', true);
	}

	showPage(){
		this.open();
		Tools.toggleClass(this.$content, 'active', true);
	}
 
	on(){
		this.eventEmitter.on.apply(this.eventEmitter, arguments);
	}


}

export default Sidebar;