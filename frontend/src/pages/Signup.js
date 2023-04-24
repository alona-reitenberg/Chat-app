import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import defaultProfile from "../assets/profile-pic.png";
import plus from "../assets/plus-icon.png";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [signupUser, { isLoading, error }] = useSignupUserMutation(); //hook that give has function that's call to signup User and loading or error if thats not works.
  // const navigate = useNavigate();
  //image upload states
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function validateImg(e) {
    //check the size of the picture
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData(); //upload the image to cloudinary
    data.append("file", image);
    data.append("upload_preset", "Chat-app");
    try {
      setUploadingImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/drcfgq2i6/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!image) return alert("Please upload your profile picture");
    const url = await uploadImage(image); //we call to function "uploadImage" using await
    console.log(url);
    // signup the user
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
        navigate("/chat");
      }
    });
  }
  return (
    <div>
      <Col className="signup-bg d-flex align-items-center justify-content-center flex-direction-column">
        <Form className="container-box" onSubmit={handleSignup}>
          <h1 className="text-center">Create account</h1>
          <div className="signup-profile-photo__container">
            <img
              src={imagePreview || defaultProfile}
              className="signup-profile-photo"
              alt="profile"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              {/* <i className="fas fa-plus-circle add-picture-icon"></i> */}
              <img src={plus} className="add-photo-icon" />
            </label>
            <input
              type="file"
              id="image-upload"
              hidden
              accept="image/png, image/jpeg"
              onChange={validateImg}
            />
          </div>
          {error && <p className="alert alert-danger mt-3">{error.data}</p>}
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Group>
          <div class="text-center mb-3">
            <Button variant="primary" type="submit">
              {uploadingImg ? "Signing you up..." : "Signup"}
            </Button>
          </div>
          <div>
            <p className="text-center">
              Already have an account ? <Link to="/login">Login</Link>
            </p>
          </div>
        </Form>
      </Col>
    </div>
  );
}

export default Signup;
