import React, { useState, useCallback } from 'react';
import Header2 from './../Common/Header2';
import SEO from './../Common/SEO';
import Banner from './../Elements/Banner';
import GoogleMapReact from 'google-map-react';
import Footer2 from '../Common/Footer2';
var bnrimg = require('./../../images/solar/3.jpg');

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        service: [],
        city: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleServiceCheckbox = useCallback((e) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            let services = [...prev.service];
            if (checked) {
                if (!services.includes(value)) {
                    services.push(value);
                }
            } else {
                services = services.filter((s) => s !== value);
            }
            return { ...prev, service: services };
        });
        // Clear error when user selects a service
        if (errors.service) {
            setErrors(prev => ({ ...prev, service: '' }));
        }
    }, [errors.service]);

    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }

        // Phone validation - must be 10 digits
        if (!formData.phone.trim()) {
            errors.phone = "Phone is required";
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = "Phone must be exactly 10 digits";
        }

        // Email validation
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Please enter a valid email";
        }

        // Service validation - at least one must be selected
        if (!formData.service || formData.service.length === 0) {
            errors.service = "Please select at least one service";
        }

        // City validation
        if (!formData.city.trim()) {
            errors.city = "City is required";
        }

        // Message validation
        if (!formData.message.trim()) {
            errors.message = "Message is required";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("email", formData.email);
    formdata.append("phone", formData.phone);
    formdata.append("message", formData.message);
    // Append each service individually for proper array handling
    formData.service.forEach(service => {
      formdata.append("services[]", service);
    });
    formdata.append("city", formData.city);


        const requestOptions = {
            method: "POST",
            // headers: { "Content-Type": "application/json" },
            body: formdata,
        };

        fetch("https://www.admin.infrioindia.com/api/v2/auth/inquiry-form-store", requestOptions)
            .then(async (response) => {
                const text = await response.text();
                if (!response.ok) {
                    throw new Error(text || 'Request failed');
                }
                return text;
            })
            .then((result) => {
                console.log(result);
                setShowThankYou(true);
                // Reset form after successful submission
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    service: [],
                    city: "",
                    message: "",
                });
                setErrors({});
                // Hide thank you message after 5 seconds and reset loader
                setTimeout(() => {
                    setShowThankYou(false);
                    setIsSubmitting(false);
                }, 5000);
            })
            .catch((error) => {
                console.error(error);
                setIsSubmitting(false);
                alert("Something went wrong. Please try again.");
            });
    };

        const defaultProps = {
            center: {
              lat: 34.073280,
              lng: -118.251410
            },
            zoom: 12
        };

        return (
            <>
                <SEO
                  titleExact
                  title="Contact Infrio India – Get Architectural Solutions"
                  description="Contact Infrio India for expert architectural design, interior design & building solutions. Call, email or visit us to discuss your next project and bring your vision to life with sustainable and creative design."
                  keywords="Infrio contact, architecture consultation India, interior design inquiry, design firm contact info, reach Infrio India, schedule design appointment, sustainable design consultation"
                  canonicalPath="/contact-us"
                />
                <Header2 />
                <div className="page-content">
                    <Banner title="Contact Us Form" pagename="Contact us" description="Our Love for Architecture
                     We are A Passionate Team Dedicated To Creating Stunning Architecture." bgimage={bnrimg}/>
                    {/* SECTION CONTENTG START */}
                    <div className="section-full p-tb80 inner-page-padding">
                        {/* LOCATION BLOCK*/}
                        <div className="container">
                            {/* GOOGLE MAP & CONTACT FORM */}
                            <div className="section-content">
                                <div className="row">
                                    <div className="col-lg-5 col-md-12 m-b30">
                                        <div className="p-a30 bg-white radius-md block-shadow h-100">
                                            <h3 className="m-t0 m-b10">Contact details</h3>
                                            <p className="text-muted m-b25">Reach us for site survey, pricing, or support. We reply quickly during business hours.</p>

                                            <div className="sx-icon-box-wraper left p-b20">
                                                <div className="icon-xs sx-text-primary"><i className="fa fa-phone" /></div>
                                                <div className="icon-content">
                                                    <h5 className="m-t0">Phone</h5>
                                                    <p className="m-b0">(+91) 900-1457-000</p>
                                                </div>
                                            </div>

                                            <div className="sx-icon-box-wraper left p-b20">
                                                <div className="icon-xs sx-text-primary"><i className="fa fa-envelope" /></div>
                                                <div className="icon-content">
                                                    <h5 className="m-t0">Email</h5>
                                                    <p className="m-b0">info@infrioindia.com</p>
                                                </div>
                                            </div>

                                            <div className="sx-icon-box-wraper left">
                                                <div className="icon-xs sx-text-primary"><i className="fa fa-map-marker" /></div>
                                                <div className="icon-content">
                                                    <h5 className="m-t0">Address</h5>
                                                    <p className="m-b0">Shop no 5, Iris Park, Indore</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-7 col-md-12">
                                        <div className="p-a30 bg-white radius-md block-shadow">
                                            <h3 className="m-t0 m-b5">Get a free solar consultation</h3>
                                            <p className="text-muted m-b20">Tell us your city and requirements—our team will share the next steps and an estimate.</p>

                                            <form className="contact-form" onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <input
                                                                name="name"
                                                                type="text"
                                                                required
                                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                                placeholder="Name *"
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <input
                                                                name="phone"
                                                                type="tel"
                                                                required
                                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                                placeholder="Phone *"
                                                                value={formData.phone}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <input
                                                                name="email"
                                                                type="email"
                                                                required
                                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                                placeholder="Email *"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <input
                                                                name="city"
                                                                type="text"
                                                                required
                                                                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                                placeholder="City *"
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.city && <div className="text-danger mt-1">{errors.city}</div>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group m-t10">
                                                    <label className="d-block mb-2 font-13 text-uppercase solar-filter-label">Services *</label>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-check mb-2">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="Architecture"
                                                                    id="service2"
                                                                    checked={formData.service.includes("Architecture")}
                                                                    onChange={handleServiceCheckbox}
                                                                />
                                                                <label className="form-check-label" htmlFor="service2">Rooftop solar design</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-check mb-2">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="Interior Design"
                                                                    id="service1"
                                                                    checked={formData.service.includes("Interior Design")}
                                                                    onChange={handleServiceCheckbox}
                                                                />
                                                                <label className="form-check-label" htmlFor="service1">Installation & commissioning</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-check mb-2">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="Turnkey"
                                                                    id="service3"
                                                                    checked={formData.service.includes("Turnkey")}
                                                                    onChange={handleServiceCheckbox}
                                                                />
                                                                <label className="form-check-label" htmlFor="service3">Commercial EPC</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-check mb-2">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="Others"
                                                                    id="service4"
                                                                    checked={formData.service.includes("Others")}
                                                                    onChange={handleServiceCheckbox}
                                                                />
                                                                <label className="form-check-label" htmlFor="service4">Maintenance / O&amp;M</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {errors.service && <div className="text-danger mt-1">{errors.service}</div>}
                                                </div>

                                                <div className="form-group">
                                                    <textarea
                                                        name="message"
                                                        rows={4}
                                                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                                        required
                                                        placeholder="Message *"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.message && <div className="text-danger mt-1">{errors.message}</div>}
                                                </div>

                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        name="submit"
                                                        type="submit"
                                                        className="site-button btn-half"
                                                        disabled={isSubmitting}
                                                    >
                                                        <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gmap-outline">
                        <GoogleMapReact
                            bootstrapURLKeys={{ 
                                key: "AIzaSyAfY1DRbspf6E3jYUso-PeI_tdfRXA59i0",
                                libraries: ['places']
                            }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                            options={{
                                loading: 'async'
                            }}
                            >
                            <AnyReactComponent lat={34.073280} lng={-118.251410} text={<i className="fa fa-map-marker" />}                                        />
                        </GoogleMapReact>                        
                    </div>
                    {/* SECTION CONTENT END */}
                </div>

                <Footer2 />
                
                {/* Thank You Popup Modal */}
                {showThankYou && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header border-0">
                                    <button 
                                        type="button" 
                                        className="close" 
                                        onClick={() => {
                                            setShowThankYou(false);
                                            setIsSubmitting(false);
                                        }}
                                    >
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body text-center p-4">
                                    <div className="mb-3">
                                        <i className="fa fa-check-circle" style={{ fontSize: '60px', color: '#28a745' }}></i>
                                    </div>
                                    <h3 style={{ color: "#28a745", marginBottom: "20px" }}>Thank You!</h3>
                                    <p>Your message has been submitted successfully.</p>
                                    <p>We'll get back to you soon!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };


export default ContactUs;