
function generate_portfolio(name, description, link_git, link_web) { 
    var portolio_ = $('#portfolio');

    $.each(name, function(id,el){
        portolio_.append()

    });

}

$(document).ready(function(){
    
    var interests = ['gis','spatial_data','urban_analytics','modelling','cities','circular_economy','sustainability'];
    var also_interests = ['physics', 'science', 'music', 'photography', 'architecture', 'cooking'];
    var interests_ = $('#interests');

    $.each(interests,function(id,el) {
        el = '#'+el;
        // console.log(el);
        interests_.append('<code>'+el+'</code>');
    }); 
    interests_.append('<h4>But also<h4/>');
    $.each(also_interests,function(id,el) {
        el = '#'+el;
        // console.log(el);
        interests_.append('<code>'+el+'</code>');
    }); 
    
    
  });






