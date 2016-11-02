angular.module('adminApp', []).
  controller('IndexController', ['$scope', '$http',
  function($scope, $http) {

    //
    // Set apiUrl to your backend REST server to make API calls.  Otherwise, leave null to 
    // use demo mode.
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
    
    function getCustomers() {
      if (apiUrl) {
        $http({ method: 'GET', url: apiUrl}).
        then(function success(response) {
          $scope.customers = response.data.results;
        }, function error(err) {
          // oops
        });
      } else {
        $scope.customers = [
          { id: 1, firstName: 'Bill', lastName: 'Gates'},
          { id: 2, firstName: 'Steve', lastName: 'Jobs'}
        ]
      }
    }
    
    function saveCustomer() {
      var existingCustomer = !!$scope.currentCustomer.id;
      if (apiUrl) {
        var method = existingCustomer ? 'PUT' : 'POST';
        var url = (existingCustomer ? apiUrl + '/' + $scope.currentCustomer.id : apiUrl); 
        
        $http({ method: method, url: url}).
        then(function success(response) {
          getCustomers();
        }, function error(err) {
          // oops
        });
        
      } else {
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