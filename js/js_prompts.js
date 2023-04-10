function load_prompts(e){
	
	const input = e.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
		var load_txt = e.target.result;
		load_txt = load_txt.split('\n');
		
		for ( var i=0;i<load_txt.length;i++){
			document.getElementById("prompts_entry_datalist").innerHTML += '<option value="' + load_txt[i] + '">';
		}
        

    };
    reader.readAsText(input);
	

}

function add_prompts(t,e){
	
	if (e.key === '-'){
		alert('hi');
	}
	
	if (e.keyCode == 13){
	
		var new_prompt = t.value;
		var prompts = document.getElementById("prompts_node");
		
		const node = document.createElement('span');
		const textnode = document.createTextNode(new_prompt);
		node.appendChild(textnode);
		node.className = 'badge text-bg-primary ms-1 me-1 mt-1 mb-1';
		prompts.appendChild(node);
		
		
		//prompts.innerHTML += '<span class="badge text-bg-primary">' + new_prompt + '</span>';
		
		//Clear Prompt
		t.value = "";
	}
}