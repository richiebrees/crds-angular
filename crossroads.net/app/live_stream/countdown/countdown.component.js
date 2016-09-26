import controller from './countdown.controller';

CountdownComponent.$inject = [];

export default function CountdownComponent() {

  let countdownComponent = {
    restrict: 'E',
    templateUrl: 'countdown/countdown.html',
    controller: controller,
    controllerAs: 'countdown',
    bindToController: true
  }

  return countdownComponent;
}