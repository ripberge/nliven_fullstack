angular.module('adminApp', []).
  controller('IndexController', ['$scope', '$http',
  function($scope, $http) {

    //
    // Set apiUrl to your backend REST server to make API calls.  A single url should respond to 
    // GET, PUT, and POST HTTP verbs.
    //
    var apiUrl;
    // var apiUrl = 'http://localhost:3000/api/v1/customers';
    
    $scope.newCustomer = function() {
      clearCustomer();
      $scope.customerEditVisible = true;
    };
    
    $scope.save = function() {
      saveCustomer();
      $scope.customerEditVisible = false;
    };
    
    $scope.cancel = function() {
      clearCustomer();
      $scope.customerEditVisible = false;
    };
    
    $scope.edit = function(clickedRow) {
      $scope.currentCustomer = _.clone(clickedRow.customer);
      $scope.customerEditVisible = true;
    };
    
    var showMessage = $scope.showMessage = function(msg) {
      $scope.message = msg;
    };
    
    $scope.hideMessage = function() {
      $scope.message = null;
    };
    
    function getCustomers() {
      if (apiUrl) {
        $http({ method: 'GET', url: apiUrl}).
        then(function success(response) {
          $scope.customers = response.data;
        }, function error(err) {
          // oops
          $scope.customers = [
            { id: 1, firstName: 'No', lastName: 'API'}
          ];
          showMessage(err.statusText || 'Cannot get customers!');
        });
      } else {
        // For the development exercise, do not modify anything in this else block.
        $scope.customers = [
          { id: 1, firstName: 'Bill', lastName: 'Gates'},
          { id: 2, firstName: 'Steve', lastName: 'Jobs'}
        ];
      }
    }
    
    function saveCustomer() {
      var existingCustomer = !!$scope.currentCustomer.id;
      if (apiUrl) {
        var method = existingCustomer ? 'PUT' : 'POST';
        var url = (existingCustomer ? apiUrl + '/' + $scope.currentCustomer.id : apiUrl); 
        
        $http({ method: method, url: url, data: $scope.currentCustomer}).
        then(function success(response) {
          getCustomers();
        }, function error(err) {
          // oops
        });
        
      } else {
        // For the development exercise, do not modify anything in this else block.
        if (!existingCustomer) {
          var newId = _.max($scope.customers, function(customer) {
              return customer.id;
            }).id + 1;
          $scope.currentCustomer.id = newId;
          $scope.customers.push($scope.currentCustomer);
        } else {
          var editedCustomer = _.find($scope.customers, function(customer) {
            return customer.id === $scope.currentCustomer.id;
          });
          _.extend(editedCustomer, $scope.currentCustomer);
        }
        clearCustomer();
      }
    }
    
    function clearCustomer() {
      $scope.currentCustomer = {};
    }

    getCustomers();
    
  }])
;