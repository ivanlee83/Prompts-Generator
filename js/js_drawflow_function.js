//Global Setting

	//Global Var
	
		//User Inputs
		var webui_url = 'http://127.0.0.1:7860';
		var node_color = ["#8C40DC","#52E0EC","#FFD959","#FA7A27","#3C4CE8","#72D670","#a9e141","#ffccea","#8046d8"];
		
		//Program Global Var
		var node_map_dict = {};
		var node_dict = {};
		var data_list = {};
		var key_down = false;
		var nodeSelected = false;
		var node_connected_to_root = false;
		var status_bar = document.getElementById("status_bar");
		var root_node_id = 1;
		var current_prompts = {};	
	//Global Var
	
	
	//Bootstrap Setting
	const Sava_change_modal = new bootstrap.Modal('#save_change_modal')
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
	//Bootstrap Setting


	//Editor Setting
		//Get Editor
		var id = document.getElementById("drawflow");
		const editor = new Drawflow(id);
		
		editor.start();
		//Editor Event

		editor.on('connectionCreated', function(id) {
			if (is_Connented_to_root(id.input_id)){
				render_root();
			}
		})		

		editor.on('connectionRemoved', function(id) {
		
			if (is_Connented_to_root(id.input_id)){
				render_root();
			}
		})

		editor.on('nodeDataChanged', function(id) {
			
		//	if (is_Connented_to_root(id) ){
		//		render_root();
		//	}
			if ( id == 1 ){
				render_root();
			}
			
		})
		
		editor.on('keydown', function(id) {
			
			if (id.code == "Enter" && nodeSelected == true && node_connected_to_root == true){
				
				render_root();

			}else{

			}
		})

		editor.on('nodeSelected', function(id) {
			
			node_connected_to_root = is_Connented_to_root(id);
			nodeSelected = true;
			
		})
		
		editor.on('nodeUnselected', function(id) {
			
			node_connected_to_root = false;
			nodeSelected = false;
			
			
		})

		editor.on('contextmenu', function(id) {
			if ( nodeSelected == false ){
				console.log('left click');
			}
		})


		//End of Editor Event
	//Editor Setting

//Global Setting

//Load CSV
function open_file(file_id){
	
	e = document.getElementById(file_id);
	
	const input = e.files[0];
    const reader = new FileReader();
	
    reader.onload = function (e) {
		var load_txt = e.target.result;
		
		status_bar.innerText = "CSV file '" + input.name + "' loading...";
		
		load_cvs(load_txt);
		
		status_bar.innerText = "CSV '" + input.name + "' Loaded.";
    };
	
    reader.readAsText(input);
}

function load_cvs(load_txt){
	
	var csv_dict = {};
	
	var split_txt = load_txt.split("\r\n");
	
	var csv_keys = split_txt[0].split(",");
	
	for ( var i = 0; i < csv_keys.length; i++ ){
		csv_dict[csv_keys[i]] = [];
	}
	
	for ( var i = 1; i < split_txt.length; i++ ){
		
		var csv_values = split_txt[i].split(",");
		
		for ( var j = 0; j < csv_keys.length ; j ++ ){
			csv_dict[csv_keys[j]].push(csv_values[j]);
		}
	}

	node_dict = csv_dict;
	
	var menu_nodes = document.getElementById("menu_nodes_sub");
	menu_nodes.innerHTML = "";
	
	for ( var i = 0; i < Object.keys(node_dict).length; i++ ){
		
		var my_keys = Object.keys(node_dict)[i];
		
		menu_nodes.innerHTML += '<li><a class="dropdown-item" href="#" onclick="add_node(' + "'" + my_keys + "'" + ');">&emsp;' + my_keys + '</a></li>';
		
		var tmp_datalist = "";
		
		tmp_datalist += '<datalist id="' + my_keys + '">';
		
		var tmp_arr = node_dict[my_keys];
		
		for ( var j = 0 ; j < tmp_arr.length; j++ ){
			tmp_datalist += '<option value="' + tmp_arr[j] + '">';
		}
		tmp_datalist += '</datalist>';
		document.getElementById('data_list').innerHTML += tmp_datalist;
		
		
	}
	

}

//Add Node Function
function add_root_node(){
	
	var data = { "step": '15', 'cgf':'7' ,"seed":"-1","samplers":""};
	var id2 = "ren_root_img";
	//Output node html code
	var html = '';
	html += '<div>';
	html += '<div class="title-box" style="background:grey;color:white;"><b>Prompts Output</b></div>';

	html += '<div class="box"><img src="./img/image-preview.png" id="' + id2 + '" class="mt-2 mb-3 w-100 rounded rounded-4" ondblclick="new_preview_window(' + "'" + id2 + "'" + ',' + "'root'" + ');">';


	html += '<label for="samplers" class="form-label">Sampling method</label><select class="form-select  mb-2" id="samplers" df-samplers>';
	html += '</select>';

	
	html += '<label for="steps_range" class="form-label">Sampling steps</label><input type="range" class="form-range border-0" min="1" max="50" step="1" df-step>';
	html += '<label for="CFG_range" class="form-label">CFG Scale</label><input type="range" class="form-range border-0" min="1" max="30" step="0.5" df-cgf>';
	html += '<label for="seed" class="form-label">Seed</label><input class="form-control border-0" df-seed value="-1">';
	
	html += '</div></div>';
	//Output node html code
	
	l = ( window.innerWidth/2 ) - 100 ;
	t = ( window.window.innerHeight/2 ) - 250;
	
	editor.addNode('Output', 1, 0, l, t, 'Output', data, html);
	
	get_samplers();
	
}

function add_node(node_name){
	
	var data = { "data": '',"weight":0 };
	var node_class = "node";
	
	var random_id = 'preview_img_' + Math.round((Math.random()*10000));
	var img_id = 'preview_img_' + random_id;
	var input_id = 'node_input' + random_id;
	
	var node_keys = Object.keys(node_dict);
	var node_id = node_keys.indexOf(node_name);
	
	//Output node html code
	var html = '';
	html += '<div>';
	html += '<div class="title-box" style="background:' + node_color[node_id] + ';color:white;"><b>' + node_name + '</b></div>';
	html += '<div class="box">';
	
	if ( node_name != "Custom tags" ){
		html += '<center><img src="./img/image-preview.png" id="' + img_id + '" class="mt-2 mb-3 w-100 rounded rounded-4" ondblclick="new_preview_window(' + "'" + img_id + "',[512,512]" + ')"></center>';
		html += '<input list="'+ node_name + '" class="form-control mb-2" df-data onchange="on_preview_change(' + "'" + img_id + "',this)" + ';" id="' + input_id + '">';
	}else{
		html += '<input list="'+ node_name + '" class="form-control mb-2" df-data>';
	}
	

	//html += '<input list="'+ node_name + '" class="form-control mb-2" df-data onchange="on_preview_change(' + "'" + img_id + "',this)" + ';" id="' + input_id + '">';

	html += '<input type="range" class="form-range border-0" min="0" max="2" step="0.1" df-weight>';
	
	html += '</div></div>';
	//Output node html code

	l = ( window.innerWidth/2 ) - 100 ;
	t = ( window.window.innerHeight/2 ) - 50;
	
	editor.addNode(node_name, 1, 1, l, t, node_class, data, html);
	//console.log(node_dict);
	
	status_bar.innerText = "'" + node_name + "' prompt node " + " created.";
}

function on_preview_change(id,obj){
	
	var render_json = {"steps":5,"prompt":obj.value,"cfg_scale": 7,"seed":-1, "width":512,"height":512 };
	
	render(render_json,id)
}

//UI function
function flow_zoom_in(){
	editor.zoom_in();
}

function flow_zoom_out(){
	editor.zoom_out();

}

function new_preview_window(id,size){
	
	console.log(size);
	if ( size == "root" ){
		size = [512,512];
	}
	
	// set the horizontal center of the popup window the center of the screen.
	var wleft = ( screen.width - size[0] ) / 2;
	// set thevertical center of the popup window the center of the screen.
	var wtop = ( screen.height - size[0] ) / 2;
	
	
	let params = 'directories=no,scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width='+ size[0] +',height=' + size[1] + ',left=' + wleft + ' ,top=' + wtop + '';

	let newWin = window.open('', '', params);

	var img_preview = document.getElementById(id);
	
	newWin.document.write("<title>Preview</title><img src='" + img_preview.src + "' style='position:absolute;Top:0;left:0;width:100%;height:100%' ondblclick='window.parent.close();'></img>");
}

function ui_save_nodes(){
	
	var save_json = editor.export();
	var export_json = encodeURIComponent(JSON.stringify(save_json));
	console.log(export_json);
	window.open('data:text/csv;charset=utf-8,' + export_json);
	
	status_bar.innerText = "Nodes Saved!";
}

function ui_load_nodes(id){
	console.log(id);
	
	e = document.getElementById(id);
	
	const input = e.files[0];
    const reader = new FileReader();
	
	//console.log(input);
	
    reader.onload = function (e) {
		var load_txt = e.target.result;
		
		status_bar.innerText = "CSV file '" + input.name + "' loading...";
		
		var import_json = JSON.parse(load_txt);
		
		editor.import(import_json);
		get_samplers();
		
		status_bar.innerText = "Nodes '" + input.name + "' Loaded.";
    };
	
    reader.readAsText(input);
}

function ui_open(open_type){
	
	if ( open_type == 'load' ){
	
		var node_btn = document.getElementById("loadnodes");
		Sava_change_modal.hide();
		node_btn.click();
		
		
	}else if ( open_type == 'new' ){
		
		Sava_change_modal.hide();
		ui_new();
	}
}

function ui_new(){
	editor.clear();
	add_root_node();
	console.log('new');
}

function set_webui_url(new_url){
	
	webui_url = (new_url);
	
	status_bar.innerText = "WebUI Url changed to '"+ new_url + "'"
}

//Render Function
async function send_2_webui(j_string,url_api) {
	
	payload = j_string;
	
	let url = url_api;
	let data = payload;

	let res = await fetch(url,{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		
		body: JSON.stringify(data),

		});

	if (res.ok) {

		let ret = await res.json();

		return ret

	} else {
		return `HTTP error: ${res.status}`;
	}
}

async function send_2_webui_get(url_api) {
	
	let url = url_api;

	let res = await fetch(url,{
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},

		});

	if (res.ok) {

		let ret = await res.json();

		return ret

	} else {
		return `HTTP error: ${res.status}`;
	}
}


function render(render_json,id){
	
	var ren_img = document.getElementById(id);
	ren_img.src = "./img/Loading_icon.gif";
	var url_api = webui_url + "/sdapi/v1/txt2img";
	
	var s_render_json = {};
	var s_url_api = webui_url + "/sdapi/v1/interrupt";
	
	
	
	status_bar.innerText = "Interrup...";
	
	send_2_webui(s_render_json,s_url_api).then(data => {

		status_bar.innerText = "Generating Image...";
		
		send_2_webui(render_json,url_api).then(data => {

			ren_img.src = "data:image/png;base64, " + data.images[0];
		
			status_bar.innerText = "Generating Image completed!";
		});
		
	});

}

function get_samplers(){
	
	var url_api = webui_url + "/sdapi/v1/samplers";
	
	send_2_webui_get(url_api).then(data => {

		var samplers = document.getElementById("samplers");
		
		samplers.innerHTML = "";
		
		for ( var i = 0; i < data.length; i++ ){
			samplers.innerHTML += '<option value="' + data[i].name + '">' + data[i].name + "</option>";
		
		}
		
	});
}

function stop_render(){
	var s_render_json = {};
	var s_url_api = webui_url + "/sdapi/v1/interrupt";
	
	status_bar.innerText = "Interrup...";
	
	send_2_webui(s_render_json,s_url_api).then(data => {
		status_bar.innerText = "Interruped!";
	
	});
}

function render_root(){
	
	var node_json = editor.export();
	
	var root_node = node_json.drawflow.Home.data[1];
	console.log(root_node)
	get_child_nodes(root_node_id);
	
	var child_keys = Object.keys(node_map_dict);
	
	var prompts = [];
	var negative_prompt = "";
	
	//var order_keys = Object.keys(prompts_order);
	var order_keys = Object.keys(node_dict);
	
	for ( var i = 0; i < order_keys.length; i++ ){
		prompts.push([]);
	}
	
	if ( child_keys.length > 1 ){
		

		
	}else if (child_keys.length == 1){
		
			for ( var j = 0; j < node_map_dict[child_keys[0]][0].length; j++ ){
				var root_node_data = "";
				var n_data = get_node_data(node_map_dict[child_keys[0]][0][j])[0];
				var n_name = get_node_data(node_map_dict[child_keys[0]][0][j])[1];
				var n_order = get_node_data(node_map_dict[child_keys[0]][0][j])[3];
				
				if ( n_name == "Style" ){
					root_node_data += n_data + " Style";
				}else if ( n_name == "Subject" ){
					
					root_node_data += "a " + n_data + " and ";
					
				}else if ( n_name == "Lighting" ){
					
					root_node_data += "under " + n_data + " lighting";
					
				}else{
					root_node_data += n_data + "|";
				}
				
				prompts[n_order].push(root_node_data);
			}
		
	}
	

	var prompts_str = prompts.toString();
	prompts_str = prompts_str.replaceAll(","," ");
	prompts_str = prompts_str.replaceAll("  "," ");

	console.log(prompts_str);
	
	
	var render_json  = {
		  "prompt": prompts_str,
		  "seed": root_node.data.seed,
		  "subseed": -1,
		  "subseed_strength": 0,
		  "seed_resize_from_h": 0,
		  "seed_resize_from_w": 0,
		  "sampler_name":root_node.data.samplers,
		  "batch_size": 1,
		  "n_iter": 1,
		  "steps": root_node.data.step,
		  "cfg_scale": root_node.data.cgf,
		  "width": 512,
		  "height": 512,
		  "negative_prompt": negative_prompt,
		};
	
	current_prompts = render_json;
			
	render(render_json,"ren_root_img");
}

//Nodes Function
function get_input_nodes(id){
	
	var connected_node = [];
	
	var node_json = editor.export();
	var current_node = node_json.drawflow.Home.data[id];
	
	for ( var i = 0 ; i < current_node.inputs.input_1.connections.length; i++){
		connected_node.push(current_node.inputs.input_1.connections[i].node);
	}

	return ( connected_node );
}

function get_node_by_id(id){
	
	var node_json = editor.export();
	var current_node = node_json.drawflow.Home.data[id];

	return current_node;
}

function get_child_nodes(id){
	
	node_map_dict = {};
	
	function loop_node(id){
	
		var current_node = get_node_by_id(id);
		var current_inputs = get_input_nodes(id);
		
		var tmp1 = [];
		if ( current_inputs.length > 0 ){
			var tmp2 = [];
			for ( var i = 0; i < current_inputs.length; i++){
				
				loop_node(current_inputs[i]);
				tmp2.push(current_inputs[i]);
			}
			tmp1.push(tmp2);
		}
		if (current_inputs.length > 0 ){
			node_map_dict[id] = (tmp1);
		}
		
	}
	
	loop_node(id);

}

function is_Connented_to_root(id){
	
	var result = false;
	var child_arr = ["1"];
	
	get_child_nodes(root_node_id);
	
	var root_keys = Object.keys(node_map_dict);
	
	for ( var i = 0; i < root_keys.length; i++ ){
		
		for ( var j = 0 ; j < node_map_dict[root_keys[i]][0].length; j++){
			child_arr.push(node_map_dict[root_keys[i]][0][j]);
		}
	}
	
	
	if ( child_arr.includes(id) ){
		result = true;
	}
	
	return result;
}

function get_node_data(id){
	
	var node = get_node_by_id(id);
	var node_data = node.data.data;
	var node_name = node.name;
	var node_class = node.class;
	var node_order = 0;
	var node_weight = node.data.weight;
	
	var prompts_order = Object.keys(node_dict);
	
	if ( node_weight > 0 ){
		node_data = "(" + node_data + ":" + node_weight + ")";
	}
	
	node_order = prompts_order.indexOf(node_name);
	
	if ( node_class == "node" ){
		return [node_data,node_name,node_class,node_order];
	}

}