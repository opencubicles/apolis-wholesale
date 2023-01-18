/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
window.customization_event = false;
final_customized_pdp_url = '';
document.addEventListener('variant:changed', function(event) {
  var variant = event.detail.variant;
  var element = document.getElementsByClassName("atc-block");

  if (variant.title == "Add Custom Text" && window.customization_event == false) {	  
    if(element.length)
      element[0].classList.add("sticky-atc");
  }

  if (variant.title == "Leave Blank" || variant.title == "No Embroidery") {
    if(element.length)
      element[0].classList.remove("sticky-atc");
    resetCustomization();
  }

  setTimeout(update_price_atc, 1000);
 
});
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var url_param_customization_text = getParameterByName('customization_text');
var bulk_customizer_product_handle = getParameterByName('product_handle');


window.addEventListener("load", function(){
  if (url_param_customization_text) {
    trigger_customization(url_param_customization_text);
  }  

});

function submitShareForm(event) {

  event.preventDefault();

  _learnq.push(['identify', {
    // Change the line below to dynamically print the user's email.
    '$email' : document.getElementById("share_email").value
  }]);
   // Track presidential elections
  _learnq.push(['track', 'URL Shared', {
    'product_url' : window.final_customized_pdp_url,
    'product_image' : document.getElementById("share_image").src,
  }]);

  document.getElementById("share-form").style.display = "none";
  document.getElementById("share-success-message").style.display = "block";

  
  setTimeout(function(){
    document.getElementById("share-form").style.display = "block";
    document.getElementById("share-success-message").style.display = "none";
}, 4000);

}

if(document.getElementById('share-form'))
  document.getElementById('share-form').addEventListener('submit', submitShareForm);

var share_modal_cta = document.getElementById("share-modal-cta")

if(share_modal_cta) {

  share_modal_cta.addEventListener('click', function(event) {
    var img_elements = document.getElementsByClassName('product-gallery__image');
    var img_element = img_elements[0];
    console.log(img_element);
    document.getElementById("share_image").src = image_url;

  });
}

custom_variant_button = document.querySelector('.block-swatch__radio[value="Add Custom Text"]');

if (custom_variant_button) {
  custom_variant_button.addEventListener('click', function(event) {
    if (window.customization_event == false)
      document.getElementById("customize-modal-element").click();

    window.customization_event = false;
  });
}

document.addEventListener('click', function(event) {
  if (event.target.value == "autodeliver") {
    document.querySelectorAll('.shopify-payment-button')[0].style.display = 'none';
  } else if (event.target.value == "onetime") {
    document.querySelectorAll('.shopify-payment-button')[0].style.display = 'block';
  }
});

document.addEventListener('click', function (event) {
  if (document.querySelector('[data-action="open-filter"]') === event.target) {
    document.querySelector('.layout__section--secondary').classList.remove('hidden-pocket');
  }
}, {capture:true, passive:true});

if (document.querySelector('.layout__section--secondary')) {

  document.querySelector('.layout__section--secondary').addEventListener('click', function (event) {
    document.querySelector('.layout__section--secondary').classList.add('hidden-pocket');
  });
}

function resetCustomization() {

  if (printer_order_number_label_exist) {

    var order_label = "order_number";

    var t = "";

    for (i = 0; i < total_fields; i++) {
      t += "__";
    }

    if (customizer_printer_settings.hasOwnProperty('order_number_prefix')) {
      order_label = customizer_printer_settings['order_number_prefix'] + order_label;
    }

    if (customizer_printer_settings.hasOwnProperty('order_number_suffix')) {
      order_label = order_label + customizer_printer_settings['order_number_suffix'];
    }

    var t_printer = t + order_label;

    console.log(t_printer);

  }

  document.getElementById("customized-words").value = "";

  document.getElementById("customize-modal-element").textContent = "";
  document.getElementById("customized-text").textContent = "";
  var edit_block = document.getElementById("edit-customization-block");
  edit_block.style["display"] = "none";
  var img_elements = document.getElementsByClassName('product-gallery__image');
  var img_element = img_elements[0];

  if (old_product_img_html !== '')
    img_element.parentElement.innerHTML = window.old_product_img_html;

}


var p_images = document.getElementsByClassName("product-gallery__image");

for (var i = 0; i < p_images.length; i++) {

  var p_image = p_images[i];

  p_image.addEventListener("click", function() {
    location.hash = "#product_title";
  });
}


var customizer_modal = document.getElementById('modal-customize-product');

if (typeof customizer_modal != 'undefined' && customizer_modal != null) {
  customizer_modal.addEventListener('modal:closed', function() {
    var words = document.getElementById("customized-words").value;

    if (words == "") {
      resetCustomization();
      var result = document.querySelectorAll(".block-swatch__radio");
      var leave_blank = result[1];
      leave_blank.click();
    }
  });
}

function customizePhrase(event) {
  event.preventDefault();
  var customization_text_array = event.target.getAttribute("data-customization-text").split("|");
  var elmnt = document.getElementById("customized-image");
  elmnt.scrollIntoView()
  for (var i = 1; i <= total_fields; i++) {
    var current_field = document.getElementById("customize-text-" + i);
    if (customization_text_array[i - 1] !== undefined) {
      var char_limit = current_field.maxLength ? current_field.maxLength : 200;
      current_field.value = customization_text_array[i - 1].substr(0, char_limit).trim();
      current_field.classList.add("is-filled");

    } else {
      current_field.value = "";
    }
    updateCustomizedImage();
  }
  
  return;

  var img_elements = document.getElementsByClassName('product-gallery__thumbnail');
  var img_element = img_elements[0];
  
  img_element.click();
  event.preventDefault();
  trigger_customization(event.target.getAttribute("data-customization-text"));
}

// var all_phrases_container = document.querySelector("#order-note");

// if (typeof all_phrases_container != 'undefined' && all_phrases_container != null) {
//   var all_phrases = all_phrases_container.getElementsByTagName("li");

//   for (var i = 0, len = all_phrases.length; i < len; i++) {

//     all_phrases[i].addEventListener("click", function(event) {

//       event.preventDefault();
//       trigger_customization(event.target.getAttribute("data-customization-text"));

//     }, false);

//   }

// }

function trigger_customization(customization_text) {

  window.customization_event = true;

  custom_variant_button.click();
  var customization_text_array = customization_text.split("|");
  var customization_text_array = customization_text.split("__");
  var element = document.getElementsByClassName("atc-block");
  if(element.length)
    element[0].classList.add("sticky-atc");

  for (var i = 1; i <= total_fields; i++) {
    var current_field = document.getElementById("customize-text-" + i);
    if (customization_text_array[i - 1] !== undefined) {
      var char_limit = current_field.maxLength ? current_field.maxLength : 200;
      current_field.value = customization_text_array[i - 1].substr(0, char_limit);
      current_field.classList.add("is-filled");

    } else {
      current_field.value = "";
    }

    updateCustomizedImage();
  }

  saveCustomization();
}




okeReviewsWidgetOnInit = function() {
  var stars = document.querySelectorAll(".js-okeReviews-reviewsSummary")
  stars.forEach(function(element){
    var count_reviews = element.parentNode.parentNode.dataset.reviews;
    
    element.querySelector('.okeReviews-reviewsSummary-ratingCount').innerText = element.querySelector('.okeReviews-a11yText').innerText.split(" ")[1] + " Stars ("+count_reviews+ " Reviews)";
    element.querySelector('.okeReviews-reviewsSummary-ratingCount').style.display = "inline-block";
  });
}


var top_phrases_head = document.getElementById("top-phrases-head");

if(top_phrases_head) {
  top_phrases_head.addEventListener("click", function(event) {
    var element = document.getElementById("top-phrases-main");
    var element2 = document.getElementsByClassName("atc-block");

    console.log(document.getElementById("order-note").getAttribute("aria-hidden"));
    
    if(document.getElementById("order-note").getAttribute("aria-hidden") == "true") {
     
      element.classList.add("open-popup");   
      element2[0].classList.add("sticky-atc");
      window.scrollTo(0, 130);
    }
    else {
      element2[0].classList.remove("sticky-atc");
      element.classList.remove("open-popup");
    }
    
    // aria-hidden order-note false true
    
   // var elmnt = document.getElementsByClassName("image-text-top-left");
   // elmnt[0].scrollIntoView();

  });

}

var p_qty_inputs = document.getElementsByClassName("product-form__quantity");

if (p_qty_inputs.length) {
  p_qty_inputs[0].addEventListener('change', function() {
   update_price_atc();
  });
}

function update_price_atc() {
  var qty_selector = document.getElementsByClassName("product-form__quantity")[0];
  var qty = qty_selector.value;

  var price_elems = document.getElementById("price--titlerow").getElementsByClassName("money");  

  var number = Number(price_elems[0].innerText.replace(/[^0-9.-]+/g,""));
  var final_price = qty*number;
  var customized_tag_id = document.getElementById("customized-text-tag");
  if(customized_tag_id && customized_tag_id.textContent) {
    final_price += qty*18;
  }
  var atc_block_class = document.getElementsByClassName("atc-block");

  var atc_block = document.getElementsByClassName("atc-block")[0];

  if (atc_block && !document.querySelectorAll(".block-swatch__radio")[0].checked) {

    var atc_button = atc_block.getElementsByClassName('product-form__add-button')[0];

    if (atc_button) {
      try {
        atc_button.innerHTML = "Add to cart &bull; " + Currency.formatMoney(final_price * 100, window.theme.moneyFormat);
      }
      catch (e) {
        console.trace('ATC button currency failed', atc_block, atc_button, Currency, final_price, window.theme.moneyFormat);
      }
  
    }

  }


}


// var bulk_customizer_link = document.getElementById("bulk-customizer");

// if (bulk_customizer_link) {
//   bulk_customizer_link.addEventListener("click", function (event) {
//     event.preventDefault();
//     var final_url =
//       bulk_customizer_link.href +
//       "&customizer_base_url=" +
//       btoa(window.customized_url) + "&force_caps="+force_caps + "&force_lower_caps="+force_lower_caps;
//     window.location.href = final_url;
//   });
// }