import React, { useState, useEffect } from 'react';
import '../styles/Form.css';

function Form() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phonenumber: [''],
        address: ['']
    });
    // const [apiResponse, setApiResponse] = useState(null);

    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';
        if (name === 'username') {
            if (!value.trim()) {
                error = 'Username is required';
            } else if (value.length < 4) {
                error = 'Username must be at least 4 characters long';
            }
        } else if (name === 'email') {
            if (!value.trim()) {
                error = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = 'Email is invalid';
            }
        } else if (name === 'password') {
            if (!value) {
                error = 'Password is required';
            } else if (value.length < 8) {
                error = 'Password must be at least 8 characters long';
            }
        } else if (name === 'confirmPassword') {
            if (value !== formData.password) {
                error = 'Passwords do not match';
            }
        } else if (name.startsWith('phonenumber')) {
            if (!value.trim()) {
                error = 'Phone number is required';
            } else if (!/^\d{10}$/.test(value)) { // Custom regex for 10-digit phone numbers
                error = 'Phone number is invalid';
            }
        } else if (name.startsWith('address')) {
            if (!value.trim()) {
                error = 'Address is required';
            }
        }
        return error;
    };

    const handleChange = (e, index, field) => {
        const { name, value } = e.target;
        let updatedFields;

        if (field === 'phonenumber' || field === 'address') {
            updatedFields = [...formData[field]];
            updatedFields[index] = value;
            setFormData({ ...formData, [field]: updatedFields });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleAddField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const handleRemoveField = (index, field) => {
        const updatedFields = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updatedFields });
        const updatedErrors = { ...errors };
        delete updatedErrors[`${field}-${index}`];
        setErrors(updatedErrors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted successfully!');
        } else {
            console.log('Form submission failed due to validation errors.');
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const newErrors = validateForm(formData);
    //     setErrors(newErrors);

    //     if (Object.keys(newErrors).length === 0) {
    //         try {
    //             const response = await fetch('https://d3268f5d-5697-43d0-bb11-3dd7286943d0.mock.pstmn.io', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(formData),
    //             });

    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setApiResponse({ success: true, message: 'Form submitted successfully!', data });
    //             } else {
    //                 setApiResponse({ success: false, message: 'Form submission failed. Please try again.' });
    //             }
    //         } catch (error) {
    //             setApiResponse({ success: false, message: 'An error occurred. Please try again.' });
    //         }
    //     } else {
    //         setApiResponse({ success: false, message: 'Form submission failed due to validation errors.' });
    //     }
    // };


    const validateForm = (data) => {
        const errors = {};

        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                data[key].forEach((value, index) => {
                    const error = validateField(`${key}-${index}`, value);
                    if (error) {
                        errors[`${key}-${index}`] = error;
                    }
                });
            } else {
                const error = validateField(key, data[key]);
                if (error) {
                    errors[key] = error;
                }
            }
        });

        return errors;
    };

    useEffect(() => {
        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((value, index) => {
                    const error = validateField(`${key}-${index}`, value);
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [`${key}-${index}`]: error,
                    }));
                });
            } else {
                const error = validateField(key, formData[key]);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [key]: error,
                }));
            }
        });
    }, [formData]);

    return (
        <div className="form-container">
            <h2 className="form-title">Form Validation</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div>
                        <label className="form-label">Username:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && (
                            <span className="error-message">{errors.username}</span>
                        )}
                    </div>
                    <div>
                        <label className="form-label">Email:</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email}</span>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <div>
                        <label className="form-label">Password:</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>
                    <div>
                        <label className="form-label">Confirm Password:</label>
                        <input
                            className="form-input"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword}</span>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <div className="dynamic-field-container">
                        <label className="form-label">Phone no.:</label>
                        {formData.phonenumber.map((phone, index) => (
                            <div key={index} className="dynamic-field">
                                <input
                                    className="form-input"
                                    type="text"
                                    name={`phonenumber-${index}`}
                                    value={phone}
                                    onChange={(e) => handleChange(e, index, 'phonenumber')}
                                />
                                <button
                                    type="button"
                                    className="field-button"
                                    onClick={() => handleAddField('phonenumber')}
                                >
                                    +
                                </button>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="field-button"
                                        onClick={() => handleRemoveField(index, 'phonenumber')}
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        ))}
                        {errors['phonenumber-0'] && (
                            <span className="error-message">{errors['phonenumber-0']}</span>
                        )}
                    </div>
                    <div className="dynamic-field-container">
                        <label className="form-label">Address:</label>
                        {formData.address.map((addr, index) => (
                            <div key={index} className="dynamic-field">
                               
                                <input
                                    className="form-input"
                                    type="text"
                                    name={`address-${index}`}
                                    value={addr}
                                    onChange={(e) => handleChange(e, index, 'address')}
                                />
                                <button
                                    type="button"
                                    className="field-button"
                                    onClick={() => handleAddField('address')}
                                >
                                    +
                                </button>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="field-button"
                                        onClick={() => handleRemoveField(index, 'address')}
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        ))}
                        {errors['address-0'] && (
                            <span className="error-message">{errors['address-0']}</span>
                        )}
                    </div>
                </div>
                <button className="submit-button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Form;
