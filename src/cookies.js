const Cookies = {
  get (key) {
    let cookie = document.cookie.split('; ').find(cookie => cookie.startsWith(key + '='));
    if (!cookie) {
      return;
    }
    
    const value = decodeURIComponent(cookie.replace(key + '=', ''));
    if (value.startsWith('j:')) {
      return JSON.parse(value.slice(2));
    } else {
      return value;
    }
  },
  
  remove(key) {
    document.cookie.split(';')
      .forEach(c => { 
  	    document.cookie = c.replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });


  }
};

export default Cookies;