document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        showSuccessAlert('Login successful!', '/Dashboard/index.html');
        // Perform additional actions after successful login if needed
      } else {
        const errorData = await response.json();
        const errorType = errorData.errorType || '';
  
        if (errorType === 'emailNotRegistered') {
          showErrorAlert('Email is not registered.');
        } else if (errorType === 'wrongPassword') {
          showErrorAlert('Wrong password.');
        } else {
          showErrorAlert(errorData.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
  
      // Check if the error is a network error
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        showErrorAlert('Network error: Unable to connect to the server.');
      } else {
        showErrorAlert('An unexpected error occurred.');
      }
    }
  });
  
  function showSuccessAlert(message, redirectTo) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the specified URL
        window.location.href = redirectTo;
      }
    });
  }
  
  function showErrorAlert(errorMessage) {
    Swal.fire({
      icon: 'error',
      title: 'Error during login',
      text: errorMessage,
    });
  }