

$(document).ready(function(){
    

    var screen_ratio = screen.width/screen.height
    // console.log(window.width);
    var interests = ['gis','spatial_data','visualization','modelling','R','python'];
    var also_interests = ['networks','urban_analytics','cities','circular_economy','sustainability'];
    // ['physics', 'science', 'music', 'photography', 'architecture']; //, 'cooking'
    var interests_ = $('#interests');

    // interests_.append('<p>')
    $.each(interests,function(id,el) {
        el = '#'+el;
        // console.log(el);
        interests_.append('<code>'+el+'</code>');
    }); 
    interests_.append('<h4>Interests <h4/>');
    $.each(also_interests,function(id,el) {
        el = '#'+el;
        // console.log(el);
        interests_.append('<code style="word-break: keep-all; word-wrap: normal;" >'+el+'</code>'); //+'&nbsp;'
    }); 
    // interests_.append("</p>")
    
    var clicked=null;
    // console.log(clicked);

    var port_section_tit = $('.portfolio_section_title h5');

    var sections = {
        'software_tit':'software'
        ,'research_tit':'research'
        ,'courseworks_tit':'courseworks'
        ,'publications_tit':'publications'
    };

    // console.log($('.portfolio_sections_pane'));

    port_section_tit.click(function(){
        
        // console.log(clicked);
        // $.each(port_section_tit,function(id,el){
        //     console.log(sections[el.id]);
        // });

        if(clicked!=null) {
            $.each(port_section_tit,function(id,el){

                // console.log(sections[el.id]);

                $('.portfolio_sections_pane').css('grid-template-columns', '1fr 1fr');
                
                if (screen_ratio<1) {
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
        // console.log(port_section_tit);
            clicked = this.id;

            if (screen_ratio<=1) {
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
            
            // $('.portfolio_sections_pane').css('grid-template-columns', '1fr');
            $.each(port_section_tit,function(id,el){
                // port_section.css
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

