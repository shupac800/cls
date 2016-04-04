app.factory("authFactory", function() {
  var ref = new Firebase("https://cls.firebaseio.com");

  return {
    /*
      Determine if the client is authenticated
     */
    isAuthenticated() {
      var authData = ref.getAuth();

      if (authData) {
        return true;
      } else {
        return false;
      }
    },
    /*
      Authenticate the client via Firebase
     */
    authenticate(credentials) {
      return new Promise(function(resolve, reject) {
        ref.authWithPassword({
          "email": credentials.email,
          "password": credentials.password
        }, function(error, authData) {
          if (error) {
            reject(error);
          } else {
            console.log("authWithPassword method completed successfully");
            resolve(authData);
          }
        });
      });
    }
  };
});
