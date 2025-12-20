import { useState } from 'react';
import '../styles/Register.css';

const Register = () => {
  const defaultValues = {
    username: "usuario",
    email: "mail",
    password: "contraseña",
    confirmPassword: "repetir contraseña",
  };

  const [formData, setFormData] = useState({ ...defaultValues });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  //Validar todos los campos
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username === defaultValues.username) {
      newErrors.username = "Debe ingresar un usuario";
    } else if (formData.username.trim().length <= 6) {
      newErrors.username = "El usuario debe tener más de 6 caracteres";
    }

    if (!formData.email || formData.email === defaultValues.email) {
      newErrors.email = "Debe ingresar un email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Mail no válido";
      }
    }

    if (!formData.password || formData.password === defaultValues.password) {
      newErrors.password = "Debe ingresar una contraseña";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    if (
      !formData.confirmPassword ||
      formData.confirmPassword === defaultValues.confirmPassword
    ) {
      newErrors.confirmPassword = "Debe repetir la contraseña";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return newErrors;
  };

  //Borrar texto por defecto o error al enfocar
  const handleFocus = (e) => {
    const { name } = e.target;

    if (errors[name] || formData[name] === defaultValues[name]) {
      setFormData((prev) => ({ ...prev, [name]: "" }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Si es password, mostrar asteriscos al escribir
    if (name === "password" || name === "confirmPassword") {
      setShowPassword((prev) => ({ ...prev, [name]: true }));
    }
  };

  //Actualizar valores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Validar al hacer click en registrar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const foundErrors = validateForm();

    if (Object.keys(foundErrors).length === 0) {
      try {
        const res = await fetch(`${API_URL}/api/auth/register`, { // cambia a tu URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        console.log("Respuesta backend:", data);

        if (res.ok) {
          alert("✅ Registro exitoso");
          setFormData({ ...defaultValues });
          setErrors({});
          setShowPassword({ password: false, confirmPassword: false });
          setSubmitted(false);
        } else {
          alert(`❌ Error: ${data.message || 'Algo salió mal'}`);
        }
      } catch (err) {
        console.error(err);
        alert("❌ No se pudo conectar al servidor");
      }
    }
  };

  //Determinar tipo de input
  const getInputType = (name) => {
    if (
      (name === "password" || name === "confirmPassword") &&
      showPassword[name]
    ) {
      return "password";
    }
    return "text";
  };

  //Placeholder dinámico
  const getPlaceholder = (name) => {
    if (submitted && errors[name]) return errors[name];
    return formData[name];
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        {["username", "email", "password", "confirmPassword"].map((field) => (
          <div key={field}>
            <input
              type={getInputType(field)}
              name={field}
              value={submitted && errors[field] ? "" : formData[field]}
              placeholder={getPlaceholder(field)}
              onFocus={handleFocus}
              onChange={handleChange}
              className={submitted && errors[field] ? "error" : ""}
            />
          </div>
        ))}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;











