export const checkAuthToken = (): boolean => {
    const token = localStorage.getItem('auth-token');
    return token !== null;
  };
export const getAuthToken = (): string => {
    const data = localStorage.getItem('auth-token');
    let parsedData;
    let token=""
    if(data){
      parsedData=JSON.parse(data);
      token=parsedData.token
    }

    return token;
  };