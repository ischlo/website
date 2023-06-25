
function generate_portfolio(name, description, link_git, link_web) { 
    var portolio_ = $('#portfolio');

    $.each(name, function(id,el){
        portolio_.append()

    });

}

$(document).ready(function(){
    
    var interests = ['gis','spatial_data','urban_analytics','modelling','cities','circular_economy','sustainability'];
    var also_interests = ['physics', 'science', 'music', 'photography', 'architecture']; //, 'cooking'
    var interests_ = $('#interests');

    // interests_.append('<p>')
    $.each(interests,function(id,el) {
        el = '#'+el;
        // console.log(el);
        interests_.append('<code>'+el+'</code>');
    }); 
    interests_.append('<h4>But also <h4/>');
    $.each(also_interests,function(id,el) {
        el = '#'+el;
        // console.log(el);
        interests_.append('<code>'+el+'</code>');
    }); 
    // interests_.append("</p>")
    
    var clicked=null;
    // console.log(clicked);

    var port_section_tit = $('.portfolio_section_title h5');

    // console.log($('.portfolio_sections_pane'));

    port_section_tit.click(function(){
        
        console.log(clicked);
        
        if(clicked!=null) {
            $.each(port_section_tit,function(id,el){

                $('.portfolio_sections_pane').css('grid-template-columns', '1fr 1fr');
                $('#'+el.id + '.portfolio_section').animate({
                        width:'40vw',
                        height:'35vh',
                    },duration = 200);     

                $('#'+el.id + '.portfolio_section').css('border','1px solid rgb(63, 37, 141)');
                
            });
            clicked = null;
        } else if(clicked==null) {
        // console.log(port_section_tit);
            clicked = this.id;
            $('#'+this.id + '.portfolio_section').animate({
                width:'70vw',
                height:'70vh'
            },duration=400);
            // $('.portfolio_sections_pane').css('grid-template-columns', '1fr');
            $.each(port_section_tit,function(id,el){
                // port_section.css
                if(el.id!=clicked){
                    var other = $('#'+el.id + '.portfolio_section')
                    other.animate({
                        width:'0vh',
                        height:'0vh',
                        border:'0'
                    },duration = 200);      
                } 
            });    
        }
    });
  });


  // EVENT listener for clicks on the protfolio sections to expand them



