async function paste_to_textbox(element_id){
	
	const cliptext = await navigator.clipboard.readText();
	
	var entry_text = document.getElementById(element_id);
	entry_text.value =  cliptext;
}

function add_to_prompts(prompts_status){
	
	add_text_id = "positive_prompts";
	entry_text_id = "entry_positive";
	list_count = "pos_count";
	
	if ( prompts_status == "negative" ){
		add_text_id = "negative_prompts";
		entry_text_id = "entry_negative";
		list_count = "neg_count";
	}
	
	var add_text = document.getElementById(add_text_id);
	var entry_text = document.getElementById(entry_text_id);
	
	entry_text_arr = filter_words(entry_text.value);
	add_text_arr = add_text.value.split("\n");
	
	
	new_text = compare_arr(entry_text_arr,add_text_arr);
	
	document.getElementById(list_count).innerHTML = "Total: " + new_text.length + " record(s)" ;

	new_text = new_text.toString().replaceAll(",","\n");
	
	add_text.value = new_text;
	
}


async function add_to_fromBoard(prompts_status){
	
	add_text_id = "positive_prompts";
	list_count = "pos_count";
	
	const cliptext = await navigator.clipboard.readText();
	
	if ( prompts_status == "negative" ){
		add_text_id = "negative_prompts";
		list_count = "neg_count";
	}
	
	var add_text = document.getElementById(add_text_id);

	
	entry_text_arr = filter_words(cliptext);
	add_text_arr = add_text.value.split("\n");
	
	
	new_text = compare_arr(entry_text_arr,add_text_arr);
	document.getElementById(list_count).innerHTML = "Total: " + new_text.length + " record(s)" ;
	
	new_text = new_text.toString().replaceAll(",","\n");
	
	add_text.value = new_text;
	
}


function compare_arr(entry_text_arr,add_text_arr){
	
	for ( var i = 0; i < entry_text_arr.length; i++ ){
		
		tmp = entry_text_arr[i].trim();
		
		if ( !add_text_arr.includes(tmp) ){
			if ( tmp.length < 30 ){
				add_text_arr.push(tmp);
			}
		}
	}
	//add_text_arr.shift();
	add_text_arr.sort();
	
	return add_text_arr;
}

function filter_words(prompts_entry){
	
	var filter_num = "0123456789";
	var filter_simbol = "©!@#$%^&*()+={}[]:;'./<>?~`\\" + '"';
	
	filter_num = filter_num.split("");
	filter_simbol = filter_simbol.split("");
	
	filter_all_words = filter_num.concat(filter_simbol);
	
	for ( var i = 0 ; i < filter_all_words.length; i++){
		prompts_entry = prompts_entry.replaceAll(filter_all_words[i],"");
	}
	
	prompts_entry = prompts_entry.replaceAll("_"," ");
	prompts_entry = prompts_entry.replaceAll("|",",");
	prompts_entry = prompts_entry.replaceAll("\n",",");
	prompts_entry = prompts_entry.replaceAll("\r","");
	prompts_entry = prompts_entry.replaceAll("\t","");
	prompts_entry = prompts_entry.replaceAll("  ","");
	prompts_entry = prompts_entry.replaceAll("-",",");
	prompts_entry = prompts_entry.replaceAll("–",",");
	
	prompts_entry = prompts_entry.split(',');

	return prompts_entry;
}

function clear_textbox(clear_id){
	
	var clear_text = document.getElementById(clear_id);
	clear_text.value =  "";
	
}

function copy_to_clipboard(text_id){
	
	var copyText = document.getElementById(text_id);
	navigator.clipboard.writeText(copyText.value);
	
}

function save_to_csv(text_id){
	
	var copyText = document.getElementById(text_id);
	window.open('data:text/csv;charset=utf-8,' + copyText.value);
	
}

function load_file(e,element_id){

	const input = e.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
		const text = e.target.result;
        document.getElementById(element_id).value = text;

    };
    reader.readAsText(input);

}