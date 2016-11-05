(function() {
    'use strict';

    angular
        .module('todoApp')
        .directive('customList', directive);

    function directive() {
        return {
            scope: {},
            bindToController: {
                items: '=',
                selectedItem: '=',
                filterFunction: '=',
            },
            controller: customListController,
            controllerAs: 'customListCtrl',
            transclude: true,
            restrict: 'E',
            template: '' +
                '<md-content class="md-padding scroll tab-content">' +
                '<md-content>'+
                '<i class="material-icons">search</i>'+
                '<md-input-container>'+
                ' <input type="search" ng-model="customListCtrl.q" placeholder="search task..." aria-label="search task"/>'+
                '</md-input-container>'+
                ' <tr> '+
                '   <th> '+
                ' <b>Order by</b>   '+
                '        <md-button class="btn1 md-raised md-primary" ng-click="customListCtrl.sortBy(\'title\')">Title</md-button> '+
                '       <span class="sortorder" ng-show="customListCtrl.propertyName === \'title\' " ng-class="{reverse: customListCtrl.reverse}"></span>'+
                '   </th> '+
                ' </tr>'+
                '    <th> '+
                '        <md-button class="btn1 md-raised md-primary" ng-click="customListCtrl.sortBy(\'date\')">Date</md-button> '+
                '        <span class="sortorder" ng-show="customListCtrl.propertyName === \'date\' " ng-class="{reverse: customListCtrl.reverse}"></span> '+
                '    </th> '+
                '</md-content>'+
                '    <md-list>' +
                '        <md-list-item class="md-2-line" ng-repeat="item in customListCtrl.items |  filter: customListCtrl.q | filter: customListCtrl.filterFunction | orderBy:customListCtrl.propertyName:customListCtrl.reverse" ng-class="customListCtrl.selectedItem[customListCtrl.multiSelection(item)]==item ? \'selected\':\'\'" ng-click="customListCtrl.toggleSelection(item)">'+
                '            <md-button ng-click="customListCtrl.changePriority(item)" class="md-icon-button" aria-label="Priority">' +
                '                <md-icon style="color: green" ng-if="item.priority == -1">low_priority</md-icon>' +
                '                <md-icon ng-if="item.priority == 0">label</md-icon>' +
                '                <md-icon style="color: red" ng-if="item.priority == 1">priority_high</md-icon>' +
                '            </md-button>' +
                '            <div class="md-list-item-text">' +
                '                <h3>{{item.title}}</h3>' +
                '                <p>{{item.date | date: "MM-dd-yyyy"}}' +
                '                    {{item.time | date: "HH:mm"}}</p>'+
                '            <div layout="row">' +
                '               <span ng-if="checked" class="animate-if">'+
                '               <p><u>Description:</u> {{item.description}}</p>' +
                '               <p><u>Priority:</u> {{item.priority}}</p>' +
                '               <p><u>Tags:</u> {{item.tags}}</p>' +
                '               <p><u>Estimated works:</u> {{item.estimated_work}}</p>' +
                '               </span>'+
                '            </div>' +
                '            </div>' +
                '           <i class="material-icons">remove_red_eye</i>'+
                '           <md-checkbox ng-model="checked" ng-init="checked=false" />'+
                '           </md-checkbox>'+
                '           <md-button class="md-primary md-hue-1" aria-label="Modify" ng-click="customListCtrl.modifyTask(item)">'+
                '               <md-icon>create</md-icon>'+
                '           </md-button>'+
                '            <md-checkbox ng-model="item.done" ng-change="customListCtrl.checkStateChanged()" class="md-primary md-align-top-right">' +
                '            </md-checkbox>' +
                '            <md-divider></md-divider>' +
                '        </md-list-item>' +
                '    </md-list>' +
                '</md-content>'
        };
    }
    //Directive controller
    function customListController(storageService, $mdDialog, $scope) {
        var vm = this;

        vm.propertyName = 'title';
        vm.reverse = true;
        vm.selectedItem = [];

        
        vm.sortBy = function(propertyName) {
           vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
           vm.propertyName = propertyName;
           vm.selectedItem = [];
        
        };

        //Changes the priority of the given item
        vm.changePriority = function(item) {
            if (item.priority <= 0)
                item.priority++;
            else
                item.priority = -1;

            storageService.set(vm.items);
        }

        //Occurs when the status of an items changes
        vm.checkStateChanged = function() {
            storageService.set(vm.items);
        }

        //Select or deselect the given item
        vm.toggleSelection = function(item) {
            var temp=1;
            var j=0;

                while(j<vm.selectedItem.length){
                    if(vm.selectedItem[j]==item){
                        temp=0;
                        vm.selectedItem.splice(j, 1);
                    }
                    j++;
                }

            if(temp==1){
                 vm.selectedItem[vm.selectedItem.length] = item;
            }
        }

        vm.multiSelection = function(item){
            var i=0;
            while(i<vm.selectedItem.length){
                if(vm.selectedItem[i] == item)
                    return i;
                i++;
            }
        }

        vm.modifyTask = function(item){
                $mdDialog.show({
        clickOutsideToClose: false,
          template:
            '   <md-dialog class="my-dialog">' +
            '   <h3>Add task</h3>'+
            '   <md-input-container class="my-container">'+
            '   <label>Title</label>'+
            '   <input type="text" ng-model="mod_item.title" ng-model-options="{ updateOn: \'blur\' }">'+
            '   </md-input-container>'+
            '   <md-input-container class="my-container">'+
            '   <label>Description</label>'+
            '   <input type="text" ng-model="mod_item.description" ng-model-options="{ updateOn: \'blur\' }">'+
            '   </md-input-container>'+
            '   <md-input-container  class="my-container">'+
                '   <label>Priority</label>'+
                 '<md-select name="type" ng-model="mod_item.priority">'+
                '<md-option value="1">High</md-option>'+
                '<md-option value="0">Normal</md-option>'+
                '<md-option value="-1">Low</md-option>'+         
                ' </md-select>'+
                '   </md-input-container>'+
            '   <md-input-container class="my-container">'+
            '   <label>Tags</label>'+
            '   <input type="text" ng-model="mod_item.tags" ng-model-options="{ updateOn: \'blur\' }">'+
            '   </md-input-container>'+
            '   <div class="my-container-datetime">'+
            '   <div class="my-datetime" layout="row">'+
            '   <md-input-container>'+
            '   <label>Date</label>'+
            '       <md-datepicker ng-model="mod_item.date"></md-datepicker>'+
            '   </md-input-container>'+
            '   <md-input-container>'+
            '   <label>Time</label>'+
            '   <input type="time" ng-model="mod_item.time"></input>'+
            '   </md-input-container>'+
            '   </div>'+
            '   </div>'+
            '   <md-input-container class="my-container">'+
            '   <label>Estimated work in hours</label>'+
            '   <input type="text" ng-model="mod_item.estimated_work" ng-model-options="{ updateOn: \'blur\' }">'+
            '   </md-input-container>'+
            '  <md-dialog-actions>' +
            '    <md-button ng-click="closeDialog()" class="md-primary">' +
            '      Close' +
            '    </md-button>' +
            '  </md-dialog-actions>' +
            '</md-dialog>',
          controller: function DialogController($scope, $mdDialog) {
                $scope.mod_item=item;
               
                $scope.closeDialog = function() {
                    storageService.set(vm.items);
                    $mdDialog.hide();                 
                }
          }

        });
        }

    }
})();