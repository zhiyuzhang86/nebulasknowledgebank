import React from "react";
import PropTypes from "prop-types";
import "./Contact.css";

function Contact(props) {
  return (
    <div className="contact">
        <span>Address: {props.address}  Content: {props.content}</span>
    </div>
  );
}

Contact.propTypes = {
    address: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
};

export default Contact;
