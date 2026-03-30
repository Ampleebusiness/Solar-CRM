import React from 'react';
import { NavLink } from 'react-router-dom';
import ConsultationModal from './ConsultationModal';

class Slider2 extends React.Component {
     constructor(props) {
    super(props);
    this.state = {
         isOpen: false,
      showModal: false,
      formData: {
        name: "",
        phone: "",
        email: "",
        service: [],
        city: "",
        message: "",
      }
    //  this.openModal = this.openModal.bind(this)
    };
  }
    componentDidMount() {
        function loadScript(src) {

            return new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = src;
                script.addEventListener('load', function () {
                    resolve();
                });
                script.addEventListener('error', function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
                document.body.removeChild(script);
            })
        };

        loadScript('./assets/js/rev-script-2.js');

    };
    

    openModal() {
        this.setState({ isOpen: true })
    }
    toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
   resetForm = () => {
      this.setState({formData:{ name: "", phone: "", email: "", service: [], city: "", message: "" }});
    }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      formData: { ...prev.formData, [name]: value }
    }));
  };

  handleServiceCheckbox = (e) => {
    const { value, checked } = e.target;
    this.setState((prev) => {
      let services = [...prev.formData.service];
      if (checked) {
        services.push(value);
      } else {
        services = services.filter((s) => s !== value);
      }
      return { formData: { ...prev.formData, service: services } };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", this.state.formData);
    this.toggleModal();
  };

    render() {
        return (
            <>
                <div id="rev_slider_one_wrapper" className="rev_slider_wrapper fullscreen-container" data-alias="mask-showcase" data-source="gallery" style={{ background: '#aaaaaa', padding: 0 }}>
                        {/* START REVOLUTION SLIDER 5.4.1 fullscreen mode */}
                        <div id="rev_slider_one" className="rev_slider fullscreenbanner" style={{ display: 'none' }} data-version="5.4.1">
                            <ul>
                                {/* SLIDE 1 */}
                                <li data-index="rs-70" data-transition="fade" data-slotamount="default" data-hideafterloop={0} data-hideslideonmobile="off" data-easein="default" data-easeout="default" data-masterspeed={300} data-thumb={require('./../../images/main-slider/slider2/slide3.jpg')} data-rotate={0} data-saveperformance="off" data-title data-param1={1} data-param2 data-param3 data-param4 data-param5 data-param6 data-param7 data-param8 data-param9 data-param10 data-description>
                                    {/* MAIN IMAGE */}
                                    <img src={require('./../../images/solar/banner-farm.jpg')} alt="" data-bgcolor="#f8f8f8" style={{}} data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" data-bgparallax="off" className="rev-slidebg" data-no-retina />
                                    {/* LAYER 1  right image overlay dark*/}
                                    <div className="tp-caption tp-shape tp-shapewrapper  rs-parallaxlevel-tobggroup" id="slide-70-layer-1" data-x="['right','right','right','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['0','0','0','0']" data-fontweight="['100','100','400','400']" data-width="['full','full','full','full']" data-height="['full','full','full','full']" data-whitespace="nowrap" data-type="shape" data-basealign="slide" data-responsive_offset="off" data-responsive="off" data-frames="[{&quot;from&quot;:&quot;opacity:0;&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:150,&quot;ease&quot;:&quot;Power2.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;opacity:0;&quot;,&quot;ease&quot;:&quot;Power2.easeInOut&quot;}]" data-textalign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 6, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    </div>
                                    {/* LAYER 3  Thin text title*/}
                                    <div 
  className="tp-caption tp-resizeme slider-tag-line" 
  id="slide-70-layer-3" 
  data-x="['center','center','center','center']" 
  data-hoffset="['0','0','0','0']" 
  data-y="['middle','middle','middle','middle']" 
  data-voffset="['-50','-50','-50','-50']" 
  data-fontsize="['22','22','20','16']" 
  data-lineheight="['26','26','26','22']" 
  data-width="['700','650','620','380']" 
  data-height="none" 
  data-whitespace="nowrap" 
  data-type="text" 
  data-responsive_offset="on" 
  data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,
                &quot;speed&quot;:1500,
                &quot;to&quot;:&quot;o:1;&quot;,
                &quot;delay&quot;:1000,
                &quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                {&quot;delay&quot;:&quot;wait&quot;,
                &quot;speed&quot;:500,
                &quot;to&quot;:&quot;y:[-100%];&quot;,
                &quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,
                &quot;ease&quot;:&quot;Power1.easeIn&quot;}]" 
  data-textalign="['center','center','center','center']" 
  data-paddingtop="[10,10,10,10]" 
  data-paddingright="[20,20,20,20]" 
  data-paddingbottom="[10,10,10,10]" 
  data-paddingleft="[0,0,0,0]" 
  style={{ 
    zIndex: 10, 
    color: '#fff', 
    fontFamily: '"Poppins", sans-serif', 
    textAlign: 'center' 
  }}
>
  
</div>

                                    {/* LAYER 4  Bold Title*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-70-layer-4" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['10','10','10','10']" data-fontsize="['42','42','38','26']" data-lineheight="['52','52','48','34']" data-width="['700','700','700','90%']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:2500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,20]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, textTransform: 'uppercase', whiteSpace: 'normal', fontWeight: 800, color: '#fff', fontFamily: '"Poppins", sans-serif',textAlign: 'center' }}>Solar Energy Solutions</div>
                                    {/* LAYER 5  Paragraph*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-70-layer-5" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['80','80','80','80']" data-fontsize="['16','16','16','16']" data-lineheight="['22','22','22','22']" data-width="['600','600','600','380']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:3500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,20]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, whiteSpace: 'normal', color: '#fff', fontFamily: '"Poppins", sans-serif',textAlign: 'center' }}>Design, installation, and performance planning for high-efficiency solar panels that cut electricity bills and increase long-term savings.</div>
                                    {/* LAYER 6  Read More*/}
                                    <div className="tp-caption rev-btn  tp-resizeme" id="slide-70-layer-6" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['160','160','160','160']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="button" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:4000,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 9, lineHeight: 30 }}><NavLink onClick={this.toggleModal} className="site-button btn-half"><span> Get a Free Consultation</span></NavLink></div>
                          
                                </li>

                                 <li data-index="rs-71" data-transition="fade" data-slotamount="default" data-hideafterloop={0} data-hideslideonmobile="off" data-easein="default" data-easeout="default" data-masterspeed={300} data-thumb={require('./../../images/main-slider/slider2/slide3.jpg')} data-rotate={0} data-saveperformance="off" data-title data-param1={1} data-param2 data-param3 data-param4 data-param5 data-param6 data-param7 data-param8 data-param9 data-param10 data-description>
                                    {/* MAIN IMAGE */}
                                    <img src={require('./../../images/solar/sol-battery.jpg')} alt="" data-bgcolor="#f8f8f8" style={{}} data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" data-bgparallax="off" className="rev-slidebg" data-no-retina />
                                    {/* LAYER 1  right image overlay dark*/}
                                    <div className="tp-caption tp-shape tp-shapewrapper  rs-parallaxlevel-tobggroup" id="slide-70-layer-1" data-x="['right','right','right','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['0','0','0','0']" data-fontweight="['100','100','400','400']" data-width="['full','full','full','full']" data-height="['full','full','full','full']" data-whitespace="nowrap" data-type="shape" data-basealign="slide" data-responsive_offset="off" data-responsive="off" data-frames="[{&quot;from&quot;:&quot;opacity:0;&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:150,&quot;ease&quot;:&quot;Power2.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;opacity:0;&quot;,&quot;ease&quot;:&quot;Power2.easeInOut&quot;}]" data-textalign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 6, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    </div>
                                    {/* LAYER 3  Thin text title*/}
          

                                    {/* LAYER 4  Bold Title*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-70-layer-4" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['10','10','10','10']" data-fontsize="['42','42','38','26']" data-lineheight="['52','52','48','34']" data-width="['700','700','700','90%']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:2500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,20]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, textTransform: 'uppercase', whiteSpace: 'normal', fontWeight: 800, color: '#fff', fontFamily: '"Poppins", sans-serif',textAlign: 'center' }}>Solar + Battery Packages</div>
                                    {/* LAYER 5  Paragraph*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-70-layer-5" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['80','80','80','80']" data-fontsize="['16','16','16','16']" data-lineheight="['22','22','22','22']" data-width="['600','600','600','380']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:3500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,20]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, whiteSpace: 'normal', color: '#fff', fontFamily: '"Poppins", sans-serif',textAlign: 'center' }}>Store excess energy, reduce grid dependence, and keep your home powered during outages with smart battery backup options.</div>
                                    {/* LAYER 6  Read More*/}
                                    <div className="tp-caption rev-btn  tp-resizeme" id="slide-70-layer-6" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['160','160','160','160']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="button" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:4000,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 9, lineHeight: 30 }}><NavLink onClick={this.toggleModal} className="site-button btn-half"><span> Book Solar Survey</span></NavLink></div>
                                </li>
                                {/* SLIDE 2 */}
                                <li data-index="rs-72" data-transition="fade" data-slotamount="default" data-hideafterloop={0} data-hideslideonmobile="off" data-easein="default" data-easeout="default" data-masterspeed={300} data-thumb={require('./../../images/main-slider/slider2/slide1.jpg')} alt="" data-rotate={0} data-saveperformance="off" data-title data-param1={1} data-param2 data-param3 data-param4 data-param5 data-param6 data-param7 data-param8 data-param9 data-param10 data-description>
                                    {/* MAIN IMAGE */}
                                    <img src={require('./../../images/solar/sol-site.jpg')} alt="" data-bgcolor="#f8f8f8" style={{}} data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" data-bgparallax="off" className="rev-slidebg" data-no-retina />
                                    {/* LAYER 1  right image overlay dark*/}
                                    <div className="tp-caption tp-shape tp-shapewrapper  rs-parallaxlevel-tobggroup" id="slide-71-layer-1" data-x="['right','right','right','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['0','0','0','0']" data-fontweight="['100','100','400','400']" data-width="['full','full','full','full']" data-height="['full','full','full','full']" data-whitespace="nowrap" data-type="shape" data-basealign="slide" data-responsive_offset="off" data-responsive="off" data-frames="[{&quot;from&quot;:&quot;opacity:0;&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:150,&quot;ease&quot;:&quot;Power2.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;opacity:0;&quot;,&quot;ease&quot;:&quot;Power2.easeInOut&quot;}]" data-textalign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 6, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    </div>
                                    {/* LAYER 3  Thin text title*/}
                                    <div className="tp-caption   tp-resizeme slider-tag-line" id="slide-71-layer-3" data-x="['center','center','center','center']" data-hoffset="['50','50','70','0']" data-y="['middle','middle','middle','middle']" data-voffset="['-50','-50','-50','-50']" data-fontsize="['22',22','20','16']" data-lineheight="['26','26','26','22']" data-width="['700','650','620','380']" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[10,10,10,10]" data-paddingright="[20,20,20,20]" data-paddingbottom="[10,10,10,10]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, color: '#fff', fontFamily: '"Poppins", sans-serif' }}></div>
                                    {/* LAYER 4  Bold Title*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-71-layer-4" data-x="['center','center','center','center']" data-hoffset="['50','50','70','0']" data-y="['middle','middle','middle','middle']" data-voffset="['10','10','10','10']" data-fontsize="['42','42','38','26']" data-lineheight="['52','52','48','34']" data-width="['700','700','700','90%']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:2500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,20]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, textTransform: 'uppercase', whiteSpace: 'normal', fontWeight: 800, color: '#fff', fontFamily: '"Poppins", sans-serif' }}>Residential Solar Systems</div>
                                    {/* LAYER 5  Paragraph*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-71-layer-5" data-x="['center','center','center','center']" data-hoffset="['50','50','70','0']" data-y="['middle','middle','middle','middle']" data-voffset="['80','80','80','80']" data-fontsize="['16','16','16','16']" data-lineheight="['22','22','22','22']" data-width="['600','600','600','380']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:3500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,20]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, whiteSpace: 'normal', color: '#fff', fontFamily: '"Poppins", sans-serif' }}>Customized rooftop solar design for homes with net-metering support, subsidy guidance, and high-performance panel installation.</div>
                                    {/* LAYER 6  Read More*/}
                                    <div className="tp-caption rev-btn  tp-resizeme" id="slide-71-layer-6" data-x="['center','center','center','center']" data-hoffset="['50','50','70','0']" data-y="['middle','middle','middle','middle']" data-voffset="['160','160','160','160']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="button" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:4000,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 9, lineHeight: 30 }}><NavLink onClick={this.toggleModal} className="site-button btn-half"><span> Calculate Savings</span></NavLink></div>
                                </li>
                                {/* SLIDE 3 */}
                                <li data-index="rs-73" data-transition="fade" data-slotamount="default" data-hideafterloop={0} data-hideslideonmobile="off" data-easein="default" data-easeout="default" data-masterspeed={300} data-thumb={require('./../../images/main-slider/slider2/slide2.jpg')} data-rotate={0} data-saveperformance="off" data-title data-param1={1} data-param2 data-param3 data-param4 data-param5 data-param6 data-param7 data-param8 data-param9 data-param10 data-description>
                                    {/* MAIN IMAGE */}
                                    <img src={require('./../../images/solar/5.jpg')} alt="" data-bgcolor="#f8f8f8" style={{}} data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" data-bgparallax="off" className="rev-slidebg" data-no-retina />
                                    {/* LAYER 1  right image overlay dark*/}
                                    <div className="tp-caption tp-shape tp-shapewrapper  rs-parallaxlevel-tobggroup" id="slide-72-layer-1" data-x="['right','right','right','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['0','0','0','0']" data-fontweight="['100','100','400','400']" data-width="['full','full','full','full']" data-height="['full','full','full','full']" data-whitespace="nowrap" data-type="shape" data-basealign="slide" data-responsive_offset="off" data-responsive="off" data-frames="[{&quot;from&quot;:&quot;opacity:0;&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:150,&quot;ease&quot;:&quot;Power2.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;opacity:0;&quot;,&quot;ease&quot;:&quot;Power2.easeInOut&quot;}]" data-textalign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 6, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    </div>
                                    {/* LAYER 3  Thin text title*/}
                                    <div className="tp-caption   tp-resizeme slider-tag-line" id="slide-72-layer-3" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['-50','-50','-50','-50']" data-fontsize="['22',22','20','16']" data-lineheight="['26','26','26','22']" data-width="['700','650','620','380']" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:1500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[10,10,10,10]" data-paddingright="[20,20,20,20]" data-paddingbottom="[10,10,10,10]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, color: '#fff', fontFamily: '"Poppins", sans-serif' }}></div>
                                    {/* LAYER 4  Bold Title*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-72-layer-4" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['10','10','10','10']" data-fontsize="['42','42','38','26']" data-lineheight="['52','52','48','34']" data-width="['700','700','700','700']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:2500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,0]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, textTransform: 'uppercase', whiteSpace: 'normal', fontWeight: 800, color: '#fff', fontFamily: '"Poppins", sans-serif' }}>Commercial Solar Projects</div>
                                    {/* LAYER 5  Paragraph*/}
                                    <div className="tp-caption   tp-resizeme" id="slide-72-layer-5" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['80','80','80','80']" data-fontsize="['16','16','16','16']" data-lineheight="['22','22','22','22']" data-width="['600','600','600','380']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:3500,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[20,20,20,20]" data-paddingright="[20,20,20,20]" data-paddingbottom="[30,30,30,30]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 10, whiteSpace: 'normal', color: '#fff', fontFamily: '"Poppins", sans-serif' }}>End-to-end EPC execution for factories, offices, and institutions with engineered layouts, quality installation, and long-term O&amp;M support.</div>
                                    {/* LAYER 6  Read More*/}
                                    <div className="tp-caption rev-btn  tp-resizeme" id="slide-72-layer-6" data-x="['center','center','center','center']" data-hoffset="['0','0','0','0']" data-y="['middle','middle','middle','middle']" data-voffset="['160','160','160','160']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="button" data-responsive_offset="on" data-frames="[{&quot;from&quot;:&quot;y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;&quot;,
                          &quot;mask&quot;:&quot;x:0px;y:0px;s:inherit;e:inherit;&quot;,&quot;speed&quot;:4000,&quot;to&quot;:&quot;o:1;&quot;,&quot;delay&quot;:1000,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},
                          {&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:500,&quot;to&quot;:&quot;y:[-100%];&quot;,&quot;mask&quot;:&quot;x:inherit;y:inherit;s:inherit;e:inherit;&quot;,&quot;ease&quot;:&quot;Power1.easeIn&quot;}]" data-textalign="['center','center','center','center']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style={{ zIndex: 9, lineHeight: 30 }}><NavLink onClick={this.toggleModal} className="site-button btn-half"><span> Talk to Solar Expert</span></NavLink></div>
                                </li>
                                 
                            </ul>
                            <div className="tp-bannertimer" style={{ height: 10, background: 'rgba(0, 0, 0, 0.15)' }} />
                        </div>
               
                    </div>
                              <ConsultationModal
          show={this.state.showModal}
          toggleModal={this.toggleModal}
          formData={this.state.formData}
          onResetForm={this.resetForm}
          handleChange={this.handleChange}
          handleServiceCheckbox={this.handleServiceCheckbox}
          handleSubmit={this.handleSubmit}
        />
            </>
        );
    }
};

export default Slider2;