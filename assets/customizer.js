var old_product_img_html = '';
// if sandbox replace the url with https://tuvd1ov9o6.execute-api.us-west-1.amazonaws.com/customizer/customizer-sandbox

var printer_order_number_label_exist = typeof(customizer_printer_settings) == 'object' && customizer_printer_settings.hasOwnProperty('order_number_label_exist') && customizer_printer_settings['order_number_label_exist'] == '1' ? true : false;

// console.log("customizer_printer_settings", customizer_printer_settings);
// console.log("printer_order_number_label_exist", printer_order_number_label_exist);

for (var customizer_settings_key in customizer_settings) {

  if (customizer_settings.hasOwnProperty(customizer_settings_key)) {

    var append_key = "" == query_string ? '' : '&';

    query_string +=
      append_key +
      customizer_settings_key +
      "=" +
      encodeURIComponent(customizer_settings[customizer_settings_key]);
  }

}



document.getElementById("customized-image").src = customizer_settings.img_url;
window.customized_url = customizer_base_url + query_string;

var printer_query_string = "";

var keys_array = ['angle', 'img_url'];

for (var customizer_printer_settings_key in customizer_printer_settings) {
  if (customizer_printer_settings_key != 'img_url' && customizer_printer_settings.hasOwnProperty(customizer_printer_settings_key) && (customizer_printer_settings_key.indexOf("order_number") < 0)) {

    var customizer_printer_settings_val = customizer_printer_settings[customizer_printer_settings_key];

    var append_key = "" == printer_query_string ? '' : '&';

    if (printer_order_number_label_exist && !keys_array.includes(customizer_printer_settings_key)) {

      if (customizer_printer_settings.hasOwnProperty("order_number_" + customizer_printer_settings_key)) {
        customizer_printer_settings_val += "__" + customizer_printer_settings["order_number_" + customizer_printer_settings_key];
      } else {
        customizer_printer_settings_val += "__" + customizer_printer_settings_val.split("__").pop();
      }
    }
    printer_query_string += append_key +
      customizer_printer_settings_key +
      "=" +
      customizer_printer_settings_val;
  }
}

window.printer_customized_url = customizer_base_url + printer_query_string;
var i = 0,
  input_customize_text = [];

for (i = 1; i <= total_fields; i++) {
  var current_field = document.getElementById("customize-text-" + i);

  if ("yes" == force_caps) {
    current_field.style["text-transform"] = "uppercase";
  } else if ("yes" == force_lower_caps) {
    current_field.style["text-transform"] = "lowercase";
  }

  current_field.addEventListener("input", updateCustomizedImage);
}

if (document.getElementById('customize-heart')) {
  document.getElementById('customize-heart').addEventListener("input", updateCustomizedImage);
}

var slides = document.getElementsByClassName("block-swatch__radio");
for (var i = 0; i < slides.length; i++) {
  var ele = slides.item(i);
  if (i == 0) {
    ele.click();
  }
}



function updateCustomizedImage(e = '') {
  window.printer_final_customized_url = "";
  var all_empty = true;
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  var special_char_el = document.getElementById("special-char-message");
  var t = "";
  for (i = 1; i <= total_fields; i++) {
    var k = i - 1;
    var input_val = document.getElementById("customize-text-" + i).value;

    if (input_val.match(regex)) {

      document.getElementById("customize-text-" + i).value = input_val.replace(regex, '');
      special_char_el.style.display = "block";
      special_char_el.textContent = "Some of the characters you entered are not supported and have been removed.";
      setTimeout(function() {
        special_char_el.style.display = "none";
      }, 5000);
    }
    input_val = document.getElementById("customize-text-" + i).value;

    if (input_val) {
      all_empty = false;
    }
    t = i == 1 ? input_val : t + "__" + input_val;
    if (force_caps == "yes") {

      customized_words[k] = input_val.toUpperCase();
      t = t.toUpperCase();
    } else if (force_lower_caps == "yes") {

      customized_words[k] = input_val.toLowerCase();
      t = t.toLowerCase();
    } else {
      customized_words[k] = input_val;
    }
  }

  if (document.getElementById('customize-heart')) {
    if (document.getElementById('customize-heart').checked) {
      customized_words[total_fields] = document.getElementById('customize-heart').value;
      t += '__' + document.getElementById('customize-heart').value;
      all_empty = false;
    } else {
      customized_words[total_fields] = '';
      customized_words.pop();
    }
  }

  if (all_empty) {
    document.getElementById("customized-image").src = customizer_settings.img_url;
    return;
  }

  image_url = window.customized_url + "&words=" + btoa(unescape(encodeURIComponent(t.replace('__~heart~', ''))));

  if (printer_order_number_label_exist) {

    var order_label = "order_number";

    if (customizer_printer_settings.hasOwnProperty('order_number_prefix')) {
      order_label = customizer_printer_settings['order_number_prefix'] + order_label;
    }

    if (customizer_printer_settings.hasOwnProperty('order_number_suffix')) {
      order_label = order_label + customizer_printer_settings['order_number_suffix'];
    }

    var t_printer = t + "__" + order_label;
  } else {
    var t_printer = t;
  }

  t_printer = t_printer.replace('♥', '');

  console.log('t_printer', t_printer);

  window.printer_final_customized_url = window.printer_customized_url + "&words=" + btoa(unescape(encodeURIComponent(t_printer)));
  document.getElementById("customized-image").src = image_url;

  var s = setInterval(function() {
    var e = document.getElementById("customized-image");
    e.complete && 0 !== e.naturalHeight ?
      (clearInterval(s),
        (document.getElementById("image-loader").style.display = "none")) :
      (document.getElementById("image-loader").style.display = "inline-block");
  }, 1e3);
}


function saveCustomization(customized_words_input = '') {

  if (customized_words_input) {
    customized_words = customized_words_input;

    image_url = window.customized_url + "&words=" + btoa(unescape(encodeURIComponent(customized_words.join('__'))));

  } else {
    image_url = document.getElementById("customized-image").src;
  }

  if (!customized_words.join('').length) {
    // Submitted blank fields.
    const lb_button = document.querySelector('.block-swatch__radio[value="Leave Blank"]');
    if (lb_button) {
      lb_button.checked = true;
    }

    const ne_button = document.querySelector('.block-swatch__radio[value="No Embroidery"]');
    if (ne_button) {
      ne_button.checked = true;
    }

    resetCustomization();
    return;
  }

  if (window.printer_final_customized_url) {
    for (var i = 0; i < printer_img_urls.length; i++) {
      var final_printer_url = window.printer_final_customized_url + "&img_url=" + printer_img_urls[i];
      console.log("Printer URL", i, final_printer_url);
    }
  }

  document.getElementById("customize-modal-element").textContent = "Edit";
  document.getElementById("customized-text").textContent = "Your text: " + customized_words.join("  ").replace('~heart~', '♥');
  var customized_words_val = customized_words.join(" | ").replace(' ♥', '♥').replace('♥', ' | ~heart~');
  var customized_words_cart_item = "Your text: " + customized_words_val; //.replace(' | ~heart~', ' | heart');
  window.final_customized_pdp_url = window.location.href + "&customization_text=" + encodeURI(customized_words_val);

  document.getElementById("customized-words").value = customized_words_cart_item;

  console.log('customized_words', customized_words, customized_words_cart_item);

  localStorage.setItem("cart-item-link-" + meta.product.id + "-" + btoa(unescape(encodeURIComponent(customized_words_cart_item))), image_url);

  var edit_block = document.getElementById("edit-customization-block");
  edit_block.style["display"] =
    "block";

  var img_elements = document.getElementsByClassName('product-gallery__image');
  var img_element = img_elements[0];
  if (old_product_img_html == '') {
    old_product_img_html = img_element.parentElement.innerHTML;
  }
  img_element.parentElement.innerHTML = '<img class="product-gallery__image" src="' + image_url + '" />';

//   var img_elements = document.getElementsByClassName('product-gallery__thumbnail');
//   var img_element = img_elements[0];
  
//   img_element.click();


}

function build_base_url(params) {
  for (var customizer_settings_key in params) {
	var query_string = "";
    if (params.hasOwnProperty(customizer_settings_key)) {

      var append_key = "" == query_string ? '' : '&';

      query_string +=
        append_key +
        customizer_settings_key +
        "=" +
        encodeURIComponent(params[customizer_settings_key]);
    }

  }
  
  return customizer_base_url + query_string;

}

function get_customizer_printer_url(tag) {
  var printer_query_string = "";

  var customizer_printer_settings = customizer_fields[tag].customizer_printer;

  var printer_order_number_label_exist =
    typeof customizer_printer_settings == "object" &&
    customizer_printer_settings.hasOwnProperty("order_number_label_exist") &&
    customizer_printer_settings["order_number_label_exist"] == "1"
      ? true
      : false;

  var keys_array = ["angle", "img_url"];

  for (var customizer_printer_settings_key in customizer_printer_settings) {
    if (
      customizer_printer_settings_key != "img_url" &&
      customizer_printer_settings.hasOwnProperty(
        customizer_printer_settings_key
      ) &&
      customizer_printer_settings_key.indexOf("order_number") < 0
    ) {
      var customizer_printer_settings_val =
        customizer_printer_settings[customizer_printer_settings_key];

      var append_key = "" == printer_query_string ? "" : "&";

      if (
        printer_order_number_label_exist &&
        !keys_array.includes(customizer_printer_settings_key)
      ) {
        if (
          customizer_printer_settings.hasOwnProperty(
            "order_number_" + customizer_printer_settings_key
          )
        ) {
          customizer_printer_settings_val +=
            "__" +
            customizer_printer_settings[
              "order_number_" + customizer_printer_settings_key
            ];
        } else {
          customizer_printer_settings_val +=
            "__" + customizer_printer_settings_val.split("__").pop();
        }
      }
      printer_query_string +=
        append_key +
        customizer_printer_settings_key +
        "=" +
        customizer_printer_settings_val;
    }
  }

  return customizer_base_url + printer_query_string;
}

function get_customizer_web_url(tag) {
  var customizer_settings = customizer_fields[tag].customizer_web;
  var query_string = "";
  for (var customizer_settings_key in customizer_settings) {
    if (customizer_settings.hasOwnProperty(customizer_settings_key)) {
      var append_key = "" == query_string ? "" : "&";

      query_string +=
        append_key +
        customizer_settings_key +
        "=" +
        encodeURIComponent(customizer_settings[customizer_settings_key]);
    }
  }

  return customizer_base_url + query_string;
}

function updateCustomizedImageTag(e = "") {
  var tag = "tag";
  var tag_suffix = "-tag";
  var params = getCustomizedParams("tag");
  var img_loader = document.getElementById("image-loader" + tag_suffix);
  var customized_img_id = document.getElementById(
    "customized-image" + tag_suffix
  );

  var s = setInterval(function () {
    var e = customized_img_id;
    e.complete && 0 !== e.naturalHeight
      ? (clearInterval(s), (img_loader.style.display = "none"))
      : (img_loader.style.display = "inline-block");
  }, 1e3);

  customized_img_id.src = params.img_url;
}

function getCustomizedParams(tag) {
  var tag = "tag";
  var tag_suffix = "-" + tag;
  var customized_words = [];

  var special_char_el = document.getElementById(
    "special-char-message" + tag_suffix
  );
  var heart_ele = document.getElementById("customize-heart") + tag_suffix;
  var customized_img_id = document.getElementById(
    "customized-image" + tag_suffix
  );

  var img_loader = document.getElementById("image-loader" + tag_suffix);

  var printer_customized_url = get_customizer_printer_url("tag");
  var web_customized_url = get_customizer_web_url("tag");
  var total_fields = customizer_fields[tag].total_fields;
  var force_caps = customizer_fields[tag].force_caps;
  var printer_order_number_label_exist =
    typeof customizer_printer_settings == "object" &&
    customizer_printer_settings.hasOwnProperty("order_number_label_exist") &&
    customizer_printer_settings["order_number_label_exist"] == "1"
      ? true
      : false;

  var customizer_settings = customizer_fields[tag].customizer_web;

  var printer_final_customized_url = ""; //toDo
  var all_empty = true;
  var regex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  var t = "";
  for (i = 1; i <= total_fields; i++) {
    var k = i - 1;
    var input_val = document.getElementById(
      "customize-text-" + i + tag_suffix
    ).value;

    if (input_val.match(regex)) {
      document.getElementById("customize-text-" + i + tag_suffix).value =
        input_val.replace(regex, "");
      special_char_el.style.display = "block";
      special_char_el.textContent =
        "Some of the characters you entered are not supported and have been removed.";
      setTimeout(function () {
        special_char_el.style.display = "none";
      }, 5000);
    }
    input_val = document.getElementById(
      "customize-text-" + i + tag_suffix
    ).value;

    if (input_val) {
      all_empty = false;
    }
    t = i == 1 ? input_val : t + "__" + input_val;
    if (force_caps == "yes") {
      customized_words[k] = input_val.toUpperCase();
      t = t.toUpperCase();
    } else if (force_lower_caps == "yes") {
      customized_words[k] = input_val.toLowerCase();
      t = t.toLowerCase();
    } else {
      customized_words[k] = input_val;
    }
  }

  if (heart_ele) {
    if (heart_ele.checked) {
      customized_words[total_fields] = heart_ele.value;
      t += "__" + heart_ele.value;
      all_empty = false;
    } else {
      customized_words[total_fields] = "";
      customized_words.pop();
    }
  }

  if (all_empty) {
    customized_img_id.src = customizer_settings.img_url;
    return;
  }

  var image_url =
    web_customized_url +
    "&words=" +
    btoa(unescape(encodeURIComponent(t.replace("__~heart~", ""))));

  if (printer_order_number_label_exist) {
    var order_label = "order_number";

    if (customizer_printer_settings.hasOwnProperty("order_number_prefix")) {
      order_label =
        customizer_printer_settings["order_number_prefix"] + order_label;
    }

    if (customizer_printer_settings.hasOwnProperty("order_number_suffix")) {
      order_label =
        order_label + customizer_printer_settings["order_number_suffix"];
    }

    var t_printer = t + "__" + order_label;
  } else {
    var t_printer = t;
  }

  t_printer = t_printer.replace("♥", "");

  console.log("t_printer", t_printer);

  printer_final_customized_url =
    printer_customized_url +
    "&words=" +
    btoa(unescape(encodeURIComponent(t_printer)));
  console.log(printer_customized_url);

  return { customized_words: customized_words, img_url: image_url };
}
var remove_tag_ele = document.getElementById("customize-tag-remove");
if(remove_tag_ele)
  remove_tag_ele.addEventListener("click", removeTagCustomization);
function removeTagCustomization(e) {
  e.preventDefault();
  document.getElementById("customize-modal-element-tag").textContent = "Edit";
  document.getElementById("customized-text-tag").textContent = "";
  var edit_block = document.getElementById("edit-customization-block-tag");
  edit_block.style["display"] = "none";
  var element = document.getElementById("customize-product-tag-block");
  element.classList.remove("tag-added");
  setTimeout(update_price_atc, 1000);
}

function saveTagCustomization() {
  var params = getCustomizedParams("tag");

  document.getElementById("customize-modal-element-tag").textContent = "Edit";
  document.getElementById("customized-text-tag").textContent =
    "Your text: " + params.customized_words.join("  ").replace("~heart~", "♥");
  var edit_block = document.getElementById("edit-customization-block-tag");
  edit_block.style["display"] = "block";
  var element = document.getElementById("customize-product-tag-block");
  element.classList.add("tag-added");
  setTimeout(update_price_atc, 1000);
}