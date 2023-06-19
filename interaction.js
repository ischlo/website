

$(document).ready(function(){
    
    var interests = ['gis','spatial_data','urban_analytics','modelling','cities','circular_economy','sustainability'];
    var also_interests = ['physics', 'science', 'music', 'photography', 'architecture', 'cooking'];
    var interests_ = $('#interests');

    $.each(interests,function(id,el) {
        el = '#'+el;
        // console.log(el);
        interests_.append('<code>'+el+'</code>');
    });

    // $(".blog_embedding").load("https://ischlo.github.io/blog_posts/regex/index.html"); 
      
  });






