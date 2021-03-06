var pdt_arr = []; //product array which stores all the products with price lesser than desired total 
var page = 1;	//page number to navigate through search results
var giftnum;	//desired # of products
var total;		//desired total
var flag = 0;

/* 
function to  generate combination of products based on desired total and number of products
*/

function combine(a, min, subsets_total) 
{
    var all = [];
    for (var i = min; i < a.length; i++) 
	{
        fn(i, a, [], all, subsets_total);
    }
    return all;
}

// Function to generate subsets from selected products 


function fn(n, src, got, all, subsets_total) 
{	
	if (n == 0) 
	{
		if (got.length > 0) 
		{
			all[all.length] = got;
		}
		return;
	}
	
	for (var j = 0; j < src.length; j++) 
	{	
		var curr_price = Number(src[j]["price"].replace("$", ""));
		subsets_total += curr_price;	
		if(subsets_total <= total){
			fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all, subsets_total);		//different products with lesser difference is cost are considered
		} else {
			subsets_total = 0;
			break;
		}
	}
	return;
}

/*init funtion to get input from the user */

function init()
{
	giftnum = Number($("#giftnum").val());
	total = Number($("#total").val());
	$("#myid").html('').append("Please wait...the best combinations are being hand picked for you...");
	getdata();
}

// function to get the data from the Zappos API page and display the selected combination of product subsets with limited fields 

function getdata(){
	
	if(!flag){
		getjson(page);
		page++;
	 } 
	else {
	var subsets = combine(pdt_arr, giftnum, 0);
	
		for(var i=0; i < subsets.length; i++)
		{	
			for(var j = 0; j < subsets[i].length; j++){
				var htmlstr = "Id:" + subsets[i][j]["productId"] + " Product Name: "+ subsets[i][j]["productName"] + " = " + subsets[i][j]["price"]+"<br>";
				$("#myid").append(htmlstr);
			}
			$("#myid").append("<br><br>");
		}
	}
}

/* function to retrieve the JSON objects from the zappos product API 
   Step 1: Get the API product data from the URL page by page
   Step 2: Convert the JSON objects to an array list (array of arrays)
   Step 3: Now filter only the productID and the price from the JSON objects 
   Step 4: Push the elements of the array list (source:JSON object) if their price is lesser than the input desired total 
*/

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
				for(i=0;i<product.length;i++)
				{
					var price = Number(product[i]["price"].replace("$", ""));
					var productid = product[i]["productId"];
					if(price <= total){
						pdt_arr.push(product[i]);
					}
					else{
						$("#myid").html('');
						flag = 1;
						break;
					}
				}
			}
			getdata();			
		}
	});
}
