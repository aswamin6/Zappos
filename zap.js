var pdt_arr = [];
var flag = 0;
var page = 1;
var giftnum;
var total;

function combine(a, min) 
{
    var all = [];
    for (var i = min; i < a.length; i++) 
	{
		console.log("herell");
        fn(i, a, [], all);
    }
	
    all.push(a);
    return all;
}

function fn(n, src, got, all) 
	{	
		var subsets_total = 0;
		var curr_price = 0;
        if (n == 0) 
		{
            if (got.length > 0) 
			{
                all[all.length] = got;
				console.log(n);
            }
			return;
        }
		
        for (var j = 0; j < src.length; j++) 
		{	
			curr_price = Number(src[j]["price"].replace("$", ""));
			subsets_total += curr_price;
			if(subsets_total <= total)
			{
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
			
			}
			else
			{
			subsets_total = 0;
			curr_price = 0;
			break;
			}
        }
        return;
    }


function init()
{
	giftnum = $("#giftnum").val();
	total = Number($("#total").val());
	$("#myid").html('');
	getdata();
}

function getdata(){
	//if(!flag){
		getjson(page);
		// page++;
	 //} 
	//else {
	
		console.log("here");
		var subsets = combine(pdt_arr, giftnum);
		
	// }
}

function getjson(page){
	
		
	var surl = "http://api.zappos.com/Search?key=52ddafbe3ee659bad97fcce7c53592916a6bfd73&term=&sort={%22price%22:%22asc%22}&page="+page;
	$.ajax({
		url: surl,
		dataType: "jsonp",
		jsonp : "callback",
		jsonpCallback: "jsonpcallback",
		success: function(data){
			//console.log(JSON.stringify(data));
			var json_data = JSON.stringify(data); //json_data contains the json formatted data.
			var a = JSON.parse(json_data);
			var product = a["results"];
			var length = product.length;
			var highprice = Number(product[length-1]["price"].replace("$", ""));
		
			if(highprice <= total)
			{
				for(i=0;i<product.length;i++)
				{
				pdt_arr.push(product[i]);
				}
			} else {
				//var each_pdt = [];
				for(i=0;i<product.length;i++)
				{
					var price = Number(product[i]["price"].replace("$", ""));
					var productid = product[i]["productId"];
					if(price <= total){
						pdt_arr.push(product[i]);
					}
					else{
						flag = 1;
						break;
					}
				}
				//pdt_arr.push(each_pdt);
			}
			//getdata();
		}
	});
}
