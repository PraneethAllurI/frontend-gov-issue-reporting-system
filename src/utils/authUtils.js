export const saveAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
  };
  
  export const saveRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };
  
  export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
  };

  export const removeAccessToken = () => {
    localStorage.removeItem('accessToken');
  }
  export const removeRefreshToken = () => {
    localStorage.removeItem('refreshToken');
  }

  export const removeRole = () => {
    localStorage.removeItem('role');
  }
  export const saveRole = (role) => {
    localStorage.setItem('role', role);
  };
  export const getRole = () => {
    return localStorage.getItem('role');
  };
  