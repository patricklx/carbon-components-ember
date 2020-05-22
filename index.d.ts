import DialogManager from './addon/services/dialog-manager'
import Notifications from './addon/services/notifications'

declare namespace CarbonComponentsEmber {
  class DialogManagerService extends DialogManager {}
  class NotificationsService extends Notifications {}
}

declare module '@ember/service' {
  interface Registry {
    'carbon-components-ember@dialog-manager': CarbonComponentsEmber.DialogManagerService
    'carbon-components-ember@notifications': CarbonComponentsEmber.NotificationsService
  }
}
