

$(document).ready(function(){
    
    var screen_ratio = window.innerWidth/window.innerHeight
    
    var interests = ['gis', 'spatial_data', 'visualisation', 'modelling', 'rstats', 'python'];
    var also_interests = ['networks','urban_analytics','cities','circular_economy','sustainability'];
    
    // ['physics', 'science', 'music', 'photography', 'architecture']; //, 'cooking'
    
    var interests_ = $('#interests');

    $.each(interests,function(id,el) {
        el_tag = '#'+el;
        interests_.append('<a href="https://ischlo.github.io/blog/#category='+el+'" target="_blank"> <span class="interest_element">' + el_tag + "</span> </a>");
    }); 
    
    interests_.append('<h4>Interests </h4>');

    $.each(also_interests,function(id,el) {
        el_tag = '#'+el;
        interests_.append('<a href="https://ischlo.github.io/blog/#category='+el+'" target="_blank"> <span class="interest_element">'+el_tag+'</span> </a>');
    }); 

    var clicked=null;

    var port_section_tit = $('.portfolio_section_title h5');

    var sections = {
        'software_tit':'software'
        ,'research_tit':'research'
        ,'courseworks_tit':'courseworks'
        ,'publications_tit':'publications'
    };

    port_section_tit.click(function(){
   
        if(clicked!=null) {
            $.each(port_section_tit,function(id,el){

                $('.portfolio_sections_pane').css('grid-template-columns', '1fr 1fr');
                
                if (screen_ratio<=1 && screen.innerWidth < 700) {
                    $('#'+sections[el.id] + '.portfolio_section').animate({
                        width:'80vw',
                        height:'35vh',
                    },duration = 150);     
                } else {
                    $('#'+sections[el.id] + '.portfolio_section').animate({
                        width:'40vw',
                        height:'35vh',
                    },duration = 150);  
                }

                
                $('#'+sections[el.id] + '.portfolio_section').css('border','1px solid rgb(63, 37, 141)');
                
            });
            clicked = null;
        } else if(clicked==null) {

            clicked = this.id;

            if (screen_ratio<=1 && screen.innerWidth < 700) {
                $('#'+sections[this.id] + '.portfolio_section').animate({
                    width:'80vw',
                    height:'70vh'
                },duration=250);
            } else {
                $('#'+sections[this.id] + '.portfolio_section').animate({
                    width:'70vw',
                    height:'70vh'
                },duration=250);
            }
            
            $.each(port_section_tit,function(id,el){

                if(el.id!=clicked){
                    var other = $('#'+sections[el.id] + '.portfolio_section')
                    other.animate({
                        width:'0vh',
                        height:'0vh',
                        border:'0'
                    },duration = 150);      
                } 
            });    
        }
    });
  });

