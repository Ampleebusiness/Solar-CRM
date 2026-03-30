import React from "react";

class ConsultationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      isSubmitting: false,
      showThankYou: false
    };
  }

  validateForm = () => {
    const { formData } = this.props;
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Phone must be exactly 10 digits";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.service || formData.service.length === 0) {
      errors.service = "Please select at least one service";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  clearErrorsOnChange = (fieldName) => {
    // Clear error for specific field when user starts typing
    if (this.state.errors[fieldName]) {
      const newErrors = { ...this.state.errors };
      delete newErrors[fieldName];
      this.setState({ errors: newErrors });
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true });

    const { formData, onResetForm } = this.props; 
    
    // Create FormData for multipart form submission
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

    // Send FormData (no Content-Type header needed, browser sets it automatically)
    fetch("https://www.admin.infrioindia.com/api/v2/auth/inquiry-form-store", {
      method: "POST",
      // Remove Content-Type header for FormData
      body: formdata,
      redirect: "follow"
    })
      .then(async (response) => {
        const text = await response.text();
        if (!response.ok) throw new Error(text || 'Request failed');
        return text;
      })
      .then((result) => {
        console.log(result);
        this.setState({ isSubmitting: false, showThankYou: true });
        // Reset parent form immediately
        if (typeof onResetForm === 'function') {
          onResetForm();
        }
        // Close modal after 3 seconds
        setTimeout(() => {
          this.setState({ showThankYou: false });
          this.props.toggleModal();
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isSubmitting: false });
        alert("Something went wrong. Please try again.");
      });
  }
  render() {
    const { show, toggleModal, formData, handleChange, handleServiceCheckbox, handleSubmit } = this.props;
    const { errors, isSubmitting, showThankYou } = this.state;

    if (!show) return null;

    if (showThankYou) {
      return (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: "20px",
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: "clamp(15px, 3vw, 30px)",
              borderRadius: "10px",
              width: "clamp(320px, 90vw, 400px)",
              textAlign: "center",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <h3 style={{ color: "#28a745", marginBottom: "20px", fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>Thank You!</h3>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', marginBottom: "10px" }}>Your consultation request has been submitted successfully.</p>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)' }}>We'll get back to you soon!</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="modal-overlay"
        style={{
          position: "fixed",
          top: "20px",
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
      >
        <div
          className="modal-content"
          style={{
            background: "#fff",
            padding: "clamp(15px, 3vw, 30px)",
            borderRadius: "10px",
            width: "clamp(320px, 95vw, 500px)",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto"
          }}
        >
          {/* Close Button */}
          <button
            onClick={toggleModal}
            style={{
              position: "absolute",
              top: "clamp(5px, 2vw, 10px)",
              right: "clamp(5px, 2vw, 10px)",
              border: "none",
              background: "transparent",
              fontSize: "clamp(16px, 3vw, 18px)",
              cursor: "pointer",
              padding: "clamp(5px, 1vw, 8px)",
              borderRadius: "50%",
              width: "clamp(30px, 6vw, 35px)",
              height: "clamp(30px, 6vw, 35px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✖
          </button>

          <h3 className="mb-4 text-center" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: 'clamp(15px, 4vw, 25px)' }}>Free Consultation</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => {
                  handleChange(e);
                  this.clearErrorsOnChange('name');
                }}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', padding: 'clamp(8px, 2vw, 12px)' }}
                required
              /> 
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="phone"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={(e) => {
                  handleChange(e);
                  this.clearErrorsOnChange('phone');
                }}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', padding: 'clamp(8px, 2vw, 12px)' }}
                required
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  this.clearErrorsOnChange('email');
                }}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', padding: 'clamp(8px, 2vw, 12px)' }}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label d-block mb-2" style={{color:"#495057", fontSize: 'clamp(14px, 2.5vw, 16px)'}}>Select Services *</label>
              <div  style={{ margin: 0 }}>
                <div className="form-check mb-2" style={{paddingLeft:'0px'}}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="service1"
                    value="Architectural"
                    checked={formData.service.includes("Architectural")}
                    onChange={(e) => {
                      handleServiceCheckbox(e);
                      this.clearErrorsOnChange('service');
                    }}
                    style={{ transform: 'scale(clamp(1.1, 2vw, 1.2))', }}
                  />
                  <label className="" htmlFor="service1" style={{color:"#495057", fontSize: 'clamp(14px, 2.5vw, 16px)', marginLeft: '8px'}}>Architectural Design & Planning</label>
                </div>

                <div className="form-check mb-2" style={{paddingLeft:'0px'}}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="service2"
                    value="Interior"
                    checked={formData.service.includes("Interior")}
                    onChange={(e) => {
                      handleServiceCheckbox(e);
                      this.clearErrorsOnChange('service');
                    }}
                    style={{ transform: 'scale(clamp(1.1, 2vw, 1.2))' }}
                  />
                  <label className="" htmlFor="service2" style={{color:"#495057", fontSize: 'clamp(14px, 2.5vw, 16px)', marginLeft: '8px'}}>Interior Design & Execution</label>
                </div>

                <div className="form-check mb-2" style={{paddingLeft:'0px'}}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="service3"
                    value="Turnkey"
                    checked={formData.service.includes("Turnkey")}
                    onChange={(e) => {
                      handleServiceCheckbox(e);
                      this.clearErrorsOnChange('service');
                    }}
                    style={{ transform: 'scale(clamp(1.1, 2vw, 1.2))' }}
                  />
                  <label className="" htmlFor="service3" style={{color:"#495057", fontSize: 'clamp(14px, 2.5vw, 16px)', marginLeft: '8px'}}>Turnkey Construction Projects</label>
                </div>

                <div className="form-check mb-2" style={{paddingLeft:'0px'}}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="service4"
                    value="Others"
                    checked={formData.service.includes("Others")}
                    onChange={(e) => {
                      handleServiceCheckbox(e);
                      this.clearErrorsOnChange('service');
                    }}
                    style={{ transform: 'scale(clamp(1.1, 2vw, 1.2))' }}
                  />
                  <label className="" htmlFor="service4" style={{color:"#495057", fontSize: 'clamp(14px, 2.5vw, 16px)', marginLeft: '8px'}}>Others</label>
                </div>
                
              </div>
              {errors.service && <div className="text-danger mt-1" style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>{errors.service}</div>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => {
                  handleChange(e);
                  this.clearErrorsOnChange('city');
                }}
                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', padding: 'clamp(8px, 2vw, 12px)' }}
                required
              />
              {errors.city && <div className="invalid-feedback">{errors.city}</div>}  
            </div>

            <div className="mb-3">
              <textarea
                name="message"
                placeholder="Message"
                rows="3"
                value={formData.message}
                onChange={(e) => {
                  handleChange(e);
                  this.clearErrorsOnChange('message');
                }}
                className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', padding: 'clamp(8px, 2vw, 12px)' }}
                required
              />
              {errors.message && <div className="invalid-feedback">{errors.message}</div>}
            </div>

            <button 
              type="submit" 
              className="site-button btn-block" 
              onClick={this.handleClick}
              disabled={isSubmitting}
              style={{ 
                fontSize: 'clamp(14px, 2.5vw, 16px)', 
                padding: 'clamp(10px, 2.5vw, 15px)',
                minHeight: 'clamp(40px, 6vh, 50px)',
                width: '100%'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default ConsultationModal;
