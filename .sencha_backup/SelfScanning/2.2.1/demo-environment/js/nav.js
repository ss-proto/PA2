$(document).ready(function() {
	$('#buttonbar div').click(function() {
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		
		if (this.id == 'bb_preise') {
			$('#articlelist').css({'left':'780px'});
			$('#pricelist').css({'left':'0'});
		} else {
			$('#pricelist').css({'left':'-780px'});
			$('#articlelist').css({'left':'0'});
		}
		
		
	});

	$('#top_nav div').hover(showCovers, hideCovers);
	
	$('#top_nav div').click(function(e) {
		if (this.id == 'slider') return false;
		
		$('#top_nav div').removeClass('active');
		
		var offsetLeft = 0;
		switch (this.id) {
			case 'filiale': $(this).addClass('active'); offsetLeft = 0; break;
			case 'datenbank': $(this).addClass('active'); offsetLeft = 190; break;
			case 'kasse': $(this).addClass('active'); offsetLeft = 380; break;
			default: return false;
		}
		
		$('#slider').css('left', offsetLeft+'px');
		$('#body').css('height', $('#' + this.id + '_content').css('height'));
		transformCovers(this.id);
		//hideCovers();
	});
	
	$(function(){
		showCovers();
		transformCovers('filiale');
		setTimeout(function() {
			//$('#datenbank').click();
			//$('#bb_preise').click();
			hideCovers();
		}, 600);
	});
	
	function showCovers() {
		var selectedItem = $('.coverflow .flowItem.selected');
		selectedItem.css('opacity', '0.7');
		selectedItem.css('transform', 'scale(0.95, 0.95)');
		
		$('.coverflow .flowItem').css('border', '1px solid #999');
		$('.coverflow .flowItem').css('background', '#eee');
		$('.coverflow .flowItem:not(.selected)').css('opacity', '0.7');
	}
	
	function hideCovers() {
		$('.coverflow .flowItem').css('border', '0');
		$('.coverflow .flowItem').css('background', 'rgba(255,255,255,0)');
		
		var selectedItem = $('.coverflow .flowItem.selected');
		selectedItem.css('opacity', '1');
		selectedItem.css('transform', 'scale(1, 1)');
		
		$('.coverflow .flowItem:not(.selected)').css('opacity', '0');
	}

	function transformCovers(centerSection,callback) {
		var centerItem;
		
	  if(centerSection=="" || typeof(centerSection)=='undefined'){
		var items = $('.coverflow .flowItem');
		centerItem = items.eq(parseInt(items.length/2));
	  } else centerItem = $('#'+centerSection+'_content');

	  if(!centerItem.hasClass('selected')){
		var leftItems = centerItem.prevAll('.flowItem');
		var rightItems = centerItem.nextAll('.flowItem');

		var transform_vals = "translateX(0px) rotateY(0deg) translateZ(0)";
		centerItem.css({"transform": transform_vals});
	 
		leftItems.each(function(i){
		  var itemdelta = i+1;
		  var transform_vals = "translateX("+((itemdelta)*-15)+"%) rotateY(90deg) translateZ(-350px)";
		  $(this).css({"transform": transform_vals});
		});
	 
		rightItems.each(function(i){
		  var itemdelta = i+1;
		  var transform_vals = "translateX("+((itemdelta)*15)+"%) rotateY(-90deg) translateZ(-350px)";
		  $(this).css({"transform": transform_vals});
		});
		
		centerItem.addClass('selected').siblings('.selected').removeClass('selected');
		showCovers();
	  }
	}
});