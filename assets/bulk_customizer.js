var bulk_customizer_product_handle = getParameterByName("product_handle");
var bulk_customizer = {};
var bulk_customizer_ele = document.getElementById("bulk-customizer-main");
var force_caps =
  allProductsMetafields[bulk_customizer_product_handle]["force_caps"] == null
    ? "yes"
    : allProductsMetafields[bulk_customizer_product_handle]["force_caps"];
var total_lines =
  allProductsMetafields[bulk_customizer_product_handle]["total_fields"];

var char_limits =
  allProductsMetafields[bulk_customizer_product_handle][
    "character_limit"
  ].split("__");

console.log(char_limits);

var customizer_settings =
  allProductsMetafields[bulk_customizer_product_handle]["customizer_settings"];

if (allProductsMetafields[bulk_customizer_product_handle]["tag_product"] == 1) {
  var tag_params = {
    variant_id: allProductsMetafields[bulk_customizer_product_handle]["tag_variant"],
     variant_price: allProductsMetafields[bulk_customizer_product_handle]["tag_variant_price"],
    force_caps:
      allProductsMetafields[bulk_customizer_product_handle]["tag_force_caps"] ==
      null
        ? "yes"
        : allProductsMetafields[bulk_customizer_product_handle][
            "tag_force_caps"
          ],
    total_lines:
      allProductsMetafields[bulk_customizer_product_handle]["tag_total_fields"],
    char_limits: allProductsMetafields[bulk_customizer_product_handle][
      "tag_character_limit"
    ]
      .toString()
      .split("__"),
    customizer_settings:
      allProductsMetafields[bulk_customizer_product_handle][
        "tag_customizer_settings"
      ],
  };
} else {
  var tag_params = false;
}

var is_flickity = false;
var bulk_flickity = "";

var customizer_base_url =
  "https://tuvd1ov9o6.execute-api.us-west-1.amazonaws.com/customizer/customizer-prod?";
var query_string = "";
for (var customizer_settings_key in customizer_settings) {
  if (
    customizer_settings.hasOwnProperty(customizer_settings_key) &&
    customizer_settings_key !== "is_para"
  ) {
    var append_key = "" == query_string ? "" : "&";

    query_string +=
      append_key +
      customizer_settings_key +
      "=" +
      encodeURIComponent(customizer_settings[customizer_settings_key]);
  }
}

var customizer_url = customizer_base_url + query_string;

if (allProductsMetafields[bulk_customizer_product_handle]["tag_product"] == 1) {
  var query_string_tag = "";
  for (var customizer_settings_key in tag_params.customizer_settings) {
    if (
      tag_params.customizer_settings.hasOwnProperty(customizer_settings_key) &&
      customizer_settings_key !== "is_para"
    ) {
      var append_key_tag = "" == query_string_tag ? "" : "&";

      query_string_tag +=
        append_key_tag +
        customizer_settings_key +
        "=" +
        encodeURIComponent(
          tag_params.customizer_settings[customizer_settings_key]
        );
    }

    query_string_tag += "&is_para=1";
  }

  var customizer_url_tag = customizer_base_url + query_string_tag;
}

function trigger_bulk_customizer(product_handle) {
  // var customizer_base_url = getParameterByName("customizer_base_url");

  bulk_customizer.customized_image_ele =
    document.getElementById("customized_image");
  bulk_customizer.base_url = customizer_url;

  const shopify_url = "https://apolisglobal.com"; // full url, no trailing slash
  const product_url = shopify_url + "/products/" + product_handle + ".js";

  fetch(product_url)
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      document.getElementById("product-name").innerHTML =
        "Personalize the <strong>" + data.title + "</strong>";
      data.variants.forEach(function (item, index) {
        console.log(item);
        if (item.title == "Add Custom Text") {
          bulk_customizer.price = item.price;
          bulk_customizer.variant_id = item.id;
        }
        else if (item.title == "Leave Blank") {
          console.log("I am blank");
          bulk_customizer.empty_price = item.price;
          bulk_customizer.empty_variant_id = item.id;
        }
      });

      bulk_customizer.customized_image_ele.src = data.featured_image;

      bulk_customizer.customizations = [
        { line_1: "", line_2: "", line_3: "", qty: 1, tag: false },
        { line_1: "", line_2: "", line_3: "", qty: 1, tag: false },
      ];
      render_bulk_customizer();
    });

  bulk_customizer.active_customization = 0;
  bulk_customizer.active_customization_type = "";
}

function addAnotherBag(event) {
  event.preventDefault();

  bulk_customizer.customizations.push({
    line_1: "",
    line_2: "",
    line_3: "",
    qty: 1,
    tag: false,
  });

  bulk_customizer.active_customization =
    bulk_customizer.customizations.length - 1;
  bulk_customizer.active_customization_type = "";

  render_bulk_customizer();
  refresh_bulk_customized_image();
}

function render_bulk_customizer() {
  var html = "";

  console.log(bulk_customizer.customizations);
  var total_qty = 0;
  var total_price = 0;
  var additional_style = "";
  if (force_caps) {
    additional_style = "text-transform:uppercase;";
  }

  bulk_customizer.customizations.forEach(function (item, index) {
    var bulk_index = index + 1;

    var item_price = (item.qty * bulk_customizer.price) / 100;
   console.log(item.tag);
    console.log("price"+tag_params.variant_price);
    if(item.tag) {
      
      item_price += (item.qty * tag_params.variant_price) / 100;
    }

    html += '<div class="bulk-customizer-carousel-slide">';
    html +=
      `<div class="row main-row nested wide-fit " ><div class="col col-span-1 grid__cell--middle hidden-phone" style="text-align:left;margin-top: -25px;">
          Bag ` + bulk_index;

    if (tag_params && item.tag === false) {
      html +=
        `<br /><a href="#" data-row-index="` +
        index +
        `" class="add_a_tag" style="font-size:12px;text-decoration: underline;">Add a leather tag</a>`;
    }
    if (tag_params && item.tag !== false) {
      html +=
        `<br /><a href="#" data-row-index="` +
        index +
        `" class="remove_a_tag" style="font-size:12px;text-decoration: underline;">Remove a leather tag</a>`;
    }

    html += `</div>`;

    html +=
      `<div class="col col-span-2">
          <input maxlength="` +
      char_limits[0] +
      `" style="` +
      additional_style +
      `" type="text" placeholder="Line 1" onfocus="inputFocus(event)" value="` +
      item.line_1 +
      `" data-field-index="1" data-row-index="` +
      index +
      `" name="customize-text-1[]" class="customize_text form__field form__field--text" />
        </div>`;

    if (total_lines > 1)
      html +=
        `<div class="col col-span-2">
            <input type="text"  style="` +
        additional_style +
        `" placeholder="Line 2" onfocus="inputFocus(event)" value="` +
        item.line_2 +
        `" data-field-index="2" data-row-index="` +
        index +
        `" name="customize-text-2[]" maxlength="` +
        char_limits[1] +
        `" class="customize_text form__field form__field--text" />
          </div>`;
    if (total_lines > 1)
      html +=
        `<div class="col col-span-2">
            <input maxlength="` +
        char_limits[2] +
        `" type="text"  style="` +
        additional_style +
        `" placeholder="Line 3" onfocus="inputFocus(event)" value="` +
        item.line_3 +
        `" data-field-index="3" data-row-index="` +
        index +
        `" name="customize-text-1[]" class="customize_text form__field form__field--text" />
          </div>`;
    html += `<div class="col col-span-1 grid__cell--middle hidden-tablet-and-up" style="text-align:right;margin-top: -30px;">
      Qty
        </div>
         <div class="col col-span-1 grid__cell--middle" style="text-align:center;">`;

    if (tag_params && item.tag === false) {
      html +=
        `<div class="hidden-tablet-and-up"><a href="#" data-row-index="` +
        index +
        `" class="add_a_tag" style="font-size:12px;text-decoration: underline;">Add a leather tag</a></div>`;
    }

    html +=
      `<div class="bulk_qty">
<div class="form_input-wrapper form_input-wrapper--labelled" style="display: block;">
              <div class="select-wrapper select-wrapper--primary is-filled"><svg class="icon icon--arrow-bottom" viewBox="0 0 12 8" role="presentation">
      <path stroke="currentColor" stroke-width="2" d="M10 2L6 6 2 2" fill="none" stroke-linecap="square"></path>
    </svg><select style="height: 40px;" onchange="changeQty(event, '` +
      index +
      `' )" class="customize_qty" data-row-index="` +
      index +
      `" name="qty[]">`;

    for (var i = 1; i <= 100; i++) {
      var selected = i == item.qty ? "selected" : "";
      html += "<option " + selected + ' value="' + i + '">' + i + "</option>";
    }

    html +=
      `</select></div>
            </div>
<a style="font-size:12px;   " href="#" data-row-index="` +
      index +
      `" class="delete_item">Remove</a></div>
        </div>
        <div class="col col-span-1 grid__cell--middle" style="text-align:right;margin-top: -25px;">
      $` +
      item_price +
      `
        </div>
</div>`;

    if (tag_params && item.tag !== false) {
      html +=
        `<div class="row tag-row nested wide-fit">
<div class="col col-span-1 grid__cell--middle " style="text-align:left;">
          Tag ` +
        bulk_index +
        ` </div>
          <div class="col col-span-10">
          <input maxlength="240" style="" type="text" placeholder="Enter Tag Text here" onfocus="inputFocus(event)" value="` +
        item.tag +
        `" data-type="tag" data-field-index="1" data-row-index="` +
        index +
        `" name="customize-text-1[]" class="customize_text form__field form__field--text">
        </div>

       </div>`;
    }
    html += "</div>";
    total_price += item_price;
    total_qty += parseInt(item.qty);
  });

  document.getElementById("total-qty").innerHTML = total_qty + " item(s)";
  document.getElementById("total-price").innerHTML = "$" + total_price;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device

    if (is_flickity) {
      window.bulk_flickity.destroy();
    }

    bulk_customizer_ele.innerHTML = html;

    window.bulk_flickity = new Flickity("#bulk-customizer-main", {});
    is_flickity = true;

    window.bulk_flickity.selectCell(bulk_customizer.active_customization);

    window.bulk_flickity.on("change", function (index) {
      console.log("Flickity change " + index);

      bulk_customizer.active_customization = index;
      refresh_bulk_customized_image();
    });
  } else {
    bulk_customizer_ele.innerHTML = html;
  }
}
function inputFocus(e) {
  var selected_row_index = e.target.getAttribute("data-row-index");
  var data_type = e.target.getAttribute("data-type");

  bulk_customizer.active_customization = parseInt(selected_row_index);
  bulk_customizer.active_customization_type = data_type == "tag" ? "tag" : "";

  refresh_bulk_customized_image();
}

bulk_customizer_ele.addEventListener("click", function (e) {
  if (e.target && e.target.matches("a.delete_item")) {
    event.preventDefault();
    var selected_row_index = e.target.getAttribute("data-row-index");
    if (bulk_customizer.active_customization == selected_row_index) {
      bulk_customizer.active_customization = 0;
      refresh_bulk_customized_image();
    }
    bulk_customizer.customizations.splice(selected_row_index, 1);
    bulk_customizer.active_customization_type = "";

    render_bulk_customizer();
  }
});

bulk_customizer_ele.addEventListener("click", function (e) {
  if (e.target && e.target.matches("a.add_a_tag")) {
    event.preventDefault();
    var selected_row_index = e.target.getAttribute("data-row-index");
    bulk_customizer.active_customization = parseInt(selected_row_index);
    bulk_customizer.customizations[bulk_customizer.active_customization][
      "tag"
    ] = "";
    render_bulk_customizer();
  }
});
bulk_customizer_ele.addEventListener("click", function (e) {
  if (e.target && e.target.matches("a.remove_a_tag")) {
    event.preventDefault();
    var selected_row_index = e.target.getAttribute("data-row-index");
    bulk_customizer.customizations[parseInt(selected_row_index)]["tag"] = false;
    render_bulk_customizer();
  }
});


bulk_customizer_ele.addEventListener("input", function (e) {
  // e.target was the clicked element
  if (e.target && e.target.matches("input.customize_text")) {
    var selected_row_index = e.target.getAttribute("data-row-index");
    bulk_customizer.active_customization = parseInt(selected_row_index);

    var data_type = e.target.getAttribute("data-type");
    bulk_customizer.active_customization_type = data_type == "tag" ? "tag" : "";

    var selected_field_index = e.target.getAttribute("data-field-index");

    if (data_type == "tag") {
      bulk_customizer.customizations[bulk_customizer.active_customization][
        "tag"
      ] = e.target.value;
    } else {
      bulk_customizer.customizations[bulk_customizer.active_customization][
        "line_" + selected_field_index
      ] = force_caps ? e.target.value.toUpperCase() : e.target.value;
    }
    refresh_bulk_customized_image();
  }
});

function refresh_bulk_customized_image() {
  var customization_data =
    bulk_customizer.customizations[bulk_customizer.active_customization];

  var image_number = bulk_customizer.active_customization + 1;
  document.getElementById("bulk-image-loader").style.display = "inline-block";

  if (bulk_customizer.active_customization_type == "tag") {
    var customized_words = [customization_data.tag];

    var final_image_url =
      customizer_url_tag +
      "&words=" +
      btoa(unescape(encodeURIComponent(customized_words.join("__"))));
  } else {
    if (total_lines > 1)
      var customized_words = [
        customization_data.line_1,
        customization_data.line_2,
        customization_data.line_3,
      ];
    else var customized_words = [customization_data.line_1];

    var final_image_url =
      bulk_customizer.base_url +
      "&words=" +
      btoa(unescape(encodeURIComponent(customized_words.join("__"))));
  }

  bulk_customizer.customized_image_ele.src = final_image_url;
  var display_label =
    bulk_customizer.active_customization_type == "tag" ? "Tag" : "Bag";
  document.getElementById("bulk-image-label").innerHTML =
    "Previewing " + display_label + " " + image_number;
  setTimeout(function () {
    document.getElementById("bulk-image-loader").style.display = "none";
  }, 3500);
}

var bulk_add_to_cart_ele = document.getElementById("bulk-add-to-cart");

if (bulk_add_to_cart_ele) {
  bulk_add_to_cart_ele.addEventListener("click", function (event) {
    event.preventDefault();

    let formData = {
      items: [],
    };
    var total_qty = 0;
    console.log(bulk_customizer);
    bulk_customizer.customizations.forEach(function (item, index) {
      if (total_lines > 1) {
        if(item.line_1 == "" && item.line_2 == "" && item.line_1 == "") {
          var cart_custom_text = "";
        } 
        else {
        var cart_custom_text =
          "Your text: " +
          item.line_1 +
          " | " +
          item.line_2 +
          " | " +
          item.line_3;
        }
      }
      else {
        if(item.line_1 == "") {
          var cart_custom_text = "";
        } 
        else {
        var cart_custom_text = "Your text: " + item.line_1;
        }
      }

      if(cart_custom_text) 
      var current_item  = {
        id: bulk_customizer.variant_id,
        quantity: item.qty,
        properties: {
          customization: cart_custom_text,
        },
      };
      else 
         var current_item  = {
        id: bulk_customizer.empty_variant_id,
        quantity: item.qty
      };

      formData.items.push(current_item);

      total_qty = total_qty + item.qty;

      if(item.tag) {
          formData.items.push({
        id: tag_params.variant_id,
        quantity: item.qty,
        properties: {
          customization: "Your text: " + item.tag
        },
      });

      total_qty = total_qty + item.qty;
      }
    });

    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        document.documentElement.dispatchEvent(
          new CustomEvent("product:added", {
            bubbles: true,
            detail: {
              quantity: total_qty,
            },
          })
        );
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
if (bulk_customizer_product_handle) {
  trigger_bulk_customizer(bulk_customizer_product_handle);
}

function listener(/* parameters */) {
  console.log("eventName happened");
}

function changeQty(e, selected_row_index) {
  bulk_customizer.active_customization = parseInt(selected_row_index);

  bulk_customizer.customizations[bulk_customizer.active_customization]["qty"] =
    e.target.value;

  render_bulk_customizer();
}
