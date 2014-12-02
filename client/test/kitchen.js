'use strict';

xdescribe('the kitchen', function(){

  xdescribe('the orders controller', function(){
    var scope, ordersCtrl;

    beforeEach(module('kitchenApp'));

    beforeEach(inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      ordersCtrl = $controller('ordersCtrl', {
        $scope: scope
      });
    }));

    xit('has an orders property as an array', function(){
      expect(scope.orders).to.be.eql([]);
    });

    xit('concatenate the orders coming from an "orders" event', function(){
      scope.$emit('orders', {id: '1'});
      expect(scope.orders).to.be.eql([{id: '1'}]);
    });

  });

  xdescribe('the EventSource directive', function(){
    var fakesource = document.createElement('div');

    beforeEach(module('kitchenApp', function($provide){
      $provide.constant('esource', function(){ return fakesource; });
    }));

    xit('should broadcast an event', function(done){
      inject(function($compile, $rootScope){
        var scope = $rootScope.$new();
        var element = angular.element('<div sse-listener></div>');
        $compile(element)(scope);
        $rootScope.$on('orders', function(evt,data){
          expect(data).to.be.eql({id: '2'});
          done();
        });
        fakesource.dispatchEvent(new CustomEvent('orders', {detail: JSON.stringify({id: '2'})}));
      })
    });

  });

  xdescribe('the arrayze filter', function(){

    beforeEach(module('kitchenApp'));

    xit('group the elements', inject(function(arrayzeFilter){
      expect(arrayzeFilter(4)).to.be.eql([0,1,2,3]);
    }));

  });

});
