(function(angular) {

    'use strict';
    var module = angular.module('todoApp', ['ngMaterial']);

    angular.module('todoApp').controller('TodoController', TodoController);

    //This is the application controller
    function TodoController(storageService, $mdDialog, $scope) {
        var vm = this;

        vm.selectedItem = [];
        vm.items = storageService.get() || [];


        vm.notDone = function(item) {
            return item.done == false;
        }

        vm.done = function(item) {
            return item.done == true;
        }

        vm.all = function(item) {
            return true;
        }

        //Delete the current selected item, if any
        vm.deleteItem = function(ev) {

            if (vm.selectedItem!=[]) {
                var index=-1;
                var i=0;
                var msg;

                if(vm.selectedItem.length==1) msg='The task ' +'"'+vm.selectedItem[i].title+'"';
                else msg='The tasks selected ';
                var confirm = $mdDialog.confirm()

                 .textContent('' + msg + ' will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        while(i<vm.selectedItem.length){
                        index = vm.items.indexOf(vm.selectedItem[i]);
                        if (index != -1) {
                            vm.items.splice(index, 1);
                            storageService.set(vm.items);
                        }
                        i++;
                    }
                    vm.selectedItem = [];
                    }
                });
            }
        }

        //Creates a new item with the given parameters
        vm.createItem = function(title, description, priority, done, tags, date, time, estimated_work) {
            vm.items.push({
                title: title,
                description: description,
                priority: priority || 0,
                done: done || false,
                tags: tags,
                date: date || Date.now(),
                time: time || "00:00",
                estimated_work: estimated_work
            });
            storageService.set(vm.items);
        }

    vm.addTask= function(ev){
        vm.selectedItem = [];
        $mdDialog.show({
        clickOutsideToClose: true,
          template:
            '<md-dialog class="my-dialog">' +
            '   <h3>Add task</h3>'+
            '   <md-input-container class="my-container">'+
            '   <label>Title</label>'+
            '   <input type="text" ng-model="vm.title" required>'+
            '   </md-input-container>'+
            '   <md-input-container class="my-container">'+
            '   <label>Description</label>'+
            '   <input type="text" ng-model="vm.description">'+
            '   </md-input-container>'+
            '   <md-input-container  class="my-container">'+
            '   <label>Priority</label>'+
            '   <md-select name="type" ng-model="vm.priority">'+
            '       <md-option value="1">High</md-option>'+
            '       <md-option value="0">Normal</md-option>'+
            '       <md-option value="-1">Low</md-option>'+
            '   </md-select>'+
            '   </md-input-container>'+
            '   <md-input-container class="my-container">'+
            '   <label>Tags</label>'+
            '   <input type="text" ng-model="vm.tags">'+
            '   </md-input-container>'+
            '   <div class="my-container-datetime">'+
            '   <div class="my-datetime" layout="row">'+
            '   <md-input-container>'+
            '   <label>Date</label>'+
            '       <md-datepicker ng-model="vm.date"></md-datepicker>'+
            '   </md-input-container>'+
            '   <md-input-container>'+
            '   <label>Time</label>'+
            '   <input type="time" ng-model="vm.time"></input>'+
            '   </md-input-container>'+
            '   </div>'+
            '   </div>'+
            '   <md-input-container class="my-container">'+
            '   <label>Estimated work in hours</label>'+
            '   <input type="text" ng-model="vm.estimated_work">'+
            '   </md-input-container>'+
            '  <md-dialog-actions>' +
            '    <md-button ng-click="addItem(vm)" class="md-primary">' +
            '      Add' +
            '    </md-button>' +
            '    <md-button ng-click="closeDialog()" class="md-primary">' +
            '      Close' +
            '    </md-button>' +
            '  </md-dialog-actions>' +
            '</md-dialog>',
          controller: function DialogController($scope, $mdDialog) {
            $scope.closeDialog = function() {
              $mdDialog.hide();
            }
            $scope.addItem = function (result) {
                if (result)
                    vm.createItem(result.title, result.description, result.priority, result.done, result.tags, result.date, result.time, result.estimated_work);
                $mdDialog.hide();
          }
          }
        });
    }
    }


})(window.angular);