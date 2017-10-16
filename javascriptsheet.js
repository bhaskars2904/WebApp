jsonTable = [[],[],[]]; 
var jsonMenu = [
{"id":"0", "name":"Crusty Garlic Focaccia with Melted Cheese", "price":"105"},
{"id":"1", "name":"French Fries", "price":"105"},
{"id":"2", "name":"Home Country Fries with Herbs and chill Flakes", "price":"105"},
{"id":"3", "name":"French Fries with Cheese and Jalapenos", "price":"135"},
{"id":"4", "name":"Chicken and Cheese Burger", "price":"150"},
{"id":"5", "name":"Veggie 9 Burger", "price":"150"}];

var table = document.getElementsByClassName('tables');
var menu = document.getElementsByClassName('menus');

for (var i = 0; i < menu.length; i++) {
    var item = menu[i];
    item.setAttribute("draggable", "true");
    item.addEventListener('dragstart', onDrag, false);
    item.addEventListener('dragend', function(e){e.target.style.backgroundColor = "";}, false);
}

function onDrag(event){
	event.dataTransfer.setData('text', event.target.id);
	event.target.style.backgroundColor = '#F8F3D2';
}

for(var i=0; i<table.length; i++){
	var order = table[i];
	order.addEventListener('dragenter', function(){}, false);
	order.addEventListener('dragover', onDragOver, false);
	order.addEventListener('dragleave', function(){}, false);
	order.addEventListener('drop', onDrop, false);
}

function onDragOver(event){
	event.preventDefault();
	event.stopPropagation();
}

function onDrop(event){
	var rtrv = event.dataTransfer.getData('text');
	event.preventDefault();
	event.stopPropagation();
	var itemIdString = event.dataTransfer.getData('text');
    var itemId = itemIdString.substring(2);
    var tableIdString = event.target.id;
    var tableId = tableIdString.substring(2);
    addItem(tableId, itemId);
    updateTable(tableId);
}

function addItem(tableId, itemid){
	var tableLength = jsonTable[tableId].length;	
	if(jsonTable[tableId].length!==0){
		for(var i=0; i<jsonTable[tableId].length; i++){
			if(jsonTable[tableId][i].id===itemid){
				jsonTable[tableId][i].quantity++;
				break;
			}
			else if(i===tableLength-1){
				var itemName;
				var itemPrice;
				var itemQuantity = 1;
				for(var cell in jsonMenu){
					if(jsonMenu[cell].id===itemid){
						itemName = jsonMenu[cell].name;
						itemPrice = jsonMenu[cell].price;
					}
				}
				var jsonString = "{\"id\":\""+itemid+"\",\"name\":\""+itemName+"\",\"price\":\""+itemPrice+"\",\"quantity\":\""+itemQuantity+"\"}";
				var jsonObj = JSON.parse(jsonString);
				jsonTable[tableId].splice(jsonTable[tableId].length,0,jsonObj);	
				break;
			}
		}
	}	
	else{
		var itemName;
		var itemPrice;
		var itemQuantity = 1;
		for(var cell in jsonMenu){
			if(jsonMenu[cell].id===itemid){
				itemName = jsonMenu[cell].name;
				itemPrice = jsonMenu[cell].price;
			}
		}
		var jsonString = "{\"id\":\""+itemid+"\",\"name\":\""+itemName+"\",\"price\":\""+itemPrice+"\",\"quantity\":\""+itemQuantity+"\"}";
		var jsonObj = JSON.parse(jsonString);
		jsonTable[tableId].splice(itemid,0,jsonObj);
	}
}

function updateTable(tableId){
	var tablePrice = 0;
	var tableItems = 0;
	
	table[tableId].getElementsByTagName('span')[0].innerHTML = "";
	for(var cell in jsonTable[tableId]){		
		tablePrice += parseInt(jsonTable[tableId][cell].quantity)*parseInt(jsonTable[tableId][cell].price);
		tableItems += parseInt(jsonTable[tableId][cell].quantity);		
	}
	table[tableId].getElementsByTagName('span')[0].innerHTML = "Rs."+tablePrice+" | Total Items:"+tableItems;	
}

function searchTable(){
	var searchInputTable = document.getElementById('sec1').getElementsByTagName('input')[0];
	var filter = searchInputTable.value.toUpperCase();
	
	for(var i=0; i<table.length; i++){
		var tableHeader = table[i].getElementsByTagName('h2')[0];
		
		if(tableHeader.innerHTML.toUpperCase().indexOf(filter) > -1){
			table[i].style.display = "";
		}
		else{
			table[i].style.display = 'none';
		}
	}
}

function searchMenu(){
	var searchInputMenu = document.getElementById('sec2').getElementsByTagName('input')[0];
	var filter = searchInputMenu.value.toUpperCase();

	for(var i=0; i<menu.length; i++){
		var menuHeader = menu[i].getElementsByTagName('h2')[0];

		if(menuHeader.innerHTML.toUpperCase().indexOf(filter) > -1){
			menu[i].style.display = "";
		}
		else{
			menu[i].style.display = 'none';
		}
	}
}

//Modal JS

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var modalTable= document.getElementsByTagName('table')[0];
for(var i=0; i<table.length; i++){
		table[i].addEventListener('click',function(e) {
	    modal.style.display = "block";
	    populateModal(e.target.id.substring(2));
	});
}

var cloned = modalTable.getElementsByTagName('tr')[0].cloneNode('true');

function populateModal(tableId){
	var tablenum = parseInt(tableId)+1;
	modal.getElementsByTagName('h2')[0].innerHTML = "Table-"+tablenum+" | Order Details";
	modal.getElementsByClassName('modal-footer')[0].getElementsByTagName('span')[0].id='mf'+tableId;
	var rows = modalTable.getElementsByTagName('tr');
	var rowsLength = rows.length;
	document.getElementsByClassName('modal-footer')[0].style.display = '';
	while(rowsLength--){
		if(rows[rowsLength].style.display!=='none')
		modalTable.removeChild(rows[rowsLength]);
	}
	
	for(var i=0; i<jsonTable[tableId].length; i++){
		var clone = document.createElement('tr');
		clone.innerHTML = cloned.innerHTML;
		clone.setAttribute('id', 'rw'+jsonTable[tableId][i].id);
		var cellsTable = clone.getElementsByTagName('td');
		cellsTable[1].innerHTML = jsonTable[tableId][i].name;
		cellsTable[2].innerHTML = jsonTable[tableId][i].price;
		clone.getElementsByTagName('input')[0].value = jsonTable[tableId][i].quantity;
		clone.getElementsByTagName('i')[0].addEventListener('click', function(e){
			jsonTable[tableId].splice(jsonTable[tableId][e.target.parentNode.parentNode.id],1,);
			populateModal(tableId);
			updateTable(tableId);
		});
		clone.style.display = "";
		modalTable.appendChild(clone);
	}

	span.onclick = function() {
	var modalRows = modal.getElementsByTagName('tr');
	for(var i=0; i<modalRows.length; i++){
		if(modalRows[i].style.display==='none')
				continue;
		else{
				for(var j=0; j<jsonTable[tableId].length; j++){
					if(jsonTable[tableId][j].id===modalRows[i].id.substring(2)){
						jsonTable[tableId][j].quantity = modalRows[i].getElementsByTagName('input')[0].value;
						break;
					}
				}
				updateTable(tableId);				
			}
		}
	    modal.style.display = "none";
	}

	window.onclick = function(event) {
	    if (event.target == modal) {
	    	var modalRows = modal.getElementsByTagName('tr');
		for(var i=0; i<modalRows.length; i++){
			if(modalRows[i].style.display==='none')
					continue;
			else{
					for(var j=0; j<jsonTable[tableId].length; j++){
						if(jsonTable[tableId][j].id===modalRows[i].id.substring(2)){
							jsonTable[tableId][j].quantity = modalRows[i].getElementsByTagName('input')[0].value;
							break;
						}
					}
					updateTable(tableId);				
				}
			}
	        modal.style.display = "none";
	    }
	}
	//calculating price of table's items
	modal.getElementsByTagName('h3')[1].innerHTML="";
	var tablePrice = 0;
	for(var cell in jsonTable[tableId]){
		tablePrice += parseInt(jsonTable[tableId][cell].quantity)*parseInt(jsonTable[tableId][cell].price);
	}
	modal.getElementsByTagName('h3')[1].innerHTML=tablePrice;
	
}

modal.getElementsByClassName('modal-footer')[0].getElementsByTagName('span')[0].addEventListener('click', function(e){				
		var tableId = e.target.id.substring(2);
		var modalRows = modal.getElementsByTagName('tr');
		for(var i=0; i<modalRows.length; i++){
			if(modalRows[i].style.display==='none')
					continue;
			else{	
					for(var j=0; j<jsonTable[tableId].length; j++){
						if(jsonTable[tableId][j].id===modalRows[i].id.substring(2)){
							jsonTable[tableId][j].quantity = modalRows[i].getElementsByTagName('input')[0].value;
							break;
						}
					}
									
			}
		}
		populateModal(tableId);
		var tabnum = parseInt(tableId)+1;
		modal.getElementsByTagName('h2')[0].innerHTML = 'Table:'+tabnum+" | Bill Details";
		var rows = modalTable.getElementsByTagName('tr');
		var rowsLength = rows.length;
		while(rowsLength--){
			if(rows[rowsLength].style.display!=='none')
			modalTable.removeChild(rows[rowsLength]);
		}
		
		for(var i=0; i<jsonTable[tableId].length; i++){
			var clone = document.createElement('tr');
			clone.innerHTML = cloned.innerHTML;
			var cellsTable = clone.getElementsByTagName('td');
			cellsTable[1].innerHTML = jsonTable[tableId][i].name;
			cellsTable[2].innerHTML = jsonTable[tableId][i].price;
			cellsTable[3].innerHTML = jsonTable[tableId][i].quantity+' qty.';
			cellsTable[4].innerHTML = "";
			clone.style.display = "";
			modalTable.appendChild(clone);
		}
		document.getElementsByClassName('modal-footer')[0].style.display = 'none';
		span.onclick = function(){
			var tablen = jsonTable[tableId].length;
			while(tablen--){
				jsonTable[tableId].splice(tablen,1,);
			}
			
			updateTable(tableId);
			modal.style.display = 'none';
		}
		window.onclick = function(event) {
		    if (event.target == modal) {
		    	var tablen = jsonTable[tableId].length;
				while(tablen--){
					jsonTable[tableId].splice(tablen,1,);
				}
				
				updateTable(tableId);
		        modal.style.display = "none";
		    }
		}   	
	});

