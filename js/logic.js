$(document).ready(function() {
  //Set the carousel options
  $('#quote-carousel').carousel({
    pauseOnHover: true,
    interval: 1000,
  });
});

$(document).on('click', '#close-preview', function(){ 
  $('.image-preview').popover('hide');
  // Hover befor close the preview
  $('.image-preview').hover(
      function () {
         $('.image-preview').popover('show');
      }, 
       function () {
         $('.image-preview').popover('hide');
      }
  );    
});

$('#search-button').click(function () {
  var query=$(transcript).val()
  if(query){
    var params = {"q":query};
    var body = {
      //query: $("#transcript").val()//document.getElementById('otp').value
    }
    var additionalParams = {
      headers: {},
      queryParams: {}
    };

    apigClient.searchGet(params, body, additionalParams)
      .then(function(result){
          // success callback
          //console.log(eval(result.data))
          var imgs=eval(result.data);
          if(imgs.length>0){
            var txt='';
            for(var i=0;i<imgs.length;i++){
              if(i==0){
                // txt+=`<li data-target="#quote-carousel" data-slide-to="${i}" class="active"></li>`;
              }
              else{
                txt+=`<li data-target="#quote-carousel" data-slide-to="${i}"></li>`;
              }
            }
            $("#indicator").append(txt);

            txt='';
            for(var i=0;i<imgs.length;i++){
              img=imgs[i];
              if(i==0){
                // txt+=`<div class="item active">\
                //         <blockquote>\
                //         <div class="row">\
                //             <div class="col-md-3 text-center">\
                //             <center>\
                //             <img class="show-img" src=${img}>\
                //             </center>\
                //             </div>\
                //         </div>\
                //         </blockquote>\
                //       </div>`
                $("#img1").attr('src', img);
              }
              else{
                txt+=`<div class="item">\
                        <blockquote>\
                        <div class="row">\
                            <div class="text-center">\
                            <center>\
                            <img class="show-img" src=${img}>\
                            </center>\
                            </div>\
                        </div>\
                        </blockquote>\
                      </div>`
              }

            }
            $("#quote").append(txt);
          }
          // var name = result.data.body.slice(1,-1);
          //$("#img1").attr('src', result.data);
          //$("#img1").css({'width': '100%', 'height':'auto'});
      }).catch(function(result){
          // error callback
          //swal('Oops...', 'Something went wrong!', 'error');
          console.log("Sorry, API Gateway is not responding");
      });
  }
});

var apigClient = apigClientFactory.newClient();
var file;

$(function() {
  // Create the close button
  var closebtn = $('<button/>', {
      type:"button",
      text: 'x',
      id: 'close-preview',
      style: 'font-size: initial;',
  });
  closebtn.attr("class","close pull-right");
  // Set the popover default content
  $('.image-preview').popover({
      trigger:'manual',
      html:true,
      title: "<strong>Preview</strong>"+$(closebtn)[0].outerHTML,
      content: "There's no image",
      placement:'bottom'
  });
  // Clear event
  $('.image-preview-clear').click(function(){
      $('.image-preview').attr("data-content","").popover('hide');
      $('.image-preview-filename').val("");
      $('.image-preview-clear').hide();
      $('.image-preview-input input:file').val("");
      $(".image-preview-input-title").text("Browse"); 
  }); 
  // Create the preview image
  $(".image-preview-input input:file").change(function (){     
    var img = $('<img/>', {
        id: 'dynamic',
        width:250,
        height:200
    });
    console.log(this.files)
    file = this.files[0];
    var reader = new FileReader();

    //Set preview image into the popover data-content
    reader.onload = function (e) {
        $(".image-preview-input-title").text("Change");
        $(".image-preview-clear").show();
        $('.upload').show();
        $(".image-preview-filename").val(file.name);    
        img.attr('src', e.target.result);
        $(".image-preview").attr("data-content",$(img)[0].outerHTML).popover("show");
    }        
    reader.readAsDataURL(file);
  });  
  $('.upload').click(function(){
      // console.log(file);
      // var file = $('.image-preview-input input:file').files[0];
      var ext=file.name.split(".")[file.name.split(".").length-1];
      // console.log("image/"+ext)
      var rawreader = new FileReader();
      rawreader.onload = function (e) {
        var params = {
          "Content-Type": "image/"+ext, 
          "item": file.name, 
          "folder": "hw3-ai-photo-album"};
        var body = e.target.result.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
        console.log(body);
        var additionalParams = {
          headers: {},
          queryParams: {}
        };
        apigClient.uploadFolderItemPut(params, body, additionalParams)
          .then(function(result){
              // success callback
              console.log("success")
          }).catch(function(result){
              // error callback
              console.log("Sorry, API Gateway is not responding");
          });
      }
      rawreader.readAsDataURL(file);
      $('.image-preview').attr("data-content","").popover('hide');
      $('.image-preview-filename').val("");
      $('.image-preview-clear').hide();
      $('.upload').hide();
      $('.image-preview-input input:file').val("");
      $(".image-preview-input-title").text("Browse"); 
  }); 
});
