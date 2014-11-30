'use strict';

describe('the kitchen', function(){

  describe('the orders controller', function(){
    var scope, ordersCtrl;

    beforeEach(module('kitchenApp'));

    beforeEach(inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      ordersCtrl = $controller('ordersCtrl', {
        $scope: scope
      });
    }));

    it('has an orders property as an array', function(){
      expect(scope.orders).to.be.eql([]);
    });

    it('concatenate the orders coming from an "orders" event', function(){
      scope.$emit('orders', {id: '1'});
      expect(scope.orders).to.be.eql([{id: '1'}]);
    });

  });

  describe('the EventSource directive', function(){
    var fakesource = document.createElement('div');

    beforeEach(module('kitchenApp', function($provide){
      $provide.constant('esource', function(){ return fakesource; });
    }));

    it('should broadcast an event', function(done){
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

  describe('the arrayze filter', function(){

    beforeEach(module('kitchenApp'));

    it('group the elements', inject(function(arrayzeFilter){
      expect(arrayzeFilter(4)).to.be.eql([0,1,2,3]);
    }));

  });

});
