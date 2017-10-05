/**

Author : Siddharth Patel
Developed for Nutanix UI challenge 

Email id : sidpatel789@gmail.com

*/
(function($){

	var DealsHub = {

		init : function(){

			var Self = this;
			var deals;

			this.startProgressBar();

			var d = Self.getDealsFromAPI();

			$.when(d).then(function(data){

				if(typeof data !== 'object'){
					deals = $.parseJSON(data);
				} else {
					deals = data;
				}
				
				
				Self.setDealsIds(deals);
				Self.setFinalPrice(deals);
				Self.getDealLikes(deals);

				Self.getNumberOfDeals();
				var dl = Self.getDealsList();
				Self.displayCurrentDeals(dl);

				$(".progress").hide();
			})
			
			Self.getApiHits();
			
			// this.getCourierDetails(0);
		},

		startProgressBar : function(){

			var SI = setInterval(function(){
				var n = parseInt($("#progress_bar").attr('aria-valuenow'))+1;
				if(n < 89){
					var np = n+"%";
					$("#progress_bar").css({"width":np});
					$("#progress_bar").attr('aria-valuenow',n);
				} else {
					clearInterval(SI);
				}
			},30)
		},

		getDealsFromAPI : function(){
			result = {"deals":[{"name":"Tommy Hilfiger backpack","actual_price":"1350","discount":"10%","rating":"3.8","provider":"Amazon","link":"http:\/\/www.amazon.in\/s\/ref=sr_nr_p_n_pct-off-with-tax_3?bbn=2454169031&fst=as%3Aoff&ie=UTF8&qid=1449163374&rh=n%3A2454169031%2Cp_4%3ATommy%20Hilfiger%2Cp_n_pct-off-with-tax%3A2665401031&rnid=2665398031&tag=desidime01-21&ascsubtag=16CL1Xdeals","image":"https:\/\/nutanix.0x10.info\/api\/img?img=http:\/\/cdn0.desidime.com\/photos\/66322\/small\/4jz0zI4.jpg"},{"name":"Redragon 3000DPI Mouse","actual_price":"1199","discount":"33%","rating":"4","provider":"Amazon","link":"http:\/\/www.amazon.in\/gp\/product\/B011HMDZ0Q","image":"https:\/\/nutanix.0x10.info\/api\/img?img=http:\/\/ecx.images-amazon.com\/images\/I\/41AQgzqSOhL.jpg"},{"name":"Tresemme Smooth & Shine","actual_price":"350","discount":"25%","rating":"4.5","provider":"Purplle","link":"http:\/\/purplle.com\/product\/tresemme-smooth-and-shine-shampoo-580-m","image":"https:\/\/nutanix.0x10.info\/api\/img?img=http:\/\/www.tresemmeindia.com\/Images\/1890\/1890-599879-Smooth__Silky_Shmpoo_300x400.png"},{"name":"Wings of Fire","actual_price":"325","discount":"25%","rating":"5","provider":"Flipkart","link":"http:\/\/www.flipkart.com\/wings-fire-autobiography-english-1st\/p\/itmdyu8fezqmmvhe","image":"https:\/\/nutanix.0x10.info\/api\/img?img=http:\/\/img6a.flixcart.com\/image\/book\/4\/6\/6\/wings-of-fire-an-autobiography-400x400-imaednuhwpknkmrr.jpeg"},{"name":"Freecharge Cashback (BILL150)","actual_price":"1650","discount":"10%","rating":"3","provider":"Freecharge","link":"https:\/\/www.freecharge.in","image":"https:\/\/nutanix.0x10.info\/api\/img?img=http:\/\/www.couponbass.com\/wp-content\/uploads\/2015\/09\/freecharge_logo_official.jpg"},{"name":"Cleartrip Activities (ACTOFFER)","actual_price":"6000","discount":"50%","rating":"4","provider":"Cleartrip","link":"http:\/\/www.cleartrip.com\/activities\/india\/","image":"https:\/\/nutanix.0x10.info\/api\/img?img=http:\/\/a1.mzstatic.com\/us\/r30\/Purple3\/v4\/33\/86\/4d\/33864dd5-2eac-5a6e-0480-c4a04d4af84d\/screen1136x1136.jpeg"}]};
			return result;
			return $.ajax({
				type : "POST",
				url  : "https://nutanix.0x10.info/api/deals?type=json&query=list_deals",
				success : function(data){
					var result = $.parseJSON(data);
					localStorage.setItem("deals" , result);
					return result;
				},
				error :function(){
					// if there is an error and unable to reach API
					
				}
			});
		},

		setDealsIds : function(deals){
			if(deals){
				$.each(deals,function(k,v){
					for(var i=0; i < v.length; i++){
						v[i]['id'] = i;
					}
				});

				DealsHub['deals'] = deals;
			}
		},

		setFinalPrice : function(deals){
			if(deals){
				$.each(deals,function(k,v){
					for(var i=0; i < v.length; i++){
						v[i]['final_price'] = (parseInt(v[i].actual_price) - ( parseInt(v[i].actual_price) * parseInt(v[i].discount) / 100 )).toFixed(0);
					}
				});

				DealsHub['deals'] = deals;
			}
		},

		getDealLikes : function(deals){
			var Self = this;
			var total_likes = parseInt(localStorage.total_likes);
			var tl = 0

			$.each(deals,function(k,v){

				for(var i=0; i < v.length; i++){

					var likeName = "deal_item_"+i;
					var likes = parseInt(localStorage[likeName]);
					
					if(!likes){
						v[i].likes = 0;
					} else {
						tl += likes;
						v[i].likes = parseInt(localStorage[likeName]);

						var likeNameBtn = "likeNameBtn_"+i;
						Self.setPageIdVariables(likeNameBtn , likes);
					}
					
				}
			});

			if(total_likes != tl){
				this.setPageIdVariables("total_likes" , tl);
				localStorage.setItem("total_likes" , tl);
			} else {
				this.setPageIdVariables("total_likes" , total_likes);
				localStorage.setItem("total_likes" , total_likes);
			}
			
		},

		getDealsList : function(){
			return DealsHub['deals'];
		},

		getNumberOfDeals : function(){
			var cl = this.getDealsList();
			var total_deals;

			$.each(cl,function(k,v){
				total_deals = v.length;
			});

			this.setPageIdVariables("total_deals" , total_deals);

			return total_deals;
		},

		getApiHits : function(){
			var self = this;
			$.ajax({
				type : "POST",
				url  : "https://nutanix.0x10.info/api/deals?type=json&query=api_hits",
				success : function(data){
					var api_hits = parseInt(($.parseJSON(data)).api_hits);
					console.log(api_hits);
					self.setPageIdVariables("api_hits" , api_hits)
				},
				error :function(){

				}
			});	
		},

		likeDeal : function(n){

			var likeName = "deal_item_"+n;

			var likes = localStorage[likeName] ? parseInt(localStorage[likeName]) : 0;
			var total_likes = localStorage.total_likes ? parseInt(localStorage.total_likes) : 0;
			
			likes += 1;
			total_likes += 1;

			localStorage.setItem(likeName , likes);
			localStorage.setItem("total_likes" , total_likes);

			var likeNameBtn = "likeNameBtn_"+n;
			this.setPageIdVariables("total_likes" , total_likes);
			this.setPageIdVariables(likeNameBtn , likes);

		},

		displayCurrentDeals : function(dl){
			if(dl){
				var dlStr = "";
				$.each(dl,function(k,v){
					for(var i=0; i < v.length; i++){
						dlStr += "<div class='col-md-4' class='current-deals'>";
						dlStr += 	"<div class='deal_item' id='deal_item_"+v[i].id+"' title='"+v[i].name+"'>";

						dlStr += 		"<div id='item_name' class='company-feature-tagline' >";
						dlStr += 			"<a href='"+v[i].link+"' target='_black' title='"+v[i].name+"'><i class='fa fa-external-link' style='color:black'></i> "+v[i].name+"</a>";
						dlStr += 		"</div>";

						dlStr += 		"<div id='item_name' style='color:#6C7A89'>";
						dlStr += 			"<i class='fa fa-user' style='color:black'></i> Provider : "+v[i].provider;
						dlStr += 		"</div>";

						dlStr += 		"<div class='row item_details' style=''>";

						dlStr += 			"<div class='col-md-4 col-xs-6'>";
						dlStr += 				"<a href='"+v[i].link+"' target='_black' title='"+v[i].name+"'><img src='"+v[i].image+"' class='thumbnail product_image' /></a>";
						dlStr += 			"</div>";

						dlStr += 			"<div class='col-md-8 col-xs-6'>";

						dlStr += 				"<div class='item_rating'>";

													var stars = Math.round(v[i].rating);

													for(var j = 0; j < stars; j++){
														dlStr += "<i class='fa fa-star rated'></i> ";
													}

													for(var j = stars; j < 5; j++){
														dlStr += "<i class='fa fa-star unrated'></i> ";
													}

													dlStr += "<span class='rated'>"+v[i].rating+"</span>";

						dlStr += 				"</div>";

						dlStr += 				"<div class='item-link'><span style='color:black;font-weight:bold'>Link : </span><i class='fa fa-tag'></i> ";
						dlStr += 					"<a href='"+v[i].link+"' target='_black' title='"+v[i].name+"'> "+v[i].link+"</a>";
						dlStr +=				"</div>";

						dlStr += 				"<div><span style='color:black;font-weight:bold'>Actual Price : </span><strike><i class='fa fa-inr'></i> "+v[i].actual_price+"</strike></div>";
						dlStr += 				"<div><span style='color:black;font-weight:bold'>Final Price : </span><strong style='color:#049372'><i class='fa fa-inr'></i> "+v[i].final_price+" </strong></div>";
						
						dlStr += 				"<div style='margin-top:20px;'>";
						dlStr += 					"<span class='discount'>"+v[i].discount+" off</span>";
						dlStr += 					"<span class='pull-right'>";

						var likeNameParam = "DealsHub.likeDeal("+i+")";
						dlStr += 						"<button class='btnz like-btn' title='Like' onclick='DealsHub.likeDeal("+i+")'><i class='fa fa-thumbs-up'></i> <span id='likeNameBtn_"+i+"'>"+v[i].likes+"</span></button>";
						dlStr += 					"</span>";
						dlStr += 				"</div>";

						dlStr += 			"</div>";

						dlStr += 		"</div>";

						
						dlStr += 	"</div>"
						dlStr += "</div>";
					}
				});

				this.setPageIdVariables('current_deals', dlStr);
			}
		},
	
		getPageIdVariables : function(id){
			return $("#"+id).text();
		},

		setPageIdVariables : function(id , value){
			$("#"+id).html(value);
		},


	};

	window.DealsHub = DealsHub;
})(jQuery);