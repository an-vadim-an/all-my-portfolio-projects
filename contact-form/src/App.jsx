import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Application sent!");
    setFormData({ name: "", email: "", phone: "", message: "", service: "Administrator" });
  };

  return (
    <div className="App">
      <div className="contact-form-container">
        <h2>Contact Form</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group phone-input">
            <FontAwesomeIcon icon={faPhone} className="icon" />
            <PhoneInput
              country={"ru"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{ width: "100%", border: "none", background: "transparent" }}
            />
          </div>
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="message-box"
          />
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default App;
