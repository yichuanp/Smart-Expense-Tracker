import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`http://localhost:8080/api/auth/returnProfile?token=${token}`, {
            method: 'GET'
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            setOriginalData(data); // store original values for cancel
          } else {
            console.error("Failed to fetch profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUserData(originalData);
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

const handleSaveClick = async () => {
  if (newPassword && newPassword !== confirmPassword) {
    setErrorMessage("Passwords do not match.");
    return;
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("token", token);
  formData.append("username", userData.username);
  formData.append("firstName", userData.firstName);
  formData.append("lastName", userData.lastName);
  formData.append("email", userData.email);

  if (newPassword) {
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
  }

  if (userData.profilePictureFile) {
    formData.append("profilePicture", userData.profilePictureFile);
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/updateProfile", {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      alert("Profile updated successfully.");
      setIsEditing(false);
      setOriginalData({ ...userData });
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const errorText = await response.text();
      setErrorMessage(errorText || "Failed to update profile.");
    }
  } catch (error) {
    console.error("Error during profile update:", error);
    setErrorMessage("An unexpected error occurred.");
  }
};

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <div className="profile-photo">
          {userData.profilePicture ? (
            <img src={`http://localhost:8080/uploads/${userData.profilePicture}`} alt="Profile" />
          ) : (
            <span></span>
          )}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUserData({ ...userData, profilePictureFile: e.target.files[0] })}
            />
          )}
        </div>
        <button onClick={() => navigate("/dashboard")} className="sidebar-button">
          Home
        </button>
        <button onClick={() => navigate("/profile")} className="sidebar-button">
          Profile
        </button>
        <button onClick={() => navigate("/settings")} className="sidebar-button">
          Settings
        </button>
      </div>

      <div className="profile-container">
        <h2>My Profile</h2>

        <div className="profile-field">
          <label>First Name:</label>
          {isEditing ? (
            <input name="firstName" value={userData.firstName || ""} onChange={handleChange} />
          ) : (
            <span>{userData.firstName}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Last Name:</label>
          {isEditing ? (
            <input name="lastName" value={userData.lastName || ""} onChange={handleChange} />
          ) : (
            <span>{userData.lastName}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Email:</label>
          {isEditing ? (
            <input name="email" value={userData.email || ""} onChange={handleChange} />
          ) : (
            <span>{userData.email}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Username:</label>
          {isEditing ? (
            <input
              name="username"
              value={userData.username || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{userData.username}</span>
          )}
        </div>

        {isEditing && (
          <>
            <div className="profile-field">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {!isEditing ? (
          <button className="edit-button" onClick={handleEditClick}>
            Edit Profile
          </button>
        ) : (
          <div className="edit-controls">
            <button className="edit-button" onClick={handleSaveClick}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
